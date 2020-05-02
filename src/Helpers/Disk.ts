import * as fs from 'fs';
import * as nodePathModule from 'path';
import { spawn } from 'child_process';
import { DiskMime } from '../header';

export class Disk {
    /**
     * @param {string} path 
     * @param {Array<string>} files 
     * @param {number} iteration 
     */
    public static files(path: string, files: Array<string> = [], iteration: number = 0, ) {
        Disk.each(path, (path: string, isDirectory: boolean) => {
            if (!isDirectory) {
                files.push(path);
            }
        });

        return files;
    }

    /**
    * @param {string} path 
    * @param {Array<string>} dirs 
    */
    public static dirs(path: string, dirs: Array<string> = []) {
        Disk.each(path, (path: string, isDirectory: boolean) => {
            if (isDirectory) {
                dirs.push(path);
            }
        });

        return dirs;
    }

    public static each(path: string, callback: (path: string, isDirectory: boolean) => any) {
        const objects: Array<string> = fs.readdirSync(path);

        for (const index in objects) {
            const name: string = path + '/' + objects[index];
            callback(name, fs.statSync(name).isDirectory());
        }
    }

    public static list(path: string, files: Array<string> = []): Array<string> {
        Disk.each(path, (path: string, isDirectory: boolean) => {
            if (isDirectory) {
                Disk.list(path, files);
            } else {
                files.push(path);
            }
        });

        return files;
    }

    /**
     * @param {string} path 
     */
    public static content(path: string): string {
        return fs.readFileSync(path, 'utf8');
    }

    /**
     * @param {string} path 
     */
    public static mime(path: string): DiskMime {
        const stats = fs.statSync(path);
        const type = nodePathModule.extname(path);

        return {
            type: type, 
            create: stats.birthtime,
            name: nodePathModule.basename(path).replace(type, ''),
            modified: stats.atime,
            size: stats.size,
        }
    }

    public static async contentHandler(file: string, type: string): Promise<string> {
        return new Promise((ok) => {
            switch (type) {
                case '.php':
                    const ls = spawn("php", [__dirname + "/../libs/handler-php.php", file]);
                    ls.stdout.on("data", (data: Object) => {
                        ok(data.toString());
                    });
                    break;
                case '.json':
                    return ok(Disk.content(file))
                    break;
                default: 
                    return ok(Disk.content(file))
                break;
            }
        });
    }
}