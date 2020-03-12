import { CrossTplConstructorOptions } from './header';
import * as fs from 'fs';
import * as path from 'path';

export class CrossTpl {
    #core: CrossTplCore;

    constructor(options: CrossTplConstructorOptions) {
        this.#core = new CrossTplCore();
        this.#core.options = options;
    }

    public build() {
        let files = this.#core.getTemplateFiles();
        console.log(files);
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
        debug: true,
    };

    /**
     * @var {boolean} debug
     * @private
     */
    #optionsDebug: Array<string> = [];

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

    /**
     * Get Template Files
     * 
     * @param {string} templateDir
     * @returns {Array<string>}
     */
    public getTemplateFiles(templateDir: string | boolean = false): Array<string> {
        templateDir = templateDir || this.getOption('dirname') + '/' + this.getOption('template');
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
        if (objects.length === 1 && iteration === 0) {
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