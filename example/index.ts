import { CrossTpl }  from '../src'

const crossTpl = new CrossTpl({
    dirname: __dirname,
    templates: 'view',
    outDir: ''
});

crossTpl.build();