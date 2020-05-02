"use strict";
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
var _core;
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const CrossCore_1 = require("./CrossCore");
const Steps_1 = require("./Steps");
var watch = require("gulp-watch");
class CrossLocal {
    constructor(options) {
        _core.set(this, void 0);
        __classPrivateFieldSet(this, _core, new CrossCore_1.CrossTplCore());
        __classPrivateFieldGet(this, _core).options = options;
    }
    build() {
        const steps = new Steps_1.Steps(5);
        const collection = __classPrivateFieldGet(this, _core).getLocalCollection(this.localDir(), steps);
        // console.log(collection);
        return this.isUpload() ? this.upload(collection, steps) : this.create(collection, steps);
    }
    create(files, steps) {
        let body = '';
        files.forEach((filesMime, key) => {
            body += __classPrivateFieldGet(this, _core).generateTemplateBodyLocal(filesMime, key);
        });
        const main = __classPrivateFieldGet(this, _core).generateTemplateMainLocal(body);
        let row = steps.advance('Engine assembly', 'recycle').start();
        fs.writeFileSync(this.outDirTs(), main);
        row.update('Code generation');
        __classPrivateFieldGet(this, _core).buildTsToJs(this.outDirTs(), this.outDir()).then(() => {
            row.update('Build Code');
            fs.writeFileSync(this.outDirJs(), __classPrivateFieldGet(this, _core).generateTemplateBase(this.outDirJs(), CrossCore_1.PLUGIN_CROSS_LOCAL));
            fs.unlinkSync(this.outDirTs());
            row.success('Cross-tpl assembled', 'white_check_mark');
        });
    }
    watch() {
        const steps = new Steps_1.Steps(5);
        watch(__classPrivateFieldGet(this, _core).getOption('templates') + '/**/*', (file) => {
            // this.upload([file.path], steps);
        });
    }
    upload(files, steps) {
        // const filesMime = this.#core.getFilesContent(files, [], steps);
        // let template = fs.readFileSync(this.outDirJs(), 'utf8');
        // let row = steps.advance('Templates upload', 'recycle').start();
        // template = this.#core.replaceTemplateBody(template, filesMime, steps.advance('Replace upload', 'recycle').start());
        // template = this.#core.addTemplateBody(template, filesMime, steps.advance('Add Templates', 'recycle').start());
        // template = this.#core.removeTemplateBody(template, steps.advance('Remove Templates', 'recycle').start());
        // fs.writeFileSync(this.outDirJs(), template);
        // row.success('Cross-tpl upload', 'white_check_mark');
    }
    outDir() {
        return (__classPrivateFieldGet(this, _core).getOptions('outDir') || '');
    }
    localDir() {
        return (__classPrivateFieldGet(this, _core).getOptions('dirname') || '') + '/' + (__classPrivateFieldGet(this, _core).getOptions('localDir') || '');
    }
    outDirJs() {
        return this.outDir() + '/' + 'CrossLocal.js';
    }
    outDirTs() {
        return this.outDir() + '/' + 'CrossLocal.ts';
    }
    isSourceJs() {
        if (fs.existsSync(this.outDirJs())) {
            return true;
        }
        return false;
    }
    isUpload() {
        // if (this.#core.getOptions('upload') && this.isSourceJs()) {
        //     return true;
        // }
        return false;
    }
}
exports.CrossLocal = CrossLocal;
_core = new WeakMap();
//# sourceMappingURL=CrossLocal.js.map