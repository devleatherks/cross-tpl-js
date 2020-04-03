/**
 * Cross JS Template
 * 
 * @class CrossJSTemplate 
 * @link usemint.com
 */
class CrossTemplateClass {
    #templates = new Map();
    #options = {
        contentBase64: true,
        dirHash: true
    }

    #md5 = void 0;

    constructor() {
        /*!*************************************************************!*\
  !*** Template: /var/www/cross-tpl/example/view/common/header.php:340 ***!
  !*** Create:   2020-03-12T12:16:00.092Z ***!
  !*** Modified: 2020-04-02T18:18:43.680Z ***!
  \*************************************************************/
this.#templates.set('66456aa6b8c31da65a17daf250e26fdd', `PCEtLS9vcGVuLyAvdmFyL3d3dy9jcm9zcy10cGwvZXhhbXBsZS92aWV3L2NvbW1vbi9oZWFkZXIucGhwIC8tLT4KPCEtLSB2ZXJzaW9uOiAxNTg1ODUxNTIzNjgwIC0tPgo8dWwgY2xhc3M9Im5hdiI+CiAgPGxpIGNsYXNzPSJuYXYtaXRlbSI+CiAgICA8YSBjbGFzcz0ibmF2LWxpbmsgYWN0aXZlIiBocmVmPSIjIj5BY3RpdmU8L2E+CiAgPC9saT4KICA8bGkgY2xhc3M9Im5hdi1pdGVtIj4KICAgIDxhIGNsYXNzPSJuYXYtbGluayIgaHJlZj0iIyI+TGluazwvYT4KICA8L2xpPgogIDxsaSBjbGFzcz0ibmF2LWl0ZW0iPgogICAgPGEgY2xhc3M9Im5hdi1saW5rIiBocmVmPSIjIj5MaW5rPC9hPgogIDwvbGk+CiAgPGxpIGNsYXNzPSJuYXYtaXRlbSI+CiAgICA8YSBjbGFzcz0ibmF2LWxpbmsgZGlzYWJsZWQiIGhyZWY9IiMiPkRpc2FibGVkPC9hPgogIDwvbGk+CjwvdWw+CjwhLS0vZW5kLyA8JSVmaWxlX2RpciUlPiAvLS0+`);
/*!*************************************************************!*\
  !*** Template: /var/www/cross-tpl/example/view/index.html:1226 ***!
  !*** Create:   2020-03-12T12:15:52.576Z ***!
  !*** Modified: 2020-04-03T13:25:58.961Z ***!
  \*************************************************************/
this.#templates.set('68382b9aa5b82414a20bf208bb1b0859', `PCEtLS9vcGVuLyAvdmFyL3d3dy9jcm9zcy10cGwvZXhhbXBsZS92aWV3L2NvbW1vbi9oZWFkZXIucGhwIC8tLT4KPCEtLSB2ZXJzaW9uOiAxNTg1ODUxNTIzNjgwIC0tPgo8dWwgY2xhc3M9Im5hdiI+CiAgPGxpIGNsYXNzPSJuYXYtaXRlbSI+CiAgICA8YSBjbGFzcz0ibmF2LWxpbmsgYWN0aXZlIiBocmVmPSIjIj5BY3RpdmU8L2E+CiAgPC9saT4KICA8bGkgY2xhc3M9Im5hdi1pdGVtIj4KICAgIDxhIGNsYXNzPSJuYXYtbGluayIgaHJlZj0iIyI+TGluazwvYT4KICA8L2xpPgogIDxsaSBjbGFzcz0ibmF2LWl0ZW0iPgogICAgPGEgY2xhc3M9Im5hdi1saW5rIiBocmVmPSIjIj5MaW5rPC9hPgogIDwvbGk+CiAgPGxpIGNsYXNzPSJuYXYtaXRlbSI+CiAgICA8YSBjbGFzcz0ibmF2LWxpbmsgZGlzYWJsZWQiIGhyZWY9IiMiPkRpc2FibGVkPC9hPgogIDwvbGk+CjwvdWw+CjwhLS0vZW5kLyAvdmFyL3d3dy9jcm9zcy10cGwvZXhhbXBsZS92aWV3L2luZGV4Lmh0bWwgLy0tPg==`);
/*!*************************************************************!*\
  !*** Template: /var/www/cross-tpl/example/view/main/home.blade.php:15151 ***!
  !*** Create:   2020-03-12T12:15:57.844Z ***!
  !*** Modified: 2020-04-02T18:18:43.680Z ***!
  \*************************************************************/
this.#templates.set('eb68698052763504f55b96b6d89f404c', `PCEtLS9vcGVuLyAvdmFyL3d3dy9jcm9zcy10cGwvZXhhbXBsZS92aWV3L2NvbW1vbi9oZWFkZXIucGhwIC8tLT4KPCEtLSB2ZXJzaW9uOiAxNTg1ODUxNTIzNjgwIC0tPgo8dWwgY2xhc3M9Im5hdiI+CiAgPGxpIGNsYXNzPSJuYXYtaXRlbSI+CiAgICA8YSBjbGFzcz0ibmF2LWxpbmsgYWN0aXZlIiBocmVmPSIjIj5BY3RpdmU8L2E+CiAgPC9saT4KICA8bGkgY2xhc3M9Im5hdi1pdGVtIj4KICAgIDxhIGNsYXNzPSJuYXYtbGluayIgaHJlZj0iIyI+TGluazwvYT4KICA8L2xpPgogIDxsaSBjbGFzcz0ibmF2LWl0ZW0iPgogICAgPGEgY2xhc3M9Im5hdi1saW5rIiBocmVmPSIjIj5MaW5rPC9hPgogIDwvbGk+CiAgPGxpIGNsYXNzPSJuYXYtaXRlbSI+CiAgICA8YSBjbGFzcz0ibmF2LWxpbmsgZGlzYWJsZWQiIGhyZWY9IiMiPkRpc2FibGVkPC9hPgogIDwvbGk+CjwvdWw+CjwhLS0vZW5kLyAvdmFyL3d3dy9jcm9zcy10cGwvZXhhbXBsZS92aWV3L2luZGV4Lmh0bWwgLy0tPg==`);
/*!*************************************************************!*\
  !*** Template: /var/www/cross-tpl/example/view/main/text.php:4 ***!
  !*** Create:   2020-04-03T13:56:36.295Z ***!
  !*** Modified: 2020-04-03T13:56:39.079Z ***!
  \*************************************************************/
this.#templates.set('1fa19149f2641188b20f581c81f186c7', `PCEtLS9vcGVuLyAvdmFyL3d3dy9jcm9zcy10cGwvZXhhbXBsZS92aWV3L2NvbW1vbi9oZWFkZXIucGhwIC8tLT4KPCEtLSB2ZXJzaW9uOiAxNTg1ODUxNTIzNjgwIC0tPgo8dWwgY2xhc3M9Im5hdiI+CiAgPGxpIGNsYXNzPSJuYXYtaXRlbSI+CiAgICA8YSBjbGFzcz0ibmF2LWxpbmsgYWN0aXZlIiBocmVmPSIjIj5BY3RpdmU8L2E+CiAgPC9saT4KICA8bGkgY2xhc3M9Im5hdi1pdGVtIj4KICAgIDxhIGNsYXNzPSJuYXYtbGluayIgaHJlZj0iIyI+TGluazwvYT4KICA8L2xpPgogIDxsaSBjbGFzcz0ibmF2LWl0ZW0iPgogICAgPGEgY2xhc3M9Im5hdi1saW5rIiBocmVmPSIjIj5MaW5rPC9hPgogIDwvbGk+CiAgPGxpIGNsYXNzPSJuYXYtaXRlbSI+CiAgICA8YSBjbGFzcz0ibmF2LWxpbmsgZGlzYWJsZWQiIGhyZWY9IiMiPkRpc2FibGVkPC9hPgogIDwvbGk+CjwvdWw+CjwhLS0vZW5kLyAvdmFyL3d3dy9jcm9zcy10cGwvZXhhbXBsZS92aWV3L2luZGV4Lmh0bWwgLy0tPg==`);

    }

    public async render(name: string, handler: boolean = false) {
        if(this.#options.dirHash) {
            name = Md5.init(name);
        }

        let content = this.#templates.get(name);

        if(this.#options.contentBase64) {
            content = decodeURIComponent(atob(content).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        }

        return content || '';
    } 

    public static setMD5(md5): any {
        this.#md5 = md5;
    }
}

if(md5 !== undefined) {
    CrossTemplateClass.setMD5(md5);
}
