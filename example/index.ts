import { CrossTpl }  from '../src'

const crossTpl = new CrossTpl({
    dirname: __dirname,
    src: 'view',
    upload: false,
    moduleBuild: 'amd'
});

(async() => {
    crossTpl.build();
    crossTpl.watch();
})()
