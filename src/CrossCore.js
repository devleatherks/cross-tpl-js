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
const js_base64_1 = require("js-base64");
const md5_typescript_1 = require("md5-typescript");
var gulp = require("gulp");
var watch = require("gulp-watch");
const Disk_1 = require("./Helpers/Disk");
var ts = require("gulp-typescript");
var path = require("path");
const { spawn } = require("child_process");
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
            type: 'json',
            src: void 0,
            outDir: __dirname + '/dist',
            templateBodyLang: __dirname + '/templates/cross-body-lang.js',
            templateBodyMix: __dirname + '/templates/cross-body-mix.js',
            templateMainLang: __dirname + '/templates/cross-main-lang.ts',
            templateMainMix: __dirname + '/templates/cross-main-mix.ts',
            templatesBase: __dirname + '/templates/cross-tpl-base.txt',
            templatesModuleWindow: __dirname + '/templates/cross-tpl-module-window.js',
            templatesModuleWindowLocal: __dirname + '/templates/cross-local-module-window.js',
            templatesModuleCommon: __dirname + '/templates/cross-tpl-module-common.js',
            templatesModuleCommonLocal: __dirname + '/templates/cross-local-module-common.js',
            moduleBuild: exports.CROSS_MODULE_COMMON_JS,
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
    src(append = '') {
        return __classPrivateFieldGet(this, _options).dirname + '/' + __classPrivateFieldGet(this, _options).src + append;
    }
    /**
     * @param {CrossFile} file
     * @returns {string}
     */
    getBodyTemplate(file) {
        return Disk_1.Disk.content(this.isLang(file) ? __classPrivateFieldGet(this, _options).templateBodyLang : __classPrivateFieldGet(this, _options).templateBodyMix);
    }
    /**
         * @param {CrossFile} file
         * @returns {string}
         */
    getMainTemplate(lang) {
        return Disk_1.Disk.content(lang ? __classPrivateFieldGet(this, _options).templateMainLang : __classPrivateFieldGet(this, _options).templateMainMix);
    }
    /**
     * @param {CrossFile} file
     * @returns {string}
     */
    body(file) {
        let bodyTemplate = this.getBodyTemplate(file);
        let bodyReplace = bodyTemplate + '\n\r';
        bodyReplace = bodyReplace.replace(new RegExp('\\<%%hash%%\\>', 'g'), this.hash(file));
        bodyReplace = bodyReplace.replace('<%%content%%>', js_base64_1.Base64.encode(file.content));
        bodyReplace = bodyReplace.replace('<%%file_dir%%>', file.path);
        bodyReplace = bodyReplace.replace('<%%name%%>', file.mime.name);
        bodyReplace = bodyReplace.replace('<%%size%%>', String(file.mime.size));
        bodyReplace = bodyReplace.replace('<%%create%%>', file.mime.create.toISOString());
        if (this.isLang(file)) {
            bodyReplace = bodyReplace.replace('/**<%%lang_hash%%>**/', md5_typescript_1.Md5.init(file.lang));
            bodyReplace = bodyReplace.replace('<%%lang%%>', String(file.lang));
        }
        return bodyReplace.replace('<%%modified%%>', file.mime.modified.toISOString());
    }
    /**
     * @param {CrossFile[]} files
     * @param {string} template
     */
    refresh(files, template) {
        files.forEach((file) => __awaiter(this, void 0, void 0, function* () {
            let hash = this.hash(file);
            if (this.isTemplateInclude(template, hash)) {
                this.console.text('Refresh ' + file.path);
                template = template.replace(new RegExp(`\\/\\*\\*${hash}\\*\\*.*\\/\\*\\*-${hash}\\*\\*\\/`, "gm"), `/**${hash}**/\`${js_base64_1.Base64.encode(file.content)}\`/**-${hash}**/`);
            }
        }));
        return template;
    }
    /**
     * @param {CrossFile[]} files
     * @param {string} template
     * @returns {string}
     */
    add(files, template) {
        files.forEach((file) => __awaiter(this, void 0, void 0, function* () {
            let hash = this.hash(file);
            if (!this.isTemplateInclude(template, hash)) {
                this.console.text('added ' + file.path);
                template = template.replace('/**<%%app_templates%%>**/', `${this.body(file)}/**<%%app_templates%%>**/`);
            }
        }));
        return template;
    }
    /**
     * @param {CrossFile[]} files
     * @param {string} template
     * @returns {string}
     */
    remove(files, template) {
        const list = this.listTemplateHash(template);
        let fileHash = [];
        files.forEach((file) => {
            fileHash.push(this.hash(file));
        });
        list.forEach((hash) => __awaiter(this, void 0, void 0, function* () {
            if (fileHash.indexOf(hash) === -1) {
                this.console.text('Remove ' + hash);
                template = template.replace(new RegExp(`\\/\\*\\/open\\/${hash}\\*\\*\\*\\/.*\\/\\*\\/close\\/${hash}\\*\\*\\*\\/`, "gs"), '');
            }
        }));
        return template;
    }
    /**
     * @param {string} template
     * @returns {Array<string>}
     */
    listTemplateHash(template) {
        let hash = [];
        let tags = template.match(RegExp("\\/\\*\\/open\\/(\\w*)\\*\\*\\*\\/", 'g')) || [];
        tags.forEach((tag) => {
            hash.push(tag.replace('/*/open/', '').replace('***/', ''));
        });
        return hash;
    }
    /**
     * @param {string} body
     * @param {boolean} lang
     */
    main(body, lang) {
        let mainTemplate = this.getMainTemplate(lang);
        mainTemplate = mainTemplate.replace('\'/** <%%contentBase64%%> */\'', this.getOptions('contentBase64'));
        mainTemplate = mainTemplate.replace('\'/** <%%dirHash%%> */\'', this.getOptions('contentBase64'));
        return mainTemplate.replace('/*<%%templates%%>*/', body);
    }
    generateTemplateBase(dir, type) {
        let mainTemplate = fs.readFileSync(__classPrivateFieldGet(this, _options).templatesBase, 'utf8');
        let moduleBody = fs.readFileSync(this.getModulePath(__classPrivateFieldGet(this, _options).moduleBuild, type), 'utf8');
        let pathMd5 = [
            __dirname + '/../node_modules/md5-typescript/dist/index.js',
            __dirname + '/../../md5-typescript/dist/index.js',
        ];
        pathMd5.forEach((path) => {
            if (fs.existsSync(path)) {
                mainTemplate = mainTemplate.replace('<%%md5%%>', fs.readFileSync(path, 'utf8').replace(/\s{2,}/g, ""));
                return true;
            }
        });
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
    isTemplateInclude(content, hash) {
        if (content.search(new RegExp(`\\/\\*\\*${hash}\\*\\*\\/`, "gm")) !== -1 &&
            content.search(new RegExp(`\\/\\*\\*-${hash}\\*\\*\\/`, "gm")) !== -1) {
            return true;
        }
        return false;
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
     * @param {CrossFile} file
     * @param {string} prefix
     * @returns {string}
     */
    hash(file, prefix = '') {
        let name = file.path;
        if (this.isLang(file)) {
            prefix += md5_typescript_1.Md5.init(file.lang) + '-';
            name = file.mime.name;
        }
        return md5_typescript_1.Md5.init(prefix + name);
    }
    /**
     * @param {CrossFile} file
     * @returns {boolean}
     */
    isLang(file) {
        if ('lang' in file && file.lang !== false) {
            return true;
        }
        return false;
    }
    /**
     * @param {Array<string>} list
     * @param {boolean} lang
     * @param {Array<Promise<CrossFile>>} files
     * @returns {Promise<CrossFile[]>}
     */
    load(list, isLang = false, files = []) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(ok => {
                list.forEach((file) => __awaiter(this, void 0, void 0, function* () {
                    if (!fs.existsSync(file)) {
                        return false;
                    }
                    files.push(new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                        const mime = Disk_1.Disk.mime(file);
                        const path = file.replace(this.src('/'), '');
                        const lang = path.split('/')[0];
                        const mounting = {
                            path: path,
                            pwd: file,
                            mime: mime,
                            lang: isLang ? lang : isLang,
                            content: yield Disk_1.Disk.contentHandler(file, mime.type),
                        };
                        return void resolve(mounting);
                    })));
                }));
                Promise.all(files).then((values) => {
                    return void ok(values);
                });
            });
        });
    }
}
exports.CrossTplCore = CrossTplCore;
_debug = new WeakMap(), _options = new WeakMap(), _optionsDebug = new WeakMap();
//# sourceMappingURL=CrossCore.js.map