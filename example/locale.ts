import { CrossLang }  from '../src'

const crossLang = new CrossLang({
    dirname: __dirname,
    src: 'local',
    moduleBuild: 'window',
    upload: false
});

( async () => {
    await crossLang.build();
})()
// crossLocal.watch();