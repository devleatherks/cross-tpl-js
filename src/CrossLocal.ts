import { CrossTplConstructorOptions, CrossTplFilesContentObject } from './header';
import * as fs from 'fs';
import { CrossTplCore, PLUGIN_CROSS_LOCAL } from './CrossCore';
import { Steps, RawSteps, RawStep } from "./Steps";
var watch = require("gulp-watch");

export class CrossLocal { 
    #core: CrossTplCore;

    constructor(options: CrossTplConstructorOptions) {
        this.#core = new CrossTplCore();
        this.#core.options = options;
    }

    public build() {
        const steps = new Steps(5);

        const collection = this.#core.getLocalCollection(this.localDir(), steps);

        // console.log(collection);

        return this.isUpload() ? this.upload(collection, steps) : this.create(collection, steps);
    }

    private create(files: Map<string, CrossTplFilesContentObject[]>, steps: any) {
        let body: string = ''; 

        files.forEach((filesMime: Array<CrossTplFilesContentObject>, key) => {
            body += this.#core.generateTemplateBodyLocal(filesMime, key);
        });

        const main = this.#core.generateTemplateMainLocal(body);

        let row = steps.advance('Engine assembly', 'recycle').start();

        fs.writeFileSync(this.outDirTs(), main);

        row.update('Code generation');

        this.#core.buildTsToJs(this.outDirTs(), this.outDir()).then(() => {
            row.update('Build Code');

            fs.writeFileSync(
                this.outDirJs(),
                this.#core.generateTemplateBase(this.outDirJs(), PLUGIN_CROSS_LOCAL),
            );

            fs.unlinkSync(this.outDirTs());

            row.success('Cross-tpl assembled', 'white_check_mark');
        });
    }

    public watch() {
        const steps = new Steps(5);

        watch(this.#core.getOption('templates') + '/**/*', (file: any) => {
            // this.upload([file.path], steps);
        });
    }

    private upload(files: Map<string, CrossTplFilesContentObject[]>, steps: any) {
        // const filesMime = this.#core.getFilesContent(files, [], steps);
        // let template = fs.readFileSync(this.outDirJs(), 'utf8');

        // let row = steps.advance('Templates upload', 'recycle').start();

        // template = this.#core.replaceTemplateBody(template, filesMime, steps.advance('Replace upload', 'recycle').start());
        // template = this.#core.addTemplateBody(template, filesMime, steps.advance('Add Templates', 'recycle').start());
        // template = this.#core.removeTemplateBody(template, steps.advance('Remove Templates', 'recycle').start());

        // fs.writeFileSync(this.outDirJs(), template);

        // row.success('Cross-tpl upload', 'white_check_mark');
    }

    public outDir() {
        return (this.#core.getOptions('outDir') || '');
    }

    public localDir() {
        return (this.#core.getOptions('dirname') || '') + '/' + (this.#core.getOptions('localDir') || '');
    }

    public outDirJs() {
        return this.outDir() + '/' + 'CrossLocal.js';
    }

    public outDirTs() {
        return this.outDir() + '/' + 'CrossLocal.ts';
    }

    public isSourceJs(): boolean {
        if (fs.existsSync(this.outDirJs())) {
            return true;
        }

        return false;
    }

    public isUpload(): boolean {
        // if (this.#core.getOptions('upload') && this.isSourceJs()) {
        //     return true;
        // }
        return false;
    }
}