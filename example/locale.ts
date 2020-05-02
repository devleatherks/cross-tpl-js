import { CrossLocal }  from '../src'

const crossLocal = new CrossLocal({
    dirname: __dirname,
    localDir: 'local',
    moduleBuild: 'window'
});

crossLocal.build();
// crossTpl.watch();