"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Disk = void 0;
const fs = require("fs");
const nodePathModule = require("path");
const child_process_1 = require("child_process");
class Disk {
    /**
     * @param {string} path
     * @param {Array<string>} files
     * @param {number} iteration
     */
    static files(path, files = [], iteration = 0) {
        Disk.each(path, (path, isDirectory) => {
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
    static dirs(path, dirs = []) {
        Disk.each(path, (path, isDirectory) => {
            if (isDirectory) {
                dirs.push(path);
            }
        });
        return dirs;
    }
    static each(path, callback) {
        const objects = fs.readdirSync(path);
        for (const index in objects) {
            const name = path + '/' + objects[index];
            callback(name, fs.statSync(name).isDirectory());
        }
    }
    static list(path, files = []) {
        Disk.each(path, (path, isDirectory) => {
            if (isDirectory) {
                Disk.list(path, files);
            }
            else {
                files.push(path);
            }
        });
        return files;
    }
    /**
     * @param {string} path
     */
    static content(path) {
        return fs.readFileSync(path, 'utf8');
    }
    /**
     * @param {string} path
     */
    static mime(path) {
        const stats = fs.statSync(path);
        const type = nodePathModule.extname(path);
        return {
            type: type,
            create: stats.birthtime,
            name: nodePathModule.basename(path).replace(type, ''),
            modified: stats.atime,
            size: stats.size,
        };
    }
    static contentHandler(file, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((ok) => {
                switch (type) {
                    case '.php':
                        const ls = child_process_1.spawn("php", [__dirname + "/../libs/handler-php.php", file]);
                        ls.stdout.on("data", (data) => {
                            ok(data.toString());
                        });
                        break;
                    case '.json':
                        return ok(Disk.content(file));
                        break;
                    default:
                        return ok(Disk.content(file));
                        break;
                }
            });
        });
    }
}
exports.Disk = Disk;
//# sourceMappingURL=Disk.js.map