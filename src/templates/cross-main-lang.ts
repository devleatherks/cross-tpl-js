declare class Md5 {
    static init(name: string): any
}

declare function md5(): () => any;

class CrossTplCore {
    public static lang: any = {};
    public static code = '_';
    public static options = {
        contentBase64: '/** <%%contentBase64%%> */',
        dirHash: '/** <%%dirHash%%> */'
    }

    /**
     * Determines if a variable is an array
     * 
     * @param variable 
     * 
     * @returns {boolean}
     */
    public static isArray(variable: any): variable is Array<any> {
        return Array.isArray(variable);
    }

    /**
     * Get an item from an array using "dot" notation.
     *
     * @param {array}                   object
     * @param {string|Array<string>}    path
     * @param {any}                     def
     * 
     * @return {any}
     */
    public static get(object: any, path: string|Array<string>, def: any = void 0): any {
        path = CrossTplCore.isArray(path) ? path : path.split('.');

        let result = path.reduce((previousValue: any, currentValue: string) => {
            return previousValue && previousValue[currentValue];
        }, object);

        return result !== undefined ? result : def;
    }

    public static set(langCode: string, hash: string, content: string) {
        if(CrossTplCore.lang[langCode] === void 0) {
            CrossTplCore.lang[langCode] = new Map();
        }

        CrossTplCore.lang[langCode].set(hash, content);
    }
}

/*<%%templates%%>*/

/**<%%app_templates%%>**/

/**
 * Cross JS Template
 * 
 * @class CrossJSTemplate 
 * @link usemint.com
 */
export class CrossLocale {
    public static md5 = void 0;

    constructor(code: string) {
        CrossTplCore.code = code;

        if(CrossTplCore.options.dirHash) {
            CrossTplCore.code = Md5.init(CrossTplCore.code);
        }
    }

    /**
     * @param {string} path 
     * @param {any} def 
     */
    public text(path: string, def: any = void 0) {

        const list: Array<string> = path.split('.');

        if((list.length === 0 || list.length === 1) || !(CrossTplCore.code in CrossTplCore.lang)) {
            return def || path;
        }

        let file: string = list[0];

        if(CrossTplCore.options.dirHash) {
            file = Md5.init(CrossTplCore.code + '-' + file);
        }

        let content: string = CrossTplCore.lang[CrossTplCore.code].get(file) || void 0;

        if(content === void 0) {
            return def || path;
        }
        
        if(CrossTplCore.options.contentBase64 && content) {
            content = decodeURIComponent(atob(content).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        }

       
        return CrossTplCore.get(JSON.parse(content), path.replace(list[0] + '.', ''), def) || ''
    } 

    public static setMD5(md5: any): any {
        CrossLocale.md5 = md5;
    }
}

if(typeof md5 !== 'undefined') {
    CrossLocale.setMD5(md5);
}
