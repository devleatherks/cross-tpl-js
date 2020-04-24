import { CrossTplConstructorOptions, CrossTplFilesContentObject } from './header';
import * as fs from 'fs';
import * as nodePathModule from 'path';
import { Base64 } from 'js-base64';
import { Md5 } from "md5-typescript";
import { Steps, RawSteps, RawStep } from "./Steps";
const { spawn } = require("child_process");
var gulp = require("gulp");
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

        if (files.length === 0) {
            throw new TypeError(`CrossTpl: Files not available or no files [${files.join()}]`);
        }

        const filesMime = this.#core.getFilesContent(files, [],  steps);

        const body = this.#core.generateTemplateBody(filesMime,  steps);
        const main = this.#core.generateTemplateMain(body);

        let row = steps.advance('Engine assembly', 'recycle').start();

        const outDirTCross = this.#core.getOptions('dirname')
            + '/'
            + 'usemin-cross-template.ts';
        const outDir = this.#core.getOptions('dirname')
            + '/'
            + (this.#core.getOptions('outDir') || '');

        fs.writeFileSync(outDirTCross, main);

        row.update('Code generation');

        this.#core.buildTsToJs(outDirTCross, outDir).then(() => {
            row.update('Build Code');

            fs.writeFileSync(
                outDir + '/usemin-cross-template.js',
                this.#core.generateTemplateBase(outDir + '/' + 'usemin-cross-template.js'),
            );
            
            row.success('Cross-tpl assembled', 'white_check_mark');
        });
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
        templatesBase: __dirname + '/templates/cross-tpl-base.txt',
        templatesModule: __dirname + '/templates/cross-tpl-module.txt',
        templatesWrapper: __dirname + '/templates/cross-tpl-wrapper.txt',
        contentBase64: true,
        dirHash: true
    };

    /**
     * @var {boolean} debug
     * @private
     */
    #optionsDebug: Array<string> = [];

    public generateTemplateBody<T extends CrossTplFilesContentObject>(filesContent: Array<T>,  steps: any): string {
        let bodyTemplate = fs.readFileSync(<string>this.#options.templatesBody, 'utf8'),
            templatesWrapper = fs.readFileSync(<string>this.#options.templatesWrapper, 'utf8'),
            body: string = (new String()).toString();

        const row = steps.advance('Template Packing', 'mag').start();

        filesContent.forEach(async (file: T) => {
            row.update(file, 'warning');
            let bodyReplace: string = bodyTemplate + '\n\r';

            let contact = templatesWrapper;

            contact = contact.replace('<%%file_dir%%>', file.file.replace(this.#options.dirname + '/', ''));
            contact = contact.replace('<%%version%%>', String(file.mime.modified.getTime()));
            contact = contact.replace('<%%content%%>', file.mime.content);

            bodyReplace = bodyReplace.replace('<%%hash%%>', Md5.init(file.file.replace(this.#options.dirname + '/', '')));
            bodyReplace = bodyReplace.replace('<%%content%%>', Base64.encode(contact));
            bodyReplace = bodyReplace.replace('<%%file_dir%%>', file.file.replace(this.#options.dirname + '/', ''));
            bodyReplace = bodyReplace.replace('<%%size%%>', String(file.mime.size));
            bodyReplace = bodyReplace.replace('<%%create%%>', file.mime.create.toISOString());
            bodyReplace = bodyReplace.replace('<%%modified%%>', file.mime.modified.toISOString());

            body += bodyReplace;
        });

        row.success('Templates successfully packaged', 'white_check_mark');

        return body;
    }

    public generateTemplateMain(body: string) {
        let mainTemplate = fs.readFileSync(<string>this.#options.templatesMain, 'utf8');

        mainTemplate = mainTemplate.replace('<%%contentBase64%%>', this.getOptions('contentBase64'));
        mainTemplate = mainTemplate.replace('<%%dirHash%%>', this.getOptions('contentBase64'));

        return mainTemplate.replace('<%%templates%%>', body);
    }

    public generateTemplateBase(dir: string) {
        let mainTemplate = fs.readFileSync(<string>this.#options.templatesBase, 'utf8');
        let moduleBody = fs.readFileSync(<string>this.#options.templatesModule, 'utf8');

        mainTemplate = mainTemplate.replace(
            '<%%md5%%>',
            fs.readFileSync(__dirname + '/../node_modules/md5-typescript/dist/index.js', 'utf8')
        );

        mainTemplate = mainTemplate.replace('export { Md5 };', '');
        mainTemplate = mainTemplate.replace('<%%cross-js%%>', fs.readFileSync(dir, 'utf8'));

        return moduleBody.replace('<%%body%%>', mainTemplate);
    }

    public buildTsToJs(dirFile: string, outDir: string): Promise<any> {
        return new Promise((ev) => {
            gulp.src(dirFile)
            .pipe(ts({
                "target": "es2015",
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

    /**
     * Get Template Files
     * 
     * @param {string} templateDir
     * @returns {Array<string>}
     */
    public getTemplateFiles(templateDir: string | boolean = false, steps: any): Array<string> {
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
    public getFilesRecursively(dir: string, files: Array<string> = [], iteration: number = 0): Array<string> {
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
    }
}