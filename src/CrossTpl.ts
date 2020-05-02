import { CrossTplConstructorOptions, CrossFile } from './header';
import * as fs from 'fs';
import { CrossTplCore, PLUGIN_CROSS_TPL } from './CrossCore';
import { Disk } from './Helpers/Disk';
import { Spinner } from './Helpers/Spinner';
var watch = require("gulp-watch");

export class CrossTpl {
    #core: CrossTplCore;

    constructor(options: CrossTplConstructorOptions) {
        this.#core = new CrossTplCore();
        this.#core.options = options;
        this.#core.console = new Spinner('Cross-tpl');
    }

    public async build() {
        const list: Array<string> = Disk.list(this.dir);
        const files = await this.#core.load(list, false);

        return this.isUpload() ? this.upload(files) : this.create(files);
    }

    private create(files: CrossFile[], body: Array<string> = []) {
        this.#core.console.text('Create [' + files.length  + ']');

        files.forEach((filesMime: CrossFile) => {
            body.push(this.#core.body(filesMime));
        });

        const main = this.#core.main(body.join(''), false);

        fs.writeFileSync(this.outDirTs, main);

        this.#core.console.text('Script generation');

        this.#core.buildTsToJs(this.outDirTs, this.outDir()).then(() => {
            this.#core.console.text('We pack the structure');

            fs.writeFileSync(
                this.outDirJs,
                this.#core.generateTemplateBase(this.outDirJs, PLUGIN_CROSS_TPL),
            );

            fs.unlinkSync(this.outDirTs);

            this.#core.console.succeed('Success! Done');
        });
    }

    public watch() {
        watch(this.dir + '/**/*', async (file: any) => {
            this.upload(await this.#core.load([file.path], true));
        });
    }

    private upload(files: CrossFile[]) {
        let template = fs.readFileSync(this.outDirJs, 'utf8');

        template = this.#core.refresh(files, template);
        template = this.#core.add(files, template);
        template = this.#core.remove(files, template);

        fs.writeFileSync(this.outDirJs, template);
    }

    public get dir(){
        return (this.#core.getOptions('dirname') || '') + '/' + (this.#core.getOptions('templates') || '');
    }

    public outDir() {
        return (this.#core.getOptions('outDir') || '');
    }

    public get outDirJs() {
        return this.outDir() + '/' + 'CrossTemplates.js';
    }

    public get outDirTs() {
        return this.outDir() + '/' + 'CrossTemplates.ts';
    }

    public isSourceJs(): boolean {
        if (fs.existsSync(this.outDirJs)) {
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