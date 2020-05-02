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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _debug, _options, _optionsDebug;
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const nodePathModule = require("path");
const js_base64_1 = require("js-base64");
const md5_typescript_1 = require("md5-typescript");
var gulp = require("gulp");
var watch = require("gulp-watch");
var ts = require("gulp-typescript");
var path = require("path");
exports.CROSS_MODULE_WINDOW_BW = 'window';
exports.CROSS_MODULE_COMMON_JS = 'common';
exports.PLUGIN_CROSS_TPL = 'cross-tpl';
exports.PLUGIN_CROSS_LOCAL = 'cross-local';
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
            localDir: void 0,
            outDir: __dirname + '/dist',
            templatesBody: __dirname + '/templates/cross-tpl-body.txt',
            templatesBodyLocal: __dirname + '/templates/cross-local-body.js',
            templatesMain: __dirname + '/templates/cross-tpl-main.txt',
            templatesMainLocal: __dirname + '/templates/cross-local-main.ts',
            templatesBase: __dirname + '/templates/cross-tpl-base.txt',
            templatesModuleWindow: __dirname + '/templates/cross-tpl-module-window.txt',
            templatesModuleWindowLocal: __dirname + '/templates/cross-local-module-window.js',
            templatesModuleCommon: __dirname + '/templates/cross-tpl-module-common.txt',
            templatesModuleCommonLocal: __dirname + '/templates/cross-local-module-common.js',
            moduleBuild: exports.CROSS_MODULE_COMMON_JS,
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
    generateTemplateBodyLocal(filesContent, key) {
        let body = (new String()).toString();
        filesContent.forEach((value) => __awaiter(this, void 0, void 0, function* () {
            body += this.createTemplateBodyLocal(value, key);
        }));
        return body;
    }
    templateDir(append = '') {
        return __classPrivateFieldGet(this, _options).dirname + '/' + __classPrivateFieldGet(this, _options).templates + append;
    }
    createTemplateBody(file) {
        let bodyTemplate = fs.readFileSync(__classPrivateFieldGet(this, _options).templatesBody, 'utf8');
        let contact = fs.readFileSync(__classPrivateFieldGet(this, _options).templatesWrapper, 'utf8');
        let bodyReplace = bodyTemplate + '\n\r';
        contact = contact.replace('<%%file_dir%%>', file.file.replace(__classPrivateFieldGet(this, _options).dirname + '/', ''));
        contact = contact.replace('<%%version%%>', String(file.mime.modified.getTime()));
        contact = contact.replace('<%%content%%>', file.mime.content);
        bodyReplace = bodyReplace.replace(new RegExp('\\<%%hash%%\\>', 'g'), md5_typescript_1.Md5.init(file.file.replace(this.templateDir('/'), '')));
        bodyReplace = bodyReplace.replace('<%%content%%>', js_base64_1.Base64.encode(contact));
        bodyReplace = bodyReplace.replace('<%%file_dir%%>', file.file.replace(__classPrivateFieldGet(this, _options).dirname + '/', ''));
        bodyReplace = bodyReplace.replace('<%%name_dir%%>', file.file.replace(this.templateDir('/'), ''));
        bodyReplace = bodyReplace.replace('<%%size%%>', String(file.mime.size));
        bodyReplace = bodyReplace.replace('<%%create%%>', file.mime.create.toISOString());
        return bodyReplace.replace('<%%modified%%>', file.mime.modified.toISOString());
    }
    createTemplateBodyLocal(file, key) {
        let bodyTemplate = fs.readFileSync(__classPrivateFieldGet(this, _options).templatesBodyLocal, 'utf8');
        let bodyReplace = bodyTemplate + '\n\r';
        bodyReplace = bodyReplace.replace(new RegExp('\\<%%hash%%\\>', 'g'), md5_typescript_1.Md5.init(path.basename(file.file).replace(file.mime.type, '')));
        bodyReplace = bodyReplace.replace('<%%content%%>', js_base64_1.Base64.encode(file.mime.content));
        bodyReplace = bodyReplace.replace('<%%file_dir%%>', file.file.replace(__classPrivateFieldGet(this, _options).dirname + '/', ''));
        bodyReplace = bodyReplace.replace('<%%name%%>', path.basename(file.file).replace(file.mime.type, ''));
        bodyReplace = bodyReplace.replace('<%%size%%>', String(file.mime.size));
        bodyReplace = bodyReplace.replace('<%%create%%>', file.mime.create.toISOString());
        bodyReplace = bodyReplace.replace('/**<%%local%%>**/', md5_typescript_1.Md5.init(key));
        return bodyReplace.replace('<%%modified%%>', file.mime.modified.toISOString());
    }
    replaceTemplateBody(template, filesContent, row) {
        let i = 0;
        filesContent.forEach((file) => __awaiter(this, void 0, void 0, function* () {
            let hash = md5_typescript_1.Md5.init(file.file.replace(this.templateDir('/'), ''));
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
            let hash = md5_typescript_1.Md5.init(file.file.replace(this.templateDir('/'), ''));
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
    generateTemplateMainLocal(body) {
        let mainTemplate = fs.readFileSync(__classPrivateFieldGet(this, _options).templatesMainLocal, 'utf8');
        mainTemplate = mainTemplate.replace('\'/** <%%contentBase64%%> */\'', this.getOptions('contentBase64'));
        mainTemplate = mainTemplate.replace('\'/** <%%dirHash%%> */\'', this.getOptions('contentBase64'));
        return mainTemplate.replace('/** <%%templates%%> */', body);
    }
    generateTemplateBase(dir, type) {
        let mainTemplate = fs.readFileSync(__classPrivateFieldGet(this, _options).templatesBase, 'utf8');
        let moduleBody = fs.readFileSync(this.getModulePath(__classPrivateFieldGet(this, _options).moduleBuild, type), 'utf8');
        mainTemplate = mainTemplate.replace('<%%md5%%>', fs.readFileSync(__dirname + '/../node_modules/md5-typescript/dist/index.js', 'utf8').replace(/\s{2,}/g, ""));
        mainTemplate = mainTemplate.replace('export { Md5 };', '');
        mainTemplate = mainTemplate.replace('<%%cross-js%%>', fs.readFileSync(dir, 'utf8'));
        return moduleBody.replace('/* <%%body%%> */', mainTemplate);
    }
    getModulePath(name, plugin = exports.PLUGIN_CROSS_TPL) {
        let window, commonjs;
        switch (plugin) {
            case exports.PLUGIN_CROSS_TPL:
                window = __classPrivateFieldGet(this, _options).templatesModuleWindow;
                break;
            case exports.PLUGIN_CROSS_LOCAL:
                window = __classPrivateFieldGet(this, _options).templatesModuleWindowLocal;
                break;
        }
        switch (plugin) {
            case exports.PLUGIN_CROSS_TPL:
                commonjs = __classPrivateFieldGet(this, _options).templatesModuleCommon;
                break;
            case exports.PLUGIN_CROSS_LOCAL:
                commonjs = __classPrivateFieldGet(this, _options).templatesModuleCommonLocal;
                break;
        }
        switch (name) {
            case exports.CROSS_MODULE_WINDOW_BW:
                return window;
                break;
            case exports.CROSS_MODULE_COMMON_JS:
                return commonjs;
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
                files.push(hash ? md5_typescript_1.Md5.init(name.replace(this.templateDir('/'), '')) : name);
            }
        }
        return files;
    }
    getLocalCollection(path, step) {
        const objects = fs.readdirSync(path);
        let locales = new Map();
        if (objects.length === 0) {
            return locales;
        }
        for (const index in objects) {
            locales.set(objects[index], this.getFilesContent(this.getFilesRecursively(path + '/' + objects[index]), [], step));
        }
        return locales;
    }
}
exports.CrossTplCore = CrossTplCore;
_debug = new WeakMap(), _options = new WeakMap(), _optionsDebug = new WeakMap();
//# sourceMappingURL=CrossCore.js.map