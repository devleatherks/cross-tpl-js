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
import * as fs from 'fs';
export class CrossTpl {
    constructor(options) {
        _core.set(this, void 0);
        __classPrivateFieldSet(this, _core, new CrossTplCore());
        __classPrivateFieldGet(this, _core).options = options;
    }
    build() {
    }
}
_core = new WeakMap();
class CrossTplCore {
    constructor() {
        _debug.set(this, false);
        _options.set(this, {
            templates: 'view',
            debug: true,
        });
        _optionsDebug.set(this, []);
    }
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
    getTemplateFiles() {
        // this.getFilesRecursively();
    }
    /**
     * Get all files recursively
     *
     * @param {string} dir
     * @param {Array<string>} files
     * @param {number} iteration
     *
     * @returns {Array<string>}
     */
    static getFilesRecursively(dir, files = [], iteration = 0) {
        const objects = fs.readdirSync(dir);
        if (objects.length === 1 && iteration === 0) {
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