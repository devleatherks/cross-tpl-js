import { CrossTplConstructorOptions, CrossTplFilesContentObject } from './header';
import * as fs from 'fs';
import * as nodePathModule from 'path';
import { Base64 } from 'js-base64';
import { Md5 } from "md5-typescript";
import { Steps, RawSteps, RawStep } from "./Steps";
const { spawn } = require("child_process");
var gulp = require("gulp");
var watch = require("gulp-watch");
var ts = require("gulp-typescript");

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
                this.#core.generateTemplateBase(this.outDirJs()),
            );

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

const CROSS_MODULE_WINDOW_BW = 'window';
const CROSS_MODULE_COMMON_JS = 'common';

class CrossTplCore {
    /**
     * @var {boolean} debug
     * @private
     */
    #debug: boolean = false;

    /**
     * @var {boolean} debug
     * @private
     */
    #options: CrossTplConstructorOptions = {
        dirname: void 0,
        debug: true,
        templates: void 0,
        outDir: __dirname + '/dist',
        templatesBody: __dirname + '/templates/cross-tpl-body.txt',
        templatesMain: __dirname + '/templates/cross-tpl-main.txt',
        templatesBase: __dirname + '/templates/cross-tpl-base.txt',
        templatesModuleWindow: __dirname + '/templates/cross-tpl-module-window.txt',
        templatesModuleCommon: __dirname + '/templates/cross-tpl-module-common.txt',
        moduleBuild: CROSS_MODULE_COMMON_JS,
        templatesWrapper: __dirname + '/templates/cross-tpl-wrapper.txt',
        contentBase64: true,
        upload: true,
        dirHash: true
    };

    /**
     * @var {boolean} debug
     * @private
     */
    #optionsDebug: Array<string> = [];

    public generateTemplateBody<T extends CrossTplFilesContentObject>(filesContent: Array<T>, steps: any): string {
        let body: string = (new String()).toString();

        const row = steps.advance('Template Packing', 'mag').start();

        filesContent.forEach(async (file: T) => {
            row.update(file, 'warning');

            body += this.createTemplateBody(file);
        });

        row.success('Templates successfully packaged', 'white_check_mark');

        return body;
    }

    public createTemplateBody<T extends CrossTplFilesContentObject>(file: T): string {
        let bodyTemplate = fs.readFileSync(<string>this.#options.templatesBody, 'utf8');
        let contact = fs.readFileSync(<string>this.#options.templatesWrapper, 'utf8');
        let bodyReplace: string = bodyTemplate + '\n\r';

        contact = contact.replace('<%%file_dir%%>', file.file.replace(this.#options.dirname + '/', ''));
        contact = contact.replace('<%%version%%>', String(file.mime.modified.getTime()));
        contact = contact.replace('<%%content%%>', file.mime.content);

        bodyReplace = bodyReplace.replace(new RegExp('\\<%%hash%%\\>', 'g'), Md5.init(file.file.replace(this.#options.dirname + '/', '')));
        bodyReplace = bodyReplace.replace('<%%content%%>', Base64.encode(contact));
        bodyReplace = bodyReplace.replace('<%%file_dir%%>', file.file.replace(this.#options.dirname + '/', ''));
        bodyReplace = bodyReplace.replace('<%%size%%>', String(file.mime.size));
        bodyReplace = bodyReplace.replace('<%%create%%>', file.mime.create.toISOString());

        return bodyReplace.replace('<%%modified%%>', file.mime.modified.toISOString());
    }

    public replaceTemplateBody<T extends CrossTplFilesContentObject>(template: string, filesContent: Array<T>, row: any) {
        let i = 0;
        filesContent.forEach(async (file: T) => {
            let hash = Md5.init(file.file.replace(this.#options.dirname + '/', ''));

            if (this.isTemplateInclude(template, hash)) {
                i++;
                template = template.replace(
                    new RegExp(`\\/\\*\\*${hash}\\*\\*.*\\/\\*\\*-${hash}\\*\\*\\/`, "gm"),
                    `/**${hash}**/\`${Base64.encode(file.mime.content)}\`/**-${hash}**/`
                );
                row.update('Replace Template - ' + i, 'warning');
            }
        });

        row.success('Replaced Template - ' + i, 'white_check_mark');

        return template;
    }

    public addTemplateBody<T extends CrossTplFilesContentObject>(template: string, filesContent: Array<T>, row: any) {
        let i = 0;
        filesContent.forEach(async (file: T) => {
            let hash = Md5.init(file.file.replace(this.#options.dirname + '/', ''));

            if (!this.isTemplateInclude(template, hash)) {
                template = template.replace(
                    '/**<%%app_templates%%>**/', 
                    `${this.createTemplateBody(file)}/**<%%app_templates%%>**/`
                );
                i++;
                row.update('Add Template - ' + i, 'warning');
            }
        });

        row.success('Added Template - ' + i, 'white_check_mark');

        return template;
    }

    public removeTemplateBody(template: string, row: any) {
        let i = 0;
        const list = this.listTemplateHash(template);
        const files = this.getFilesRecursively(this.getOption('dirname') + '/' + this.getOption('templates'), [], 0, true);
        list.forEach(async (hash: string) => {
            if(files.indexOf(hash) === -1) {
                template = template.replace(new RegExp(`\\/\\*\\/open\\/${hash}\\*\\*\\*\\/.*\\/\\*\\/close\\/${hash}\\*\\*\\*\\/`, "gs"), '');
                i++;
                row.update('Remove Template - ' + i, 'warning');
            }
        });

        row.success('Removed Template - ' + i, 'white_check_mark');

        return template;
    }

    public listTemplateHash(template: string): Array<string> {
        let hash: Array<string> = [];
        let tags = template.match(RegExp("\\/\\*\\/open\\/(\\w*)\\*\\*\\*\\/", 'g')) || [];

        tags.forEach((tag) => {
            hash.push(tag.replace('/*/open/', '').replace('***/', ''));
        });

        return hash;
    }

    public generateTemplateMain(body: string) {
        let mainTemplate = fs.readFileSync(<string>this.#options.templatesMain, 'utf8');

        mainTemplate = mainTemplate.replace('<%%contentBase64%%>', this.getOptions('contentBase64'));
        mainTemplate = mainTemplate.replace('<%%dirHash%%>', this.getOptions('contentBase64'));

        return mainTemplate.replace('<%%templates%%>', body);
    }

    public generateTemplateBase(dir: string) {
        let mainTemplate = fs.readFileSync(<string>this.#options.templatesBase, 'utf8');

        let moduleBody = fs.readFileSync(this.getModulePath(<string>this.#options.moduleBuild), 'utf8');

        mainTemplate = mainTemplate.replace(
            '<%%md5%%>',
            fs.readFileSync(__dirname + '/../node_modules/md5-typescript/dist/index.js', 'utf8').replace(/\s{2,}/g, "")
        );

        mainTemplate = mainTemplate.replace('export { Md5 };', '');
        mainTemplate = mainTemplate.replace('<%%cross-js%%>', fs.readFileSync(dir, 'utf8'));

        return moduleBody.replace('<%%body%%>', mainTemplate);
    }

    public getModulePath(name: string): string {
        switch (name) {
            case CROSS_MODULE_WINDOW_BW:
                return <string>this.#options.templatesModuleWindow;
                break;
            case CROSS_MODULE_COMMON_JS:
                return <string>this.#options.templatesModuleCommon;
                break;
        }

        return <string>this.#options.templatesModuleCommon;
    }

    public buildTsToJs(dirFile: string, outDir: string): Promise<any> {
        return new Promise((ev) => {
            gulp.src(dirFile)
                .pipe(ts({
                    "target": "es5",
                    "module": "CommonJS",
                    "moduleResolution": "node",
                    "strict": true,
                    "noImplicitAny": true,
                    "sourceMap": true,
                    "experimentalDecorators": true,
                    "declaration": true,
                    "typeRoots": [
                        "./node_modules/@types"
                    ],
                })).pipe(gulp.dest(outDir)).on("end", (data: any) => {
                    ev();
                });
        })
    }

    /**
     * Setting kernel settings
     * 
     * @throws {TypeError}
     * @returns {void} 
     */
    set options(options: CrossTplConstructorOptions) {
        this.#debug = ('debug' in options) ? <boolean>options.debug : true;
        for (let key in options) {
            if (key in this.#options) {
                this.#options[key] = options[key];
                this.#optionsDebug.push(key);
            } else if (this.#debug) {
                throw new TypeError(`CrossTpl: No such parameter [${key}]`);
            }
        }
    }

    public getOptions(name: keyof CrossTplConstructorOptions): any {
        return name in this.#options ? this.#options[name] : false;
    }

    public getFilesContent<T extends string>(
        directives: Array<T>,
        fileMime: Array<CrossTplFilesContentObject> = [],
        steps: any
    ): Array<CrossTplFilesContentObject> {
        const row = steps.advance('Pattern data collection', 'mag').start();
        directives.forEach((path: T) => {
            try {
                const stats = fs.statSync(path);
                row.update(path, 'white_check_mark');
                fileMime.push({
                    file: path,
                    mime: {
                        type: nodePathModule.extname(path),
                        content: fs.readFileSync(path, 'utf8'),
                        create: stats.birthtime,
                        modified: stats.atime,
                        size: stats.size,
                    }
                });

            } catch (error) {
                row.error('Information about fellow files', 'x');
                throw new Error(error);
            }
        });

        row.success('All data collected', 'white_check_mark');

        return fileMime;
    }

    public isTemplateInclude(content: string, hash: string) {
        if (
            content.search(new RegExp(`\\/\\*\\*${hash}\\*\\*\\/`, "gm")) !== -1 &&
            content.search(new RegExp(`\\/\\*\\*-${hash}\\*\\*\\/`, "gm")) !== -1
        ) {
            return true;
        }

        return false;
    }

    /**
     * Get Template Files
     * 
     * @param {string} templateDir
     * @returns {Array<string>}
     */
    public getTemplateFiles(templateDir: string | boolean = false, steps: any, hash: boolean = false): Array<string> {
        const row = steps.advance('Collection template in the specified folder').start();

        templateDir = templateDir || this.getOption('dirname') + '/' + this.getOption('templates');

        const files = this.getFilesRecursively(String(templateDir), [], 0) || [];

        row.success(`Files collected - ${files.length}`, 'white_check_mark');

        return files;
    }

    /**
     * Get Option
     * 
     * @param {K extends keyof CrossTplConstructorOptions} name 
     * @throws {TypeError}
     * @returns {void|CrossTplConstructorOptions}
     */
    public getOption<K extends keyof CrossTplConstructorOptions>(name: K): CrossTplConstructorOptions[K] {
        if (name in this.#options) {
            return this.#options[name];
        }
        throw new TypeError(`CrossTpl: No property [${name}]`);
    }

    /**
     * Get all files recursively
     * 
     * @param {string} dir 
     * @param {Array<string>} files 
     * @param {number} iteration 
     * @throws {TypeError}
     * @returns {Array<string>}
     */
    public getFilesRecursively(dir: string, files: Array<string> = [], iteration: number = 0, hash: boolean = false): Array<string> {
        const objects: Array<string> = fs.readdirSync(dir);

        if (objects.length === 0 && iteration === 0) {
            return [];
        }

        for (const index in objects) {
            const name: string = dir + '/' + objects[index];
            if (fs.statSync(name).isDirectory()) {
                this.getFilesRecursively(name, files, iteration++, hash);
            } else {
                files.push(hash ? Md5.init(name.replace(this.#options.dirname + '/', '')) : name);
            }
        }

        return files;
    }
}