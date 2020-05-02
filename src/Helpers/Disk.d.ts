import { DiskMime } from '../header';
export declare class Disk {
    /**
     * @param {string} path
     * @param {Array<string>} files
     * @param {number} iteration
     */
    static files(path: string, files?: Array<string>, iteration?: number): string[];
    /**
    * @param {string} path
    * @param {Array<string>} dirs
    */
    static dirs(path: string, dirs?: Array<string>): string[];
    static each(path: string, callback: (path: string, isDirectory: boolean) => any): void;
    static list(path: string, files?: Array<string>): Array<string>;
    /**
     * @param {string} path
     */
    static content(path: string): string;
    /**
     * @param {string} path
     */
    static mime(path: string): DiskMime;
    static contentHandler(file: string, type: string): Promise<string>;
}
