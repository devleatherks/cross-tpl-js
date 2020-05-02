import { CrossTplConstructorOptions, CrossTplFilesContentObject } from './header';
import * as fs from 'fs';
import { CrossTplCore, PLUGIN_CROSS_TPL } from './CrossCore';
import { Steps, RawSteps, RawStep } from "./Steps";
var watch = require("gulp-watch");

export class CrossTpl {
    #core: CrossTplCore;

    constructor(options: CrossTplConstructorOptions) {
        this.#core = new CrossTplCore();
        this.#core.options = options;
    }

    public build() {
        const steps = new Steps(5);

        const files = this.#core.getTemplateFiles(false, steps);

        return this.isUpload() ? this.upload(files, steps) : this.create(files, steps);
    }

    private create(files: Array<string>, steps: any) {
        const filesMime = this.#core.getFilesContent(files, [], steps);

        const body = this.#core.generateTemplateBody(filesMime, steps);
        const main = this.#core.generateTemplateMain(body);

        let row = steps.advance('Engine assembly', 'recycle').start();

        fs.writeFileSync(this.outDirTs(), main);

        row.update('Code generation');

        this.#core.buildTsToJs(this.outDirTs(), this.outDir()).then(() => {
            row.update('Build Code');

            fs.writeFileSync(
                this.outDirJs(),
                this.#core.generateTemplateBase(this.outDirJs(), PLUGIN_CROSS_TPL),
            );

            fs.unlinkSync(this.outDirTs());

            row.success('Cross-tpl assembled', 'white_check_mark');
        });
    }

    public watch() {
        const steps = new Steps(5);

        watch(this.#core.getOption('templates') + '/**/*', (file: any) => {
            this.upload([file.path], steps);
        });
    }

    private upload(files: Array<string>, steps: any) {
        const filesMime = this.#core.getFilesContent(files, [], steps);
        let template = fs.readFileSync(this.outDirJs(), 'utf8');

        let row = steps.advance('Templates upload', 'recycle').start();

        template = this.#core.replaceTemplateBody(template, filesMime, steps.advance('Replace upload', 'recycle').start());
        template = this.#core.addTemplateBody(template, filesMime, steps.advance('Add Templates', 'recycle').start());
        template = this.#core.removeTemplateBody(template, steps.advance('Remove Templates', 'recycle').start());

        fs.writeFileSync(this.outDirJs(), template);

        row.success('Cross-tpl upload', 'white_check_mark');
    }

    public outDir() {
        return (this.#core.getOptions('outDir') || '');
    }

    public outDirJs() {
        return this.outDir() + '/' + 'CrossTemplates.js';
    }

    public outDirTs() {
        return this.outDir() + '/' + 'CrossTemplates.ts';
    }

    public isSourceJs(): boolean {
        if (fs.existsSync(this.outDirJs())) {
            return true;
        }

        return false;
    }

    public isUpload(): boolean {
        if (this.#core.getOptions('upload') && this.isSourceJs()) {
            return true;
        }
        return false;
    }
}