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

/*/open/58ad6a61a5fc63de314327cc027766c5***/
/*!*************************************************************!*\
  !*** Template: view/aaa.php:3 ***!
  !*** Create:   2020-04-25T08:39:07.510Z ***!
  !*** Modified: 2020-04-25T08:39:08.830Z ***!
  \*************************************************************/
CrossTplCore.templates.set('58ad6a61a5fc63de314327cc027766c5', /**58ad6a61a5fc63de314327cc027766c5**/`PCEtLS9vcGVuLyB2aWV3L2FhYS5waHAgLy0tPgo8IS0tIHZlcnNpb246IDE1ODc4MDM5NDg4MzAgLS0+CmFkcwo8IS0tL2VuZC8gPCUlZmlsZV9kaXIlJT4gLy0tPg==`/**-58ad6a61a5fc63de314327cc027766c5**/);
/*/close/58ad6a61a5fc63de314327cc027766c5***/
/*/open/6974f857b9dfc12e6001c7602bfdcfbc***/
/*!*************************************************************!*\
  !*** Template: view/errs.php:3 ***!
  !*** Create:   2020-04-25T08:42:24.754Z ***!
  !*** Modified: 2020-04-25T08:42:25.954Z ***!
  \*************************************************************/
CrossTplCore.templates.set('6974f857b9dfc12e6001c7602bfdcfbc', /**6974f857b9dfc12e6001c7602bfdcfbc**/`PCEtLS9vcGVuLyB2aWV3L2VycnMucGhwIC8tLT4KPCEtLSB2ZXJzaW9uOiAxNTg3ODA0MTQ1OTU0IC0tPgpkc2EKPCEtLS9lbmQvIDwlJWZpbGVfZGlyJSU+IC8tLT4=`/**-6974f857b9dfc12e6001c7602bfdcfbc**/);
/*/close/6974f857b9dfc12e6001c7602bfdcfbc***/


/**<%%app_templates%%>**/

/**
 * Cross JS Template
 * 
 * @class CrossJSTemplate 
 * @link usemint.com
 */
export class CrossTemplateClass {
    

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
        CrossTemplateClass.md5 = md5;
    }
}

if(typeof md5 !== 'undefined') {
    CrossTemplateClass.setMD5(md5);
}
