declare class Md5 {
    static init(name: string): any
}

declare function md5(): () => any;

class CrossTplCore {
    public static templates = new Map();
    public static options = {
        contentBase64: true,
        dirHash: true
    }
}

/*/open/820d10a791b925866ead1cbb58334ef7***/
/*!*************************************************************!*\
  !*** Template: view/hi.html:25 ***!
  !*** Create:   2020-04-25T08:44:46.325Z ***!
  !*** Modified: 2020-04-25T08:46:15.685Z ***!
  \*************************************************************/
CrossTplCore.templates.set('820d10a791b925866ead1cbb58334ef7', /**820d10a791b925866ead1cbb58334ef7**/`PCEtLS9vcGVuLyB2aWV3L2hpLmh0bWwgLy0tPgo8IS0tIHZlcnNpb246IDE1ODc4MDQzNzU2ODUgLS0+CkhpISBNeSBuYW1lIGlzIENyb3NzSnMgOikKPCEtLS9lbmQvIDwlJWZpbGVfZGlyJSU+IC8tLT4=`/**-820d10a791b925866ead1cbb58334ef7**/);
/*/close/820d10a791b925866ead1cbb58334ef7***/


/**<%%app_templates%%>**/

/**
 * Cross JS Template
 * 
 * @class CrossJSTemplate 
 * @link usemint.com
 */
export class CrossTemplates {
    

    public static md5 = void 0;

    constructor() {
        
    }

    public static render(name: string, handler: boolean = false) {
        if(CrossTplCore.options.dirHash) {
            name = Md5.init(name);
        }

        let content = CrossTplCore.templates.get(name) || '';

        if(CrossTplCore.options.contentBase64 && content) {
            content = decodeURIComponent(atob(content).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        }

        return content || '';
    } 

    public static setMD5(md5: any): any {
        CrossTemplates.md5 = md5;
    }
}

if(typeof md5 !== 'undefined') {
    CrossTemplates.setMD5(md5);
}
