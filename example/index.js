"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const crossTpl = new src_1.CrossTpl({
    dirname: __dirname,
    templates: 'view',
    upload: false
});
crossTpl.build();
// crossTpl.watch();
//# sourceMappingURL=index.js.map