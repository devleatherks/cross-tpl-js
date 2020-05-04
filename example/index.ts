import { CrossTpl }  from '../src'

const crossTpl = new CrossTpl({
    dirname: __dirname,
    src: 'view',
    upload: false
});

// crossTpl.build();
crossTpl.watch();