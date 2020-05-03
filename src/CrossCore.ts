import { CrossTplConstructorOptions, CrossTplFilesContentObject, CrossLocalInfoPath, CrossFile, DiskMime } from './header';
import * as fs from 'fs';
import * as nodePathModule from 'path';
import { Base64 } from 'js-base64';
import { Md5 } from "md5-typescript";
var gulp = require("gulp");
var watch = require("gulp-watch");
import { Disk } from './Helpers/Disk';
var ts = require("gulp-typescript");
var path = require("path");
import { Spinner } from './Helpers/Spinner';
const { spawn } = require("child_process");

export const CROSS_MODULE_WINDOW_BW = 'window';
export const CROSS_MODULE_COMMON_JS = 'common';
export const PLUGIN_CROSS_TPL = 'cross-tpl';
export const PLUGIN_CROSS_LOCAL = 'cross-local';

export class CrossTplCore {
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
        type: 'json',
        src: void 0,
        outDir: __dirname + '/dist',
        templateBodyLang: __dirname + '/templates/cross-body-lang.js',
        templateBodyMix: __dirname + '/templates/cross-body-mix.js',
        templateMainLang: __dirname + '/templates/cross-main-lang.ts',
        templateMainMix: __dirname + '/templates/cross-main-mix.ts',
        templatesBase: __dirname + '/templates/cross-tpl-base.txt',
        templatesModuleWindow: __dirname + '/templates/cross-tpl-module-window.js',
        templatesModuleWindowLocal: __dirname + '/templates/cross-local-module-window.js',
        templatesModuleCommon: __dirname + '/templates/cross-tpl-module-common.js',
        templatesModuleCommonLocal: __dirname + '/templates/cross-local-module-common.js',
        moduleBuild: CROSS_MODULE_COMMON_JS,
        contentBase64: true,
        upload: true,
        dirHash: true
    };

    /**
     * @var {boolean} debug
     * @private
     */
    #optionsDebug: Array<string> = [];
    
    /**
     * @var {Spinner} console
     * @private
     */
    console: any;
    
    public src(append: string = '') {
        return this.#options.dirname + '/' + this.#options.src + append;
    }


    /**
     * @param {CrossFile} file
     * @returns {string} 
     */
    public getBodyTemplate(file: CrossFile): string {
        return Disk.content(
            this.isLang(file) ? <string>this.#options.templateBodyLang : <string>this.#options.templateBodyMix
        );
    }
    /**
         * @param {CrossFile} file
         * @returns {string} 
         */
    public getMainTemplate(lang: boolean): string {
        return Disk.content(
            lang ? <string>this.#options.templateMainLang : <string>this.#options.templateMainMix
        );
    }

    /**
     * @param {CrossFile} file
     * @returns {string} 
     */
    public body(file: CrossFile): string {
        let bodyTemplate = this.getBodyTemplate(file);
        let bodyReplace: string = bodyTemplate + '\n\r';

        bodyReplace = bodyReplace.replace(
            new RegExp('\\<%%hash%%\\>', 'g'),
            this.hash(file)
        );

        bodyReplace = bodyReplace.replace('<%%content%%>', Base64.encode(file.content));
        bodyReplace = bodyReplace.replace('<%%file_dir%%>', file.path);
        bodyReplace = bodyReplace.replace('<%%name%%>', file.mime.name);
        bodyReplace = bodyReplace.replace('<%%size%%>', String(file.mime.size));
        bodyReplace = bodyReplace.replace('<%%create%%>', file.mime.create.toISOString());

        if (this.isLang(file)) {
            bodyReplace = bodyReplace.replace('/**<%%lang_hash%%>**/', Md5.init(file.lang));
            bodyReplace = bodyReplace.replace('<%%lang%%>', String(file.lang));
        }

        return bodyReplace.replace('<%%modified%%>', file.mime.modified.toISOString());
    }

    /**
     * @param {CrossFile[]} files 
     * @param {string} template 
     */
    public refresh(files: CrossFile[], template: string): string {
        files.forEach(async (file: CrossFile) => {
            let hash = this.hash(file);

            if (this.isTemplateInclude(template, hash)) {
                this.console.text('Refresh ' + file.path);
                template = template.replace(
                    new RegExp(`\\/\\*\\*${hash}\\*\\*.*\\/\\*\\*-${hash}\\*\\*\\/`, "gm"),
                    `/**${hash}**/\`${Base64.encode(file.content)}\`/**-${hash}**/`
                );
            }
        });

        return template;
    }

    /**
     * @param {CrossFile[]} files 
     * @param {string} template 
     * @returns {string}
     */
    public add(files: CrossFile[], template: string): string {
        files.forEach(async (file: CrossFile) => {
            let hash = this.hash(file);

            if (!this.isTemplateInclude(template, hash)) {
                this.console.text('added ' + file.path);
                template = template.replace(
                    '/**<%%app_templates%%>**/',
                    `${this.body(file)}/**<%%app_templates%%>**/`
                );
            }
        });

        return template;
    }

    /**
     * @param {CrossFile[]} files 
     * @param {string} template 
     * @returns {string} 
     */
    public remove(files: CrossFile[], template: string): string {
        const list = this.listTemplateHash(template);
        let fileHash: Array<string> = [];

        files.forEach((file: CrossFile) => {
            fileHash.push(this.hash(file));
        });

        list.forEach(async (hash: string) => {
            if (fileHash.indexOf(hash) === -1) {
                this.console.text('Remove ' + hash);
                template = template.replace(new RegExp(`\\/\\*\\/open\\/${hash}\\*\\*\\*\\/.*\\/\\*\\/close\\/${hash}\\*\\*\\*\\/`, "gs"), '');
            }
        });

        return template;
    }

    /**
     * @param {string} template 
     * @returns {Array<string>} 
     */
    public listTemplateHash(template: string): Array<string> {
        let hash: Array<string> = [];
        let tags = template.match(RegExp("\\/\\*\\/open\\/(\\w*)\\*\\*\\*\\/", 'g')) || [];

        tags.forEach((tag) => {
            hash.push(tag.replace('/*/open/', '').replace('***/', ''));
        });

        return hash;
    }

    /**
     * @param {string} body 
     * @param {boolean} lang 
     */
    public main(body: string, lang: boolean): string {
        let mainTemplate = this.getMainTemplate(lang);

        mainTemplate = mainTemplate.replace('\'/** <%%contentBase64%%> */\'', this.getOptions('contentBase64'));
        mainTemplate = mainTemplate.replace('\'/** <%%dirHash%%> */\'', this.getOptions('contentBase64'));

        return mainTemplate.replace('/*<%%templates%%>*/', body);
    }

    public generateTemplateBase(dir: string, type: string) {
        let mainTemplate = fs.readFileSync(<string>this.#options.templatesBase, 'utf8');

        let moduleBody = fs.readFileSync(this.getModulePath(<string>this.#options.moduleBuild, type), 'utf8');

        mainTemplate = mainTemplate.replace(
            '<%%md5%%>',
            fs.readFileSync(__dirname + '/../node_modules/md5-typescript/dist/index.js', 'utf8').replace(/\s{2,}/g, "")
        );

        mainTemplate = mainTemplate.replace('export { Md5 };', '');
        mainTemplate = mainTemplate.replace('<%%cross-js%%>', fs.readFileSync(dir, 'utf8'));

        return moduleBody.replace('/* <%%body%%> */', mainTemplate);
    }

    public getModulePath(name: string, plugin = PLUGIN_CROSS_TPL): string {
        let window, commonjs;

        switch (plugin) {
            case PLUGIN_CROSS_TPL:
                window = <string>this.#options.templatesModuleWindow;
                break;
            case PLUGIN_CROSS_LOCAL:
                window = <string>this.#options.templatesModuleWindowLocal;
                break;
        }

        switch (plugin) {
            case PLUGIN_CROSS_TPL:
                commonjs = <string>this.#options.templatesModuleCommon;
                break;
            case PLUGIN_CROSS_LOCAL:
                commonjs = <string>this.#options.templatesModuleCommonLocal;
                break;
        }

        switch (name) {
            case CROSS_MODULE_WINDOW_BW:
                return <string>window;
                break;
            case CROSS_MODULE_COMMON_JS:
                return <string>commonjs;
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
     * @param {CrossFile} file 
     * @param {string} prefix 
     * @returns {string}
     */
    public hash(file: CrossFile, prefix: string = ''): string {
        let name = file.path;

        if (this.isLang(file)) {
            prefix += Md5.init(file.lang) + '-';
            name = file.mime.name
        }

        return Md5.init(prefix + name);
    }

    /**
     * @param {CrossFile} file
     * @returns {boolean} 
     */
    public isLang(file: CrossFile): boolean {
        if ('lang' in file && file.lang !== false) {
            return true;
        }

        return false;
    }

    /**
     * @param {Array<string>} list
     * @param {boolean} lang 
     * @param {Array<Promise<CrossFile>>} files 
     * @returns {Promise<CrossFile[]>}
     */
    public async load(list: Array<string>, isLang: boolean = false, files: Array<Promise<CrossFile>> = []): Promise<CrossFile[]> {
        return new Promise(ok => {
            list.forEach(async (file: string) => {
                if (!fs.existsSync(file)) {
                    return false;
                }
                files.push(new Promise(async (resolve: (param: CrossFile) => void) => {
                    const mime: DiskMime = Disk.mime(file);
                    const path: string = file.replace(this.src('/'), '');
                    const lang: string = path.split('/')[0];
                    const mounting: CrossFile = {
                        path: path,
                        pwd: file,
                        mime: mime,
                        lang: isLang ? lang : isLang,
                        content: await Disk.contentHandler(file, mime.type),
                    }
                    return void resolve(mounting);
                }));
            });

            Promise.all(files).then((values: CrossFile[]) => {
                return void ok(values);
            });
        });
    }
}