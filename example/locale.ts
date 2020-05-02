import { CrossLang }  from '../src'

const crossLang = new CrossLang({
    dirname: __dirname,
    localDir: 'local',
    moduleBuild: 'window',
    type: 'php',
    upload: false
});

( async () => {
    await crossLang.build();
})()
// crossLocal.watch();