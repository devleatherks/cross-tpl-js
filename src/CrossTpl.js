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
var gulp = require("gulp");
var watch = require("gulp-watch");
var ts = require("gulp-typescript");
class CrossTpl {
    constructor(options) {
        _core.set(this, void 0);
        __classPrivateFieldSet(this, _core, new CrossTplCore());
        __classPrivateFieldGet(this, _core).options = options;
    }
    build() {
        const steps = new Steps_1.Steps(5);
        const files = __classPrivateFieldGet(this, _core).getTemplateFiles(false, steps);
        return this.isUpload() ? this.upload(files, steps) : this.create(files, steps);
    }
    create(files, steps) {
        const filesMime = __classPrivateFieldGet(this, _core).getFilesContent(files, [], steps);
        const body = __classPrivateFieldGet(this, _core).generateTemplateBody(filesMime, steps);
        const main = __classPrivateFieldGet(this, _core).generateTemplateMain(body);
        let row = steps.advance('Engine assembly', 'recycle').start();
        fs.writeFileSync(this.outDirTs(), main);
        row.update('Code generation');
        __classPrivateFieldGet(this, _core).buildTsToJs(this.outDirTs(), this.outDir()).then(() => {
            row.update('Build Code');
            fs.writeFileSync(this.outDirJs(), __classPrivateFieldGet(this, _core).generateTemplateBase(this.outDirJs()));
            row.success('Cross-tpl assembled', 'white_check_mark');
        });
    }
    watch() {
        const steps = new Steps_1.Steps(5);
        watch(__classPrivateFieldGet(this, _core).getOption('templates') + '/**/*', (file) => {
            this.upload([file.path], steps);
        });
    }
    upload(files, steps) {
        const filesMime = __classPrivateFieldGet(this, _core).getFilesContent(files, [], steps);
        let template = fs.readFileSync(this.outDirJs(), 'utf8');
        let row = steps.advance('Templates upload', 'recycle').start();
        template = __classPrivateFieldGet(this, _core).replaceTemplateBody(template, filesMime, steps.advance('Replace upload', 'recycle').start());
        template = __classPrivateFieldGet(this, _core).addTemplateBody(template, filesMime, steps.advance('Add Templates', 'recycle').start());
        template = __classPrivateFieldGet(this, _core).removeTemplateBody(template, steps.advance('Remove Templates', 'recycle').start());
        fs.writeFileSync(this.outDirJs(), template);
        row.success('Cross-tpl upload', 'white_check_mark');
    }
    outDir() {
        return (__classPrivateFieldGet(this, _core).getOptions('outDir') || '');
    }
    outDirJs() {
        return this.outDir() + '/' + 'CrossTemplate.js';
    }
    outDirTs() {
        return this.outDir() + '/' + 'CrossTemplate.ts';
    }
    isSourceJs() {
        if (fs.existsSync(this.outDirJs())) {
            return true;
        }
        return false;
    }
    isUpload() {
        if (__classPrivateFieldGet(this, _core).getOptions('upload') && this.isSourceJs()) {
            return true;
        }
        return false;
    }
}
exports.CrossTpl = CrossTpl;
_core = new WeakMap();
const CROSS_MODULE_WINDOW_BW = 'window';
const CROSS_MODULE_COMMON_JS = 'common';
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
            outDir: __dirname + '/dist',
            templatesBody: __dirname + '/templates/cross-tpl-body.txt',
            templatesMain: __dirname + '/templates/cross-tpl-main.txt',
            templatesBase: __dirname + '/templates/cross-tpl-base.txt',
            templatesModuleWindow: __dirname + '/templates/cross-tpl-module-window.txt',
            templatesModuleCommon: __dirname + '/templates/cross-tpl-module-common.txt',
            moduleBuild: CROSS_MODULE_COMMON_JS,
            templatesWrapper: __dirname + '/templates/cross-tpl-wrapper.txt',
            contentBase64: true,
            upload: true,
            dirHash: true
        });
        /**
         * @var {boolean} debug
         * @private
         */
        _optionsDebug.set(this, []);
    }
    generateTemplateBody(filesContent, steps) {
        let body = (new String()).toString();
        const row = steps.advance('Template Packing', 'mag').start();
        filesContent.forEach((file) => __awaiter(this, void 0, void 0, function* () {
            row.update(file, 'warning');
            body += this.createTemplateBody(file);
        }));
        row.success('Templates successfully packaged', 'white_check_mark');
        return body;
    }
    createTemplateBody(file) {
        let bodyTemplate = fs.readFileSync(__classPrivateFieldGet(this, _options).templatesBody, 'utf8');
        let contact = fs.readFileSync(__classPrivateFieldGet(this, _options).templatesWrapper, 'utf8');
        let bodyReplace = bodyTemplate + '\n\r';
        contact = contact.replace('<%%file_dir%%>', file.file.replace(__classPrivateFieldGet(this, _options).dirname + '/', ''));
        contact = contact.replace('<%%version%%>', String(file.mime.modified.getTime()));
        contact = contact.replace('<%%content%%>', file.mime.content);
        bodyReplace = bodyReplace.replace(new RegExp('\\<%%hash%%\\>', 'g'), md5_typescript_1.Md5.init(file.file.replace(__classPrivateFieldGet(this, _options).dirname + '/', '')));
        bodyReplace = bodyReplace.replace('<%%content%%>', js_base64_1.Base64.encode(contact));
        bodyReplace = bodyReplace.replace('<%%file_dir%%>', file.file.replace(__classPrivateFieldGet(this, _options).dirname + '/', ''));
        bodyReplace = bodyReplace.replace('<%%size%%>', String(file.mime.size));
        bodyReplace = bodyReplace.replace('<%%create%%>', file.mime.create.toISOString());
        return bodyReplace.replace('<%%modified%%>', file.mime.modified.toISOString());
    }
    replaceTemplateBody(template, filesContent, row) {
        let i = 0;
        filesContent.forEach((file) => __awaiter(this, void 0, void 0, function* () {
            let hash = md5_typescript_1.Md5.init(file.file.replace(__classPrivateFieldGet(this, _options).dirname + '/', ''));
            if (this.isTemplateInclude(template, hash)) {
                i++;
                template = template.replace(new RegExp(`\\/\\*\\*${hash}\\*\\*.*\\/\\*\\*-${hash}\\*\\*\\/`, "gm"), `/**${hash}**/\`${js_base64_1.Base64.encode(file.mime.content)}\`/**-${hash}**/`);
                row.update('Replace Template - ' + i, 'warning');
            }
        }));
        row.success('Replaced Template - ' + i, 'white_check_mark');
        return template;
    }
    addTemplateBody(template, filesContent, row) {
        let i = 0;
        filesContent.forEach((file) => __awaiter(this, void 0, void 0, function* () {
            let hash = md5_typescript_1.Md5.init(file.file.replace(__classPrivateFieldGet(this, _options).dirname + '/', ''));
            if (!this.isTemplateInclude(template, hash)) {
                template = template.replace('/**<%%app_templates%%>**/', `${this.createTemplateBody(file)}/**<%%app_templates%%>**/`);
                i++;
                row.update('Add Template - ' + i, 'warning');
            }
        }));
        row.success('Added Template - ' + i, 'white_check_mark');
        return template;
    }
    removeTemplateBody(template, row) {
        let i = 0;
        const list = this.listTemplateHash(template);
        const files = this.getFilesRecursively(this.getOption('dirname') + '/' + this.getOption('templates'), [], 0, true);
        list.forEach((hash) => __awaiter(this, void 0, void 0, function* () {
            if (files.indexOf(hash) === -1) {
                template = template.replace(new RegExp(`\\/\\*\\/open\\/${hash}\\*\\*\\*\\/.*\\/\\*\\/close\\/${hash}\\*\\*\\*\\/`, "gs"), '');
                i++;
                row.update('Remove Template - ' + i, 'warning');
            }
        }));
        row.success('Removed Template - ' + i, 'white_check_mark');
        return template;
    }
    listTemplateHash(template) {
        let hash = [];
        let tags = template.match(RegExp("\\/\\*\\/open\\/(\\w*)\\*\\*\\*\\/", 'g')) || [];
        tags.forEach((tag) => {
            hash.push(tag.replace('/*/open/', '').replace('***/', ''));
        });
        return hash;
    }
    generateTemplateMain(body) {
        let mainTemplate = fs.readFileSync(__classPrivateFieldGet(this, _options).templatesMain, 'utf8');
        mainTemplate = mainTemplate.replace('<%%contentBase64%%>', this.getOptions('contentBase64'));
        mainTemplate = mainTemplate.replace('<%%dirHash%%>', this.getOptions('contentBase64'));
        return mainTemplate.replace('<%%templates%%>', body);
    }
    generateTemplateBase(dir) {
        let mainTemplate = fs.readFileSync(__classPrivateFieldGet(this, _options).templatesBase, 'utf8');
        let moduleBody = fs.readFileSync(this.getModulePath(__classPrivateFieldGet(this, _options).moduleBuild), 'utf8');
        mainTemplate = mainTemplate.replace('<%%md5%%>', fs.readFileSync(__dirname + '/../node_modules/md5-typescript/dist/index.js', 'utf8').replace(/\s{2,}/g, ""));
        mainTemplate = mainTemplate.replace('export { Md5 };', '');
        mainTemplate = mainTemplate.replace('<%%cross-js%%>', fs.readFileSync(dir, 'utf8'));
        return moduleBody.replace('<%%body%%>', mainTemplate);
    }
    getModulePath(name) {
        switch (name) {
            case CROSS_MODULE_WINDOW_BW:
                return __classPrivateFieldGet(this, _options).templatesModuleWindow;
                break;
            case CROSS_MODULE_COMMON_JS:
                return __classPrivateFieldGet(this, _options).templatesModuleCommon;
                break;
        }
        return __classPrivateFieldGet(this, _options).templatesModuleCommon;
    }
    buildTsToJs(dirFile, outDir) {
        return new Promise((ev) => {
            gulp.src(dirFile)
                .pipe(ts({
                "target": "es5",
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
            })).pipe(gulp.dest(outDir)).on("end", (data) => {
                ev();
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
    isTemplateInclude(content, hash) {
        if (content.search(new RegExp(`\\/\\*\\*${hash}\\*\\*\\/`, "gm")) !== -1 &&
            content.search(new RegExp(`\\/\\*\\*-${hash}\\*\\*\\/`, "gm")) !== -1) {
            return true;
        }
        return false;
    }
    /**
     * Get Template Files
     *
     * @param {string} templateDir
     * @returns {Array<string>}
     */
    getTemplateFiles(templateDir = false, steps, hash = false) {
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
    getFilesRecursively(dir, files = [], iteration = 0, hash = false) {
        const objects = fs.readdirSync(dir);
        if (objects.length === 0 && iteration === 0) {
            return [];
        }
        for (const index in objects) {
            const name = dir + '/' + objects[index];
            if (fs.statSync(name).isDirectory()) {
                this.getFilesRecursively(name, files, iteration++, hash);
            }
            else {
                files.push(hash ? md5_typescript_1.Md5.init(name.replace(__classPrivateFieldGet(this, _options).dirname + '/', '')) : name);
            }
        }
        return files;
    }
}
_debug = new WeakMap(), _options = new WeakMap(), _optionsDebug = new WeakMap();
//# sourceMappingURL=CrossTpl.js.map