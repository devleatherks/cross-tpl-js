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
const js_base64_1 = require("js-base64");
const md5_typescript_1 = require("md5-typescript");
const Steps_1 = require("./Steps");
const { spawn } = require("child_process");
class CrossTpl {
    constructor(options) {
        _core.set(this, void 0);
        __classPrivateFieldSet(this, _core, new CrossTplCore());
        __classPrivateFieldGet(this, _core).options = options;
    }
    build() {
        const steps = new Steps_1.Steps(5);
        const files = __classPrivateFieldGet(this, _core).getTemplateFiles(false, steps);
        if (files.length === 0) {
            throw new TypeError(`CrossTpl: Files not available or no files [${files.join()}]`);
        }
        const filesMime = __classPrivateFieldGet(this, _core).getFilesContent(files, [], steps);
        const body = __classPrivateFieldGet(this, _core).generateTemplateBody(filesMime, steps);
        const main = __classPrivateFieldGet(this, _core).generateTemplateMain(body);
        let row = steps.advance('Engine assembly', 'recycle').start();
        const outDirTCross = __classPrivateFieldGet(this, _core).getOptions('dirname')
            + '/'
            + 'usemin-cross-template.ts';
        const outDir = __classPrivateFieldGet(this, _core).getOptions('dirname')
            + '/'
            + (__classPrivateFieldGet(this, _core).getOptions('outDir') || '');
        fs.writeFileSync(outDirTCross, main);
        row.update('Code generation');
        __classPrivateFieldGet(this, _core).buildTsToJs(outDirTCross, outDir).then(() => {
            fs.writeFileSync(outDirTCross.replace('.ts', '.js'), __classPrivateFieldGet(this, _core).generateTemplateBase(outDirTCross.replace('.ts', '.js')));
        });
        row.success('ross-tpl assembled', 'white_check_mark');
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
            templatesBase: __dirname + '/templates/cross-tpl-base.txt',
            templatesWrapper: __dirname + '/templates/cross-tpl-wrapper.txt',
            contentBase64: true,
            dirHash: true
        });
        /**
         * @var {boolean} debug
         * @private
         */
        _optionsDebug.set(this, []);
    }
    generateTemplateBody(filesContent, steps) {
        let bodyTemplate = fs.readFileSync(__classPrivateFieldGet(this, _options).templatesBody, 'utf8'), templatesWrapper = fs.readFileSync(__classPrivateFieldGet(this, _options).templatesWrapper, 'utf8'), body = (new String()).toString();
        const row = steps.advance('Template Packing', 'mag').start();
        filesContent.forEach((file) => __awaiter(this, void 0, void 0, function* () {
            row.update(file, 'warning');
            let bodyReplace = bodyTemplate + '\n\r';
            templatesWrapper = templatesWrapper.replace('<%%file_dir%%>', file.file);
            templatesWrapper = templatesWrapper.replace('<%%version%%>', String(file.mime.modified.getTime()));
            templatesWrapper = templatesWrapper.replace('<%%content%%>', file.mime.content);
            bodyReplace = bodyReplace.replace('<%%hash%%>', md5_typescript_1.Md5.init(file.file.replace(__classPrivateFieldGet(this, _options).dirname + '/', '')));
            bodyReplace = bodyReplace.replace('<%%content%%>', js_base64_1.Base64.encode(templatesWrapper));
            bodyReplace = bodyReplace.replace('<%%file_dir%%>', file.file);
            bodyReplace = bodyReplace.replace('<%%size%%>', String(file.mime.size));
            bodyReplace = bodyReplace.replace('<%%create%%>', file.mime.create.toISOString());
            bodyReplace = bodyReplace.replace('<%%modified%%>', file.mime.modified.toISOString());
            body += bodyReplace;
        }));
        row.success('Templates successfully packaged', 'white_check_mark');
        return body;
    }
    generateTemplateMain(body) {
        let mainTemplate = fs.readFileSync(__classPrivateFieldGet(this, _options).templatesMain, 'utf8');
        mainTemplate = mainTemplate.replace('<%%contentBase64%%>', this.getOptions('contentBase64'));
        mainTemplate = mainTemplate.replace('<%%dirHash%%>', this.getOptions('contentBase64'));
        return mainTemplate.replace('<%%templates%%>', body);
    }
    generateTemplateBase(dir) {
        console.log(dir);
        let mainTemplate = fs.readFileSync(__classPrivateFieldGet(this, _options).templatesBase, 'utf8');
        mainTemplate = mainTemplate.replace('<%%md5%%>', fs.readFileSync(__dirname + '/../node_modules/md5-typescript/dist/index.js', 'utf8'));
        mainTemplate = mainTemplate.replace('export { Md5 };', '');
        return mainTemplate.replace('<%%cross-js%%>', fs.readFileSync(dir, 'utf8'));
    }
    buildTsToJs(dirFile, outDir) {
        return new Promise((ev) => {
            const ls = spawn("tsc", [dirFile]);
            ls.stdout.on("data", (data) => {
                ev();
            });
            ls.stderr.on('data', (data) => {
                console.error(`stderr: ${data.toString()}`);
            });
        });
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
    getFilesContent(directives, fileMime = [], steps) {
        const row = steps.advance('Pattern data collection', 'mag').start();
        directives.forEach((path) => {
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
            }
            catch (error) {
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
    getTemplateFiles(templateDir = false, steps) {
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
    getFilesRecursively(dir, files = [], iteration = 0) {
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
}
_debug = new WeakMap(), _options = new WeakMap(), _optionsDebug = new WeakMap();
//# sourceMappingURL=CrossTpl.js.map