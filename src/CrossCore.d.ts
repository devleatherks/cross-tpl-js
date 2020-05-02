import { CrossTplConstructorOptions, CrossFile } from './header';
export declare const CROSS_MODULE_WINDOW_BW = "window";
export declare const CROSS_MODULE_COMMON_JS = "common";
export declare const PLUGIN_CROSS_TPL = "cross-tpl";
export declare const PLUGIN_CROSS_LOCAL = "cross-local";
export declare class CrossTplCore {
    #private;
    /**
     * @var {Spinner} console
     * @private
     */
    console: any;
    templateDir(append?: string): string;
    localDir(append?: string): string;
    /**
     * @param {CrossFile} file
     * @returns {string}
     */
    getBodyTemplate(file: CrossFile): string;
    /**
         * @param {CrossFile} file
         * @returns {string}
         */
    getMainTemplate(lang: boolean): string;
    /**
     * @param {CrossFile} file
     * @returns {string}
     */
    body(file: CrossFile): string;
    /**
     * @param {CrossFile[]} files
     * @param {string} template
     */
    refresh(files: CrossFile[], template: string): string;
    /**
     * @param {CrossFile[]} files
     * @param {string} template
     * @returns {string}
     */
    add(files: CrossFile[], template: string): string;
    /**
     * @param {CrossFile[]} files
     * @param {string} template
     * @returns {string}
     */
    remove(files: CrossFile[], template: string): string;
    /**
     * @param {string} template
     * @returns {Array<string>}
     */
    listTemplateHash(template: string): Array<string>;
    /**
     * @param {string} body
     * @param {boolean} lang
     */
    main(body: string, lang: boolean): string;
    generateTemplateBase(dir: string, type: string): string;
    getModulePath(name: string, plugin?: string): string;
    buildTsToJs(dirFile: string, outDir: string): Promise<any>;
    /**
     * Setting kernel settings
     *
     * @throws {TypeError}
     * @returns {void}
     */
    set options(options: CrossTplConstructorOptions);
    getOptions(name: keyof CrossTplConstructorOptions): any;
    isTemplateInclude(content: string, hash: string): boolean;
    /**
     * Get Option
     *
     * @param {K extends keyof CrossTplConstructorOptions} name
     * @throws {TypeError}
     * @returns {void|CrossTplConstructorOptions}
     */
    getOption<K extends keyof CrossTplConstructorOptions>(name: K): CrossTplConstructorOptions[K];
    /**
     * @param {CrossFile} file
     * @param {string} prefix
     * @returns {string}
     */
    hash(file: CrossFile, prefix?: string): string;
    /**
     * @param {CrossFile} file
     * @returns {boolean}
     */
    isLang(file: CrossFile): boolean;
    /**
     * @param {Array<string>} list
     * @param {boolean} lang
     * @param {Array<Promise<CrossFile>>} files
     * @returns {Promise<CrossFile[]>}
     */
    load(list: Array<string>, isLang?: boolean, files?: Array<Promise<CrossFile>>): Promise<CrossFile[]>;
}
