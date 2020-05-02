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
class CrossTpl {
    constructor(options) {
        _core.set(this, void 0);
        __classPrivateFieldSet(this, _core, new CrossCore_1.CrossTplCore());
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
            fs.writeFileSync(this.outDirJs(), __classPrivateFieldGet(this, _core).generateTemplateBase(this.outDirJs(), CrossCore_1.PLUGIN_CROSS_TPL));
            fs.unlinkSync(this.outDirTs());
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
        return this.outDir() + '/' + 'CrossTemplates.js';
    }
    outDirTs() {
        return this.outDir() + '/' + 'CrossTemplates.ts';
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
//# sourceMappingURL=CrossTpl.js.map