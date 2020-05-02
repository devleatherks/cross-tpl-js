import { CrossTplConstructorOptions, CrossTplFilesContentObject } from './header';
export declare const CROSS_MODULE_WINDOW_BW = "window";
export declare const CROSS_MODULE_COMMON_JS = "common";
export declare const PLUGIN_CROSS_TPL = "cross-tpl";
export declare const PLUGIN_CROSS_LOCAL = "cross-local";
export declare class CrossTplCore {
    #private;
    generateTemplateBody<T extends CrossTplFilesContentObject>(filesContent: Array<T>, steps: any): string;
    generateTemplateBodyLocal<T extends CrossTplFilesContentObject>(filesContent: Array<CrossTplFilesContentObject>, key: string): string;
    templateDir(append?: string): string;
    createTemplateBody<T extends CrossTplFilesContentObject>(file: T): string;
    createTemplateBodyLocal<T extends CrossTplFilesContentObject>(file: T, key: string): string;
    replaceTemplateBody<T extends CrossTplFilesContentObject>(template: string, filesContent: Array<T>, row: any): string;
    addTemplateBody<T extends CrossTplFilesContentObject>(template: string, filesContent: Array<T>, row: any): string;
    removeTemplateBody(template: string, row: any): string;
    listTemplateHash(template: string): Array<string>;
    generateTemplateMain(body: string): string;
    generateTemplateMainLocal(body: string): string;
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
    getFilesContent<T extends string>(directives: Array<T>, fileMime: CrossTplFilesContentObject[] | undefined, steps: any): Array<CrossTplFilesContentObject>;
    isTemplateInclude(content: string, hash: string): boolean;
    /**
     * Get Template Files
     *
     * @param {string} templateDir
     * @returns {Array<string>}
     */
    getTemplateFiles(templateDir: string | boolean | undefined, steps: any, hash?: boolean): Array<string>;
    /**
     * Get Option
     *
     * @param {K extends keyof CrossTplConstructorOptions} name
     * @throws {TypeError}
     * @returns {void|CrossTplConstructorOptions}
     */
    getOption<K extends keyof CrossTplConstructorOptions>(name: K): CrossTplConstructorOptions[K];
    /**
     * Get all files recursively
     *
     * @param {string} dir
     * @param {Array<string>} files
     * @param {number} iteration
     * @throws {TypeError}
     * @returns {Array<string>}
     */
    getFilesRecursively(dir: string, files?: Array<string>, iteration?: number, hash?: boolean): Array<string>;
    getLocalCollection(path: string, step: any): Map<string, Array<CrossTplFilesContentObject>>;
}
