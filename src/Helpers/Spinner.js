"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ora = require("ora");
class Spinner {
    constructor(prefix) {
        this.prefix = new String().toString();
        this.prefix = '[' + prefix + ']';
        this.spinner = Ora('Start ' + this.prefix).start();
    }
    start(prefix) {
        this.prefix = '[' + prefix + ']';
        this.spinner = Ora('Start ' + this.prefix).start();
        return this;
    }
    text(text) {
        this.spinner.text = this.prefix + ' ' + text;
        return this;
    }
    succeed(text) {
        this.spinner.succeed(this.prefix + ' ' + text);
        return this;
    }
    clear() {
        this.spinner.clear();
    }
    stop() {
        this.spinner.stop();
        return this;
    }
}
exports.Spinner = Spinner;
//# sourceMappingURL=Spinner.js.map