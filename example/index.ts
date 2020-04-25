import { CrossTpl }  from '../src'

const crossTpl = new CrossTpl({
    dirname: __dirname,
    templates: 'view',
    upload: false
});

crossTpl.build();
// crossTpl.watch();