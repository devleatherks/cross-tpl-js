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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _core, _debug, _options, _optionsDebug;
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const nodePathModule = require("path");
class CrossTpl {
    constructor(options) {
        _core.set(this, void 0);
        __classPrivateFieldSet(this, _core, new CrossTplCore());
        __classPrivateFieldGet(this, _core).options = options;
    }
    build() {
        const files = __classPrivateFieldGet(this, _core).getTemplateFiles();
        if (files.length === 0) {
            throw new TypeError(`CrossTpl: Files not available or no files [${files.join()}]`);
        }
        const filesMime = __classPrivateFieldGet(this, _core).getFilesContent(files);
        const body = __classPrivateFieldGet(this, _core).generateTemplateBody(filesMime);
        const main = __classPrivateFieldGet(this, _core).generateTemplateMain(body);
        const outDir = __classPrivateFieldGet(this, _core).getOptions('dirname') + '/' + (__classPrivateFieldGet(this, _core).getOptions('outDir') || 'cross-template.ts');
        console.log(fs.writeFileSync(outDir, main));
    }
}
exports.CrossTpl = CrossTpl;
_core = new WeakMap();
class CrossTplCore {
    constructor() {
        /**
         * @var {boolean} debug
         * @private
         */
        _debug.set(this, false);
        /**
         * @var {boolean} debug
         * @private
         */
        _options.set(this, {
            dirname: void 0,
            debug: true,
            templates: void 0,
            outDir: void 0,
            templatesBody: __dirname + '/templates/cross-tpl-body.txt',
            templatesMain: __dirname + '/templates/cross-tpl-main.txt',
        });
        /**
         * @var {boolean} debug
         * @private
         */
        _optionsDebug.set(this, []);
    }
    generateTemplateBody(filesContent) {
        let bodyTemplate = fs.readFileSync(__classPrivateFieldGet(this, _options).templatesBody, 'utf8'), body = new String().toString();
        filesContent.forEach((file) => __awaiter(this, void 0, void 0, function* () {
            let bodyReplace = bodyTemplate + '\n\r';
            bodyReplace = bodyReplace.replace('<%%hash%%>', file.file.replace(__classPrivateFieldGet(this, _options).dirname + '/', ''));
            bodyReplace = bodyReplace.replace('<%%content%%>', file.mime.content);
            bodyReplace = bodyReplace.replace('<%%file_dir%%>', file.file);
            bodyReplace = bodyReplace.replace('<%%size%%>', String(file.mime.size));
            bodyReplace = bodyReplace.replace('<%%create%%>', file.mime.create.toISOString());
            bodyReplace = bodyReplace.replace('<%%modified%%>', file.mime.modified.toISOString());
            body += bodyReplace;
        }));
        return body;
    }
    generateTemplateMain(body) {
        let mainTemplate = fs.readFileSync(__classPrivateFieldGet(this, _options).templatesMain, 'utf8');
        return mainTemplate.replace('<%%templates%%>', body);
    }
    /**
     * Setting kernel settings
     *
     * @throws {TypeError}
     * @returns {void}
     */
    set options(options) {
        __classPrivateFieldSet(this, _debug, ('debug' in options) ? options.debug : true);
        for (let key in options) {
            if (key in __classPrivateFieldGet(this, _options)) {
                __classPrivateFieldGet(this, _options)[key] = options[key];
                __classPrivateFieldGet(this, _optionsDebug).push(key);
            }
            else if (__classPrivateFieldGet(this, _debug)) {
                throw new TypeError(`CrossTpl: No such parameter [${key}]`);
            }
        }
    }
    getOptions(name) {
        return name in __classPrivateFieldGet(this, _options) ? __classPrivateFieldGet(this, _options)[name] : false;
    }
    getFilesContent(directives, fileMime = []) {
        directives.forEach((path) => {
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
    getTemplateFiles(templateDir = false) {
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
    getOption(name) {
        if (name in __classPrivateFieldGet(this, _options)) {
            return __classPrivateFieldGet(this, _options)[name];
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
    static getFilesRecursively(dir, files = [], iteration = 0) {
        const objects = fs.readdirSync(dir);
        if (objects.length === 0 && iteration === 0) {
            throw new TypeError(`CrossTpl: No patterns [${dir}]`);
        }
        for (const index in objects) {
            const name = dir + '/' + objects[index];
            if (fs.statSync(name).isDirectory()) {
                this.getFilesRecursively(name, files, iteration++);
            }
            else {
                files.push(name);
            }
        }
        return files;
    }
    ;
}
_debug = new WeakMap(), _options = new WeakMap(), _optionsDebug = new WeakMap();
//# sourceMappingURL=CrossTpl.js.map