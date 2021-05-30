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
var _core;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrossTpl = void 0;
const fs = require("fs");
const CrossCore_1 = require("./CrossCore");
const Disk_1 = require("./Helpers/Disk");
const Spinner_1 = require("./Helpers/Spinner");
var watch = require("gulp-watch");
class CrossTpl {
    constructor(options) {
        _core.set(this, void 0);
        __classPrivateFieldSet(this, _core, new CrossCore_1.CrossTplCore());
        __classPrivateFieldGet(this, _core).options = options;
        __classPrivateFieldGet(this, _core).console = new Spinner_1.Spinner('Cross-tpl');
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            const list = Disk_1.Disk.list(this.dir);
            const files = yield __classPrivateFieldGet(this, _core).load(list, false);
            return this.isUpload() ? this.upload(files) : this.create(files);
        });
    }
    create(files, body = []) {
        __classPrivateFieldGet(this, _core).console.text('Create [' + files.length + ']');
        files.forEach((filesMime) => {
            body.push(__classPrivateFieldGet(this, _core).body(filesMime));
        });
        const main = __classPrivateFieldGet(this, _core).main(body.join(''), false);
        fs.writeFileSync(this.outDirTs, main);
        __classPrivateFieldGet(this, _core).console.text('Script generation');
        __classPrivateFieldGet(this, _core).buildTsToJs(this.outDirTs, this.outDir()).then(() => {
            __classPrivateFieldGet(this, _core).console.text('We pack the structure');
            fs.writeFileSync(this.outDirJs, __classPrivateFieldGet(this, _core).generateTemplateBase(this.outDirJs, CrossCore_1.PLUGIN_CROSS_TPL));
            fs.unlinkSync(this.outDirTs);
            __classPrivateFieldGet(this, _core).console.succeed('Success! Done');
        });
    }
    watch() {
        watch(this.dir + '/**/*', (file) => __awaiter(this, void 0, void 0, function* () {
            console.log(file.path);
            this.upload(yield __classPrivateFieldGet(this, _core).load([file.path], false));
        }));
    }
    upload(files) {
        return __awaiter(this, void 0, void 0, function* () {
            let template = fs.readFileSync(this.outDirJs, 'utf8');
            template = __classPrivateFieldGet(this, _core).refresh(files, template);
            template = __classPrivateFieldGet(this, _core).add(files, template);
            const list = Disk_1.Disk.list(this.dir);
            template = __classPrivateFieldGet(this, _core).remove(yield __classPrivateFieldGet(this, _core).load(list, false), template);
            fs.writeFileSync(this.outDirJs, template);
        });
    }
    get dir() {
        return (__classPrivateFieldGet(this, _core).getOptions('dirname') || '') + '/' + (__classPrivateFieldGet(this, _core).getOptions('src') || '');
    }
    outDir() {
        return (__classPrivateFieldGet(this, _core).getOptions('outDir') || '');
    }
    get outDirJs() {
        return this.outDir() + '/' + 'CrossTemplates.js';
    }
    get outDirTs() {
        return this.outDir() + '/' + 'CrossTemplates.ts';
    }
    isSourceJs() {
        if (fs.existsSync(this.outDirJs)) {
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