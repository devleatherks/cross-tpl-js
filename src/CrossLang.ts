import { CrossTplConstructorOptions, CrossFile } from './header';
import * as fs from 'fs';
import { CrossTplCore, PLUGIN_CROSS_LOCAL } from './CrossCore';
import { Disk } from './Helpers/Disk';
import { Spinner } from './Helpers/Spinner';
var watch = require("gulp-watch");

export class CrossLang {
    #core: CrossTplCore;

    constructor(options: CrossTplConstructorOptions) {
        this.#core = new CrossTplCore();
        this.#core.options = options;
        this.#core.console = new Spinner('Cross-tpl');
    }

    public async build() {
        const list: Array<string> = Disk.list(this.src);
        const files = await this.#core.load(list, true);

        return this.isUpload() ? this.upload(files) : this.create(files);
    }

    private create(files: CrossFile[], body: Array<string> = []) {
        this.#core.console.text('Create [' + files.length  + ']');

        files.forEach((filesMime: CrossFile) => {
            body.push(this.#core.body(filesMime));
        });

        const main = this.#core.main(body.join(''), true);

        fs.writeFileSync(this.outDirTs, main);

        this.#core.console.text('Script generation');

        this.#core.buildTsToJs(this.outDirTs, this.outDir()).then(() => {
            this.#core.console.text('We pack the structure');

            fs.writeFileSync(
                this.outDirJs,
                this.#core.generateTemplateBase(this.outDirJs, PLUGIN_CROSS_LOCAL),
            );

            fs.unlinkSync(this.outDirTs);

            this.#core.console.succeed('Success! Done');
        });
    }

    public watch() {
        watch(this.src + '/**/*', async (file: any) => {
            this.upload(await this.#core.load([file.path], true));
        });
    }

    private async upload(files: CrossFile[]) {
        let template = fs.readFileSync(this.outDirJs, 'utf8');

        template = this.#core.refresh(files, template);
        template = this.#core.add(files, template);
        
        const list: Array<string> = Disk.list(this.src);
        template = this.#core.remove(await this.#core.load(list, true), template);

        fs.writeFileSync(this.outDirJs, template);
    }

    public outDir() {
        return (this.#core.getOptions('outDir') || '');
    }

    public get src() {
        return (this.#core.getOptions('dirname') || '') + '/' + (this.#core.getOptions('src') || '');
    }

    public get outDirJs() {
        return this.outDir() + '/' + 'CrossLocal.js';
    }

    public get outDirTs() {
        return this.outDir() + '/' + 'CrossLocal.ts';
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