import { CrossTplConstructorOptions, CrossTplFilesContentObject } from './header';
import * as fs from 'fs';
import * as nodePathModule from 'path';

export class CrossTpl {
    #core: CrossTplCore;

    constructor(options: CrossTplConstructorOptions) {
        this.#core = new CrossTplCore();
        this.#core.options = options;
    }

    public build() {
        const files = this.#core.getTemplateFiles();
        if (files.length === 0) {
            throw new TypeError(`CrossTpl: Files not available or no files [${files.join()}]`);
        }
        const filesMime = this.#core.getFilesContent(files);
        const body = this.#core.generateTemplateBody(filesMime);
        const main = this.#core.generateTemplateMain(body);
        const outDir = this.#core.getOptions('dirname') + '/' + (this.#core.getOptions('outDir') || 'cross-template.ts');
        console.log(fs.writeFileSync(outDir, main));

    }
}

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
        outDir: void 0,
        templatesBody: __dirname + '/templates/cross-tpl-body.txt',
        templatesMain: __dirname + '/templates/cross-tpl-main.txt',
    };

    /**
     * @var {boolean} debug
     * @private
     */
    #optionsDebug: Array<string> = [];

    public generateTemplateBody<T extends CrossTplFilesContentObject>(filesContent: Array<T>): string {
        let bodyTemplate = fs.readFileSync(<string>this.#options.templatesBody, 'utf8'),
            body: string = new String().toString();

        filesContent.forEach(async (file: T) => {
            let bodyReplace: string = bodyTemplate + '\n\r';
            bodyReplace = bodyReplace.replace('<%%hash%%>', file.file.replace(this.#options.dirname + '/', ''));
            bodyReplace = bodyReplace.replace('<%%content%%>', file.mime.content);
            bodyReplace = bodyReplace.replace('<%%file_dir%%>', file.file);
            bodyReplace = bodyReplace.replace('<%%size%%>', String(file.mime.size));
            bodyReplace = bodyReplace.replace('<%%create%%>', file.mime.create.toISOString());
            bodyReplace = bodyReplace.replace('<%%modified%%>', file.mime.modified.toISOString());
            body += bodyReplace;
        });

        return body;
    }

    public generateTemplateMain(body: string) {
        let mainTemplate = fs.readFileSync(<string>this.#options.templatesMain, 'utf8');
        return mainTemplate.replace('<%%templates%%>', body);
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
        fileMime: Array<CrossTplFilesContentObject> = []
    ): Array<CrossTplFilesContentObject> {
        directives.forEach((path: T) => {
            const stats = fs.statSync(path);
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
        });

        return fileMime;
    }

    /**
     * Get Template Files
     * 
     * @param {string} templateDir
     * @returns {Array<string>}
     */
    public getTemplateFiles(templateDir: string | boolean = false): Array<string> {
        templateDir = templateDir || this.getOption('dirname') + '/' + this.getOption('templates');
        return CrossTplCore.getFilesRecursively(String(templateDir)) || [];
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
    public static getFilesRecursively(dir: string, files: Array<string> = [], iteration: number = 0): Array<string> {
        const objects: Array<string> = fs.readdirSync(dir);
        if (objects.length === 0 && iteration === 0) {
            throw new TypeError(`CrossTpl: No patterns [${dir}]`);
        }
        for (const index in objects) {
            const name: string = dir + '/' + objects[index];
            if (fs.statSync(name).isDirectory()) {
                this.getFilesRecursively(name, files, iteration++);
            } else {
                files.push(name);
            }
        }
        return files;
    };
}