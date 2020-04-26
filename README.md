### Cross-tp is a convenient template builder. After configuring and running the script, go out, get the js file you can connect to your project.
#### Using

``` ts
import { CrossTpl }  from '../src'

const crossTpl = new CrossTpl({
    dirname: __dirname,
    templates: 'view',
    upload: false // If true, then the build function will update the previously created
});

crossTpl.create(); // build a script
crossTpl.upload(); // update the script
crossTpl.build(); // build and update the script
crossTpl.watch(); // for automatic updates. Delete, add, update templates. works on gulp
```

#### Result | source
``` ts 
    // src/dist/CrossTemplates.js || or other specified path in outDir configuration
    /****/

    /*/open/8cd728920dc49356699b7ef285a1323b***/
    /*!*************************************************************!*\
    !*** Name: hi.html ***!
    !*** Template: view/hi.html:52 ***!
    !*** Create:   2020-04-25T08:44:46.325Z ***!
    !*** Modified: 2020-04-25T09:02:28.153Z ***!
    \*************************************************************/
    CrossTplCore.templates.set('8cd728920dc49356699b7ef285a1323b', /**8cd728920dc49356699b7ef285a1323b**/ "PGRpdiBpZD0iY3Jvc3MtdHBsIj5IaSEgTXkgbmFtZSBpcyBDcm9zc0pzIDopIDwvZGl2Pg==" /**-8cd728920dc49356699b7ef285a1323b**/);
    /*/close/8cd728920dc49356699b7ef285a1323b***/

    /****/

    CrossTemplates.render = function (name, handler) {
        if (handler === void 0) { handler = false; }
        if (CrossTplCore.options.dirHash) {
            name = Md5.init(name);
        }
        var content = CrossTplCore.templates.get(name) || '';
        if (CrossTplCore.options.contentBase64 && content) {
            content = decodeURIComponent(atob(content).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        }
        return content || '';
    };

    /*****/
```
#### Result | use of source
``` ts 
    import { CrossTemplates } from 'cross-tpl/src/dist/CrossTemplates';
    const template = CrossTemplates.render('hi.html');

    console.log(template); // <div id="cross-tpl">Hi! My name is CrossJs :) </div>
```