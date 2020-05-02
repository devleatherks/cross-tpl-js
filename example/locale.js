"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const crossLocal = new src_1.CrossLocal({
    dirname: __dirname,
    localDir: 'local',
    moduleBuild: 'window'
});
crossLocal.build();
// crossTpl.watch();
//# sourceMappingURL=locale.js.map