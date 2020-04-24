(function(window) {
    var Md5 = /** @class */ (function () {
    function Md5() {
    }
    Md5.AddUnsigned = function (lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (!!(lX4 & lY4)) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (!!(lX4 | lY4)) {
            if (!!(lResult & 0x40000000)) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            }
            else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        }
        else {
            return (lResult ^ lX8 ^ lY8);
        }
    };
    Md5.FF = function (a, b, c, d, x, s, ac) {
        a = this.AddUnsigned(a, this.AddUnsigned(this.AddUnsigned(this.F(b, c, d), x), ac));
        return this.AddUnsigned(this.RotateLeft(a, s), b);
    };
    Md5.GG = function (a, b, c, d, x, s, ac) {
        a = this.AddUnsigned(a, this.AddUnsigned(this.AddUnsigned(this.G(b, c, d), x), ac));
        return this.AddUnsigned(this.RotateLeft(a, s), b);
    };
    Md5.HH = function (a, b, c, d, x, s, ac) {
        a = this.AddUnsigned(a, this.AddUnsigned(this.AddUnsigned(this.H(b, c, d), x), ac));
        return this.AddUnsigned(this.RotateLeft(a, s), b);
    };
    Md5.II = function (a, b, c, d, x, s, ac) {
        a = this.AddUnsigned(a, this.AddUnsigned(this.AddUnsigned(this.I(b, c, d), x), ac));
        return this.AddUnsigned(this.RotateLeft(a, s), b);
    };
    Md5.ConvertToWordArray = function (string) {
        var lWordCount, lMessageLength = string.length, lNumberOfWords_temp1 = lMessageLength + 8, lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64, lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16, lWordArray = Array(lNumberOfWords - 1), lBytePosition = 0, lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };
    Md5.WordToHex = function (lValue) {
        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    };
    Md5.Utf8Encode = function (string) {
        var utftext = "", c;
        string = string.replace(/\r\n/g, "\n");
        for (var n = 0; n < string.length; n++) {
            c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    Md5.init = function (string) {
        var temp;
        if (typeof string !== 'string')
            string = JSON.stringify(string);
        this._string = this.Utf8Encode(string);
        this.x = this.ConvertToWordArray(this._string);
        this.a = 0x67452301;
        this.b = 0xEFCDAB89;
        this.c = 0x98BADCFE;
        this.d = 0x10325476;
        for (this.k = 0; this.k < this.x.length; this.k += 16) {
            this.AA = this.a;
            this.BB = this.b;
            this.CC = this.c;
            this.DD = this.d;
            this.a = this.FF(this.a, this.b, this.c, this.d, this.x[this.k], this.S11, 0xD76AA478);
            this.d = this.FF(this.d, this.a, this.b, this.c, this.x[this.k + 1], this.S12, 0xE8C7B756);
            this.c = this.FF(this.c, this.d, this.a, this.b, this.x[this.k + 2], this.S13, 0x242070DB);
            this.b = this.FF(this.b, this.c, this.d, this.a, this.x[this.k + 3], this.S14, 0xC1BDCEEE);
            this.a = this.FF(this.a, this.b, this.c, this.d, this.x[this.k + 4], this.S11, 0xF57C0FAF);
            this.d = this.FF(this.d, this.a, this.b, this.c, this.x[this.k + 5], this.S12, 0x4787C62A);
            this.c = this.FF(this.c, this.d, this.a, this.b, this.x[this.k + 6], this.S13, 0xA8304613);
            this.b = this.FF(this.b, this.c, this.d, this.a, this.x[this.k + 7], this.S14, 0xFD469501);
            this.a = this.FF(this.a, this.b, this.c, this.d, this.x[this.k + 8], this.S11, 0x698098D8);
            this.d = this.FF(this.d, this.a, this.b, this.c, this.x[this.k + 9], this.S12, 0x8B44F7AF);
            this.c = this.FF(this.c, this.d, this.a, this.b, this.x[this.k + 10], this.S13, 0xFFFF5BB1);
            this.b = this.FF(this.b, this.c, this.d, this.a, this.x[this.k + 11], this.S14, 0x895CD7BE);
            this.a = this.FF(this.a, this.b, this.c, this.d, this.x[this.k + 12], this.S11, 0x6B901122);
            this.d = this.FF(this.d, this.a, this.b, this.c, this.x[this.k + 13], this.S12, 0xFD987193);
            this.c = this.FF(this.c, this.d, this.a, this.b, this.x[this.k + 14], this.S13, 0xA679438E);
            this.b = this.FF(this.b, this.c, this.d, this.a, this.x[this.k + 15], this.S14, 0x49B40821);
            this.a = this.GG(this.a, this.b, this.c, this.d, this.x[this.k + 1], this.S21, 0xF61E2562);
            this.d = this.GG(this.d, this.a, this.b, this.c, this.x[this.k + 6], this.S22, 0xC040B340);
            this.c = this.GG(this.c, this.d, this.a, this.b, this.x[this.k + 11], this.S23, 0x265E5A51);
            this.b = this.GG(this.b, this.c, this.d, this.a, this.x[this.k], this.S24, 0xE9B6C7AA);
            this.a = this.GG(this.a, this.b, this.c, this.d, this.x[this.k + 5], this.S21, 0xD62F105D);
            this.d = this.GG(this.d, this.a, this.b, this.c, this.x[this.k + 10], this.S22, 0x2441453);
            this.c = this.GG(this.c, this.d, this.a, this.b, this.x[this.k + 15], this.S23, 0xD8A1E681);
            this.b = this.GG(this.b, this.c, this.d, this.a, this.x[this.k + 4], this.S24, 0xE7D3FBC8);
            this.a = this.GG(this.a, this.b, this.c, this.d, this.x[this.k + 9], this.S21, 0x21E1CDE6);
            this.d = this.GG(this.d, this.a, this.b, this.c, this.x[this.k + 14], this.S22, 0xC33707D6);
            this.c = this.GG(this.c, this.d, this.a, this.b, this.x[this.k + 3], this.S23, 0xF4D50D87);
            this.b = this.GG(this.b, this.c, this.d, this.a, this.x[this.k + 8], this.S24, 0x455A14ED);
            this.a = this.GG(this.a, this.b, this.c, this.d, this.x[this.k + 13], this.S21, 0xA9E3E905);
            this.d = this.GG(this.d, this.a, this.b, this.c, this.x[this.k + 2], this.S22, 0xFCEFA3F8);
            this.c = this.GG(this.c, this.d, this.a, this.b, this.x[this.k + 7], this.S23, 0x676F02D9);
            this.b = this.GG(this.b, this.c, this.d, this.a, this.x[this.k + 12], this.S24, 0x8D2A4C8A);
            this.a = this.HH(this.a, this.b, this.c, this.d, this.x[this.k + 5], this.S31, 0xFFFA3942);
            this.d = this.HH(this.d, this.a, this.b, this.c, this.x[this.k + 8], this.S32, 0x8771F681);
            this.c = this.HH(this.c, this.d, this.a, this.b, this.x[this.k + 11], this.S33, 0x6D9D6122);
            this.b = this.HH(this.b, this.c, this.d, this.a, this.x[this.k + 14], this.S34, 0xFDE5380C);
            this.a = this.HH(this.a, this.b, this.c, this.d, this.x[this.k + 1], this.S31, 0xA4BEEA44);
            this.d = this.HH(this.d, this.a, this.b, this.c, this.x[this.k + 4], this.S32, 0x4BDECFA9);
            this.c = this.HH(this.c, this.d, this.a, this.b, this.x[this.k + 7], this.S33, 0xF6BB4B60);
            this.b = this.HH(this.b, this.c, this.d, this.a, this.x[this.k + 10], this.S34, 0xBEBFBC70);
            this.a = this.HH(this.a, this.b, this.c, this.d, this.x[this.k + 13], this.S31, 0x289B7EC6);
            this.d = this.HH(this.d, this.a, this.b, this.c, this.x[this.k], this.S32, 0xEAA127FA);
            this.c = this.HH(this.c, this.d, this.a, this.b, this.x[this.k + 3], this.S33, 0xD4EF3085);
            this.b = this.HH(this.b, this.c, this.d, this.a, this.x[this.k + 6], this.S34, 0x4881D05);
            this.a = this.HH(this.a, this.b, this.c, this.d, this.x[this.k + 9], this.S31, 0xD9D4D039);
            this.d = this.HH(this.d, this.a, this.b, this.c, this.x[this.k + 12], this.S32, 0xE6DB99E5);
            this.c = this.HH(this.c, this.d, this.a, this.b, this.x[this.k + 15], this.S33, 0x1FA27CF8);
            this.b = this.HH(this.b, this.c, this.d, this.a, this.x[this.k + 2], this.S34, 0xC4AC5665);
            this.a = this.II(this.a, this.b, this.c, this.d, this.x[this.k], this.S41, 0xF4292244);
            this.d = this.II(this.d, this.a, this.b, this.c, this.x[this.k + 7], this.S42, 0x432AFF97);
            this.c = this.II(this.c, this.d, this.a, this.b, this.x[this.k + 14], this.S43, 0xAB9423A7);
            this.b = this.II(this.b, this.c, this.d, this.a, this.x[this.k + 5], this.S44, 0xFC93A039);
            this.a = this.II(this.a, this.b, this.c, this.d, this.x[this.k + 12], this.S41, 0x655B59C3);
            this.d = this.II(this.d, this.a, this.b, this.c, this.x[this.k + 3], this.S42, 0x8F0CCC92);
            this.c = this.II(this.c, this.d, this.a, this.b, this.x[this.k + 10], this.S43, 0xFFEFF47D);
            this.b = this.II(this.b, this.c, this.d, this.a, this.x[this.k + 1], this.S44, 0x85845DD1);
            this.a = this.II(this.a, this.b, this.c, this.d, this.x[this.k + 8], this.S41, 0x6FA87E4F);
            this.d = this.II(this.d, this.a, this.b, this.c, this.x[this.k + 15], this.S42, 0xFE2CE6E0);
            this.c = this.II(this.c, this.d, this.a, this.b, this.x[this.k + 6], this.S43, 0xA3014314);
            this.b = this.II(this.b, this.c, this.d, this.a, this.x[this.k + 13], this.S44, 0x4E0811A1);
            this.a = this.II(this.a, this.b, this.c, this.d, this.x[this.k + 4], this.S41, 0xF7537E82);
            this.d = this.II(this.d, this.a, this.b, this.c, this.x[this.k + 11], this.S42, 0xBD3AF235);
            this.c = this.II(this.c, this.d, this.a, this.b, this.x[this.k + 2], this.S43, 0x2AD7D2BB);
            this.b = this.II(this.b, this.c, this.d, this.a, this.x[this.k + 9], this.S44, 0xEB86D391);
            this.a = this.AddUnsigned(this.a, this.AA);
            this.b = this.AddUnsigned(this.b, this.BB);
            this.c = this.AddUnsigned(this.c, this.CC);
            this.d = this.AddUnsigned(this.d, this.DD);
        }
        temp = this.WordToHex(this.a) + this.WordToHex(this.b) + this.WordToHex(this.c) + this.WordToHex(this.d);
        return temp.toLowerCase();
    };
    Md5.x = Array();
    Md5.S11 = 7;
    Md5.S12 = 12;
    Md5.S13 = 17;
    Md5.S14 = 22;
    Md5.S21 = 5;
    Md5.S22 = 9;
    Md5.S23 = 14;
    Md5.S24 = 20;
    Md5.S31 = 4;
    Md5.S32 = 11;
    Md5.S33 = 16;
    Md5.S34 = 23;
    Md5.S41 = 6;
    Md5.S42 = 10;
    Md5.S43 = 15;
    Md5.S44 = 21;
    Md5.RotateLeft = function (lValue, iShiftBits) { return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits)); };
    Md5.F = function (x, y, z) { return (x & y) | ((~x) & z); };
    Md5.G = function (x, y, z) { return (x & z) | (y & (~z)); };
    Md5.H = function (x, y, z) { return (x ^ y ^ z); };
    Md5.I = function (x, y, z) { return (y ^ (x | (~z))); };
    return Md5;
}());

//# sourceMappingURL=index.js.map
"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _templates, _options;
/**
 * Cross JS Template
 *
 * @class CrossJSTemplate
 * @link usemint.com
 */
class CrossTemplateClass {
    constructor() {
        _templates.set(this, new Map());
        _options.set(this, {
            contentBase64: true,
            dirHash: true
        });
        /*!*************************************************************!*\
  !*** Template: view/common/header.php:2 ***!
  !*** Create:   2020-03-12T12:16:00.092Z ***!
  !*** Modified: 2020-04-24T17:53:53.381Z ***!
  \*************************************************************/
        __classPrivateFieldGet(this, _templates).set('66456aa6b8c31da65a17daf250e26fdd', /**66456aa6b8c31da65a17daf250e26fdd**/`OTk5OTk=`/**-66456aa6b8c31da65a17daf250e26fdd**/);
        /*!*************************************************************!*\
          !*** Template: view/index.html:1226 ***!
          !*** Create:   2020-03-12T12:15:52.576Z ***!
          !*** Modified: 2020-04-24T11:17:46.769Z ***!
          \*************************************************************/
        __classPrivateFieldGet(this, _templates).set('68382b9aa5b82414a20bf208bb1b0859', /**68382b9aa5b82414a20bf208bb1b0859**/`d3d3`/**-68382b9aa5b82414a20bf208bb1b0859**/);
        /*!*************************************************************!*\
          !*** Template: view/main/home.blade.php:15151 ***!
          !*** Create:   2020-03-12T12:15:57.844Z ***!
          !*** Modified: 2020-04-24T11:17:46.769Z ***!
          \*************************************************************/
        __classPrivateFieldGet(this, _templates).set('eb68698052763504f55b96b6d89f404c', /**eb68698052763504f55b96b6d89f404c**/`CjwhZG9jdHlwZSBodG1sPgo8aHRtbCBsYW5nPSJlbiI+CiAgPGhlYWQ+CiAgICA8bWV0YSBjaGFyc2V0PSJ1dGYtOCI+CiAgICA8bWV0YSBuYW1lPSJ2aWV3cG9ydCIgY29udGVudD0id2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEsIHNocmluay10by1maXQ9bm8iPgogICAgPG1ldGEgbmFtZT0iZGVzY3JpcHRpb24iIGNvbnRlbnQ9IiI+CiAgICA8bWV0YSBuYW1lPSJhdXRob3IiIGNvbnRlbnQ9Ik1hcmsgT3R0bywgSmFjb2IgVGhvcm50b24sIGFuZCBCb290c3RyYXAgY29udHJpYnV0b3JzIj4KICAgIDxtZXRhIG5hbWU9ImdlbmVyYXRvciIgY29udGVudD0iSmVreWxsIHYzLjguNiI+CiAgICA8dGl0bGU+QWxidW0gZXhhbXBsZSDCtyBCb290c3RyYXA8L3RpdGxlPgoKICAgIDxsaW5rIHJlbD0iY2Fub25pY2FsIiBocmVmPSJodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy80LjQvZXhhbXBsZXMvYWxidW0vIj4KCiAgICA8IS0tIEJvb3RzdHJhcCBjb3JlIENTUyAtLT4KPGxpbmsgaHJlZj0iL2RvY3MvNC40L2Rpc3QvY3NzL2Jvb3RzdHJhcC5taW4uY3NzIiByZWw9InN0eWxlc2hlZXQiIGludGVncml0eT0ic2hhMzg0LVZrb284eDRDR3NPMytIaHh2OFQvUTVQYVh0a0t0dTZ1ZzVUT2VOVjZnQmlGZVdQR0ZOOU11aE9mMjNROUlmamgiIGNyb3Nzb3JpZ2luPSJhbm9ueW1vdXMiPgoKICAgIDwhLS0gRmF2aWNvbnMgLS0+CjxsaW5rIHJlbD0iYXBwbGUtdG91Y2gtaWNvbiIgaHJlZj0iL2RvY3MvNC40L2Fzc2V0cy9pbWcvZmF2aWNvbnMvYXBwbGUtdG91Y2gtaWNvbi5wbmciIHNpemVzPSIxODB4MTgwIj4KPGxpbmsgcmVsPSJpY29uIiBocmVmPSIvZG9jcy80LjQvYXNzZXRzL2ltZy9mYXZpY29ucy9mYXZpY29uLTMyeDMyLnBuZyIgc2l6ZXM9IjMyeDMyIiB0eXBlPSJpbWFnZS9wbmciPgo8bGluayByZWw9Imljb24iIGhyZWY9Ii9kb2NzLzQuNC9hc3NldHMvaW1nL2Zhdmljb25zL2Zhdmljb24tMTZ4MTYucG5nIiBzaXplcz0iMTZ4MTYiIHR5cGU9ImltYWdlL3BuZyI+CjxsaW5rIHJlbD0ibWFuaWZlc3QiIGhyZWY9Ii9kb2NzLzQuNC9hc3NldHMvaW1nL2Zhdmljb25zL21hbmlmZXN0Lmpzb24iPgo8bGluayByZWw9Im1hc2staWNvbiIgaHJlZj0iL2RvY3MvNC40L2Fzc2V0cy9pbWcvZmF2aWNvbnMvc2FmYXJpLXBpbm5lZC10YWIuc3ZnIiBjb2xvcj0iIzU2M2Q3YyI+CjxsaW5rIHJlbD0iaWNvbiIgaHJlZj0iL2RvY3MvNC40L2Fzc2V0cy9pbWcvZmF2aWNvbnMvZmF2aWNvbi5pY28iPgo8bWV0YSBuYW1lPSJtc2FwcGxpY2F0aW9uLWNvbmZpZyIgY29udGVudD0iL2RvY3MvNC40L2Fzc2V0cy9pbWcvZmF2aWNvbnMvYnJvd3NlcmNvbmZpZy54bWwiPgo8bWV0YSBuYW1lPSJ0aGVtZS1jb2xvciIgY29udGVudD0iIzU2M2Q3YyI+CgoKICAgIDxzdHlsZT4KICAgICAgLmJkLXBsYWNlaG9sZGVyLWltZyB7CiAgICAgICAgZm9udC1zaXplOiAxLjEyNXJlbTsKICAgICAgICB0ZXh0LWFuY2hvcjogbWlkZGxlOwogICAgICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7CiAgICAgICAgLW1vei11c2VyLXNlbGVjdDogbm9uZTsKICAgICAgICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7CiAgICAgICAgdXNlci1zZWxlY3Q6IG5vbmU7CiAgICAgIH0KCiAgICAgIEBtZWRpYSAobWluLXdpZHRoOiA3NjhweCkgewogICAgICAgIC5iZC1wbGFjZWhvbGRlci1pbWctbGcgewogICAgICAgICAgZm9udC1zaXplOiAzLjVyZW07CiAgICAgICAgfQogICAgICB9CiAgICA8L3N0eWxlPgogICAgPCEtLSBDdXN0b20gc3R5bGVzIGZvciB0aGlzIHRlbXBsYXRlIC0tPgogICAgPGxpbmsgaHJlZj0iYWxidW0uY3NzIiByZWw9InN0eWxlc2hlZXQiPgogIDwvaGVhZD4KICA8Ym9keT4KICAgIDxoZWFkZXI+CiAgPGRpdiBjbGFzcz0iY29sbGFwc2UgYmctZGFyayIgaWQ9Im5hdmJhckhlYWRlciI+CiAgICA8ZGl2IGNsYXNzPSJjb250YWluZXIiPgogICAgICA8ZGl2IGNsYXNzPSJyb3ciPgogICAgICAgIDxkaXYgY2xhc3M9ImNvbC1zbS04IGNvbC1tZC03IHB5LTQiPgogICAgICAgICAgPGg0IGNsYXNzPSJ0ZXh0LXdoaXRlIj5BYm91dDwvaDQ+CiAgICAgICAgICA8cCBjbGFzcz0idGV4dC1tdXRlZCI+QWRkIHNvbWUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGFsYnVtIGJlbG93LCB0aGUgYXV0aG9yLCBvciBhbnkgb3RoZXIgYmFja2dyb3VuZCBjb250ZXh0LiBNYWtlIGl0IGEgZmV3IHNlbnRlbmNlcyBsb25nIHNvIGZvbGtzIGNhbiBwaWNrIHVwIHNvbWUgaW5mb3JtYXRpdmUgdGlkYml0cy4gVGhlbiwgbGluayB0aGVtIG9mZiB0byBzb21lIHNvY2lhbCBuZXR3b3JraW5nIHNpdGVzIG9yIGNvbnRhY3QgaW5mb3JtYXRpb24uPC9wPgogICAgICAgIDwvZGl2PgogICAgICAgIDxkaXYgY2xhc3M9ImNvbC1zbS00IG9mZnNldC1tZC0xIHB5LTQiPgogICAgICAgICAgPGg0IGNsYXNzPSJ0ZXh0LXdoaXRlIj5Db250YWN0PC9oND4KICAgICAgICAgIDx1bCBjbGFzcz0ibGlzdC11bnN0eWxlZCI+CiAgICAgICAgICAgIDxsaT48YSBocmVmPSIjIiBjbGFzcz0idGV4dC13aGl0ZSI+Rm9sbG93IG9uIFR3aXR0ZXI8L2E+PC9saT4KICAgICAgICAgICAgPGxpPjxhIGhyZWY9IiMiIGNsYXNzPSJ0ZXh0LXdoaXRlIj5MaWtlIG9uIEZhY2Vib29rPC9hPjwvbGk+CiAgICAgICAgICAgIDxsaT48YSBocmVmPSIjIiBjbGFzcz0idGV4dC13aGl0ZSI+RW1haWwgbWU8L2E+PC9saT4KICAgICAgICAgIDwvdWw+CiAgICAgICAgPC9kaXY+CiAgICAgIDwvZGl2PgogICAgPC9kaXY+CiAgPC9kaXY+CiAgPGRpdiBjbGFzcz0ibmF2YmFyIG5hdmJhci1kYXJrIGJnLWRhcmsgc2hhZG93LXNtIj4KICAgIDxkaXYgY2xhc3M9ImNvbnRhaW5lciBkLWZsZXgganVzdGlmeS1jb250ZW50LWJldHdlZW4iPgogICAgICA8YSBocmVmPSIjIiBjbGFzcz0ibmF2YmFyLWJyYW5kIGQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIiPgogICAgICAgIDxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgYXJpYS1oaWRkZW49InRydWUiIGNsYXNzPSJtci0yIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZvY3VzYWJsZT0iZmFsc2UiPjxwYXRoIGQ9Ik0yMyAxOWEyIDIgMCAwIDEtMiAySDNhMiAyIDAgMCAxLTItMlY4YTIgMiAwIDAgMSAyLTJoNGwyLTNoNmwyIDNoNGEyIDIgMCAwIDEgMiAyeiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTMiIHI9IjQiLz48L3N2Zz4KICAgICAgICA8c3Ryb25nPkFsYnVtPC9zdHJvbmc+CiAgICAgIDwvYT4KICAgICAgPGJ1dHRvbiBjbGFzcz0ibmF2YmFyLXRvZ2dsZXIiIHR5cGU9ImJ1dHRvbiIgZGF0YS10b2dnbGU9ImNvbGxhcHNlIiBkYXRhLXRhcmdldD0iI25hdmJhckhlYWRlciIgYXJpYS1jb250cm9scz0ibmF2YmFySGVhZGVyIiBhcmlhLWV4cGFuZGVkPSJmYWxzZSIgYXJpYS1sYWJlbD0iVG9nZ2xlIG5hdmlnYXRpb24iPgogICAgICAgIDxzcGFuIGNsYXNzPSJuYXZiYXItdG9nZ2xlci1pY29uIj48L3NwYW4+CiAgICAgIDwvYnV0dG9uPgogICAgPC9kaXY+CiAgPC9kaXY+CjwvaGVhZGVyPgoKPG1haW4gcm9sZT0ibWFpbiI+CgogIDxzZWN0aW9uIGNsYXNzPSJqdW1ib3Ryb24gdGV4dC1jZW50ZXIiPgogICAgPGRpdiBjbGFzcz0iY29udGFpbmVyIj4KICAgICAgPGgxPkFsYnVtIGV4YW1wbGU8L2gxPgogICAgICA8cCBjbGFzcz0ibGVhZCB0ZXh0LW11dGVkIj5Tb21ldGhpbmcgc2hvcnQgYW5kIGxlYWRpbmcgYWJvdXQgdGhlIGNvbGxlY3Rpb24gYmVsb3figJRpdHMgY29udGVudHMsIHRoZSBjcmVhdG9yLCBldGMuIE1ha2UgaXQgc2hvcnQgYW5kIHN3ZWV0LCBidXQgbm90IHRvbyBzaG9ydCBzbyBmb2xrcyBkb27igJl0IHNpbXBseSBza2lwIG92ZXIgaXQgZW50aXJlbHkuPC9wPgogICAgICA8cD4KICAgICAgICA8YSBocmVmPSIjIiBjbGFzcz0iYnRuIGJ0bi1wcmltYXJ5IG15LTIiPk1haW4gY2FsbCB0byBhY3Rpb248L2E+CiAgICAgICAgPGEgaHJlZj0iIyIgY2xhc3M9ImJ0biBidG4tc2Vjb25kYXJ5IG15LTIiPlNlY29uZGFyeSBhY3Rpb248L2E+CiAgICAgIDwvcD4KICAgIDwvZGl2PgogIDwvc2VjdGlvbj4KCiAgPGRpdiBjbGFzcz0iYWxidW0gcHktNSBiZy1saWdodCI+CiAgICA8ZGl2IGNsYXNzPSJjb250YWluZXIiPgoKICAgICAgPGRpdiBjbGFzcz0icm93Ij4KICAgICAgICA8ZGl2IGNsYXNzPSJjb2wtbWQtNCI+CiAgICAgICAgICA8ZGl2IGNsYXNzPSJjYXJkIG1iLTQgc2hhZG93LXNtIj4KICAgICAgICAgICAgPHN2ZyBjbGFzcz0iYmQtcGxhY2Vob2xkZXItaW1nIGNhcmQtaW1nLXRvcCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMjI1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIHNsaWNlIiBmb2N1c2FibGU9ImZhbHNlIiByb2xlPSJpbWciIGFyaWEtbGFiZWw9IlBsYWNlaG9sZGVyOiBUaHVtYm5haWwiPjx0aXRsZT5QbGFjZWhvbGRlcjwvdGl0bGU+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzU1NTk1YyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjZWNlZWVmIiBkeT0iLjNlbSI+VGh1bWJuYWlsPC90ZXh0Pjwvc3ZnPgogICAgICAgICAgICA8ZGl2IGNsYXNzPSJjYXJkLWJvZHkiPgogICAgICAgICAgICAgIDxwIGNsYXNzPSJjYXJkLXRleHQiPlRoaXMgaXMgYSB3aWRlciBjYXJkIHdpdGggc3VwcG9ydGluZyB0ZXh0IGJlbG93IGFzIGEgbmF0dXJhbCBsZWFkLWluIHRvIGFkZGl0aW9uYWwgY29udGVudC4gVGhpcyBjb250ZW50IGlzIGEgbGl0dGxlIGJpdCBsb25nZXIuPC9wPgogICAgICAgICAgICAgIDxkaXYgY2xhc3M9ImQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtYmV0d2VlbiBhbGlnbi1pdGVtcy1jZW50ZXIiPgogICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0iYnRuLWdyb3VwIj4KICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSJidXR0b24iIGNsYXNzPSJidG4gYnRuLXNtIGJ0bi1vdXRsaW5lLXNlY29uZGFyeSI+VmlldzwvYnV0dG9uPgogICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9ImJ1dHRvbiIgY2xhc3M9ImJ0biBidG4tc20gYnRuLW91dGxpbmUtc2Vjb25kYXJ5Ij5FZGl0PC9idXR0b24+CiAgICAgICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgICAgIDxzbWFsbCBjbGFzcz0idGV4dC1tdXRlZCI+OSBtaW5zPC9zbWFsbD4KICAgICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICA8L2Rpdj4KICAgICAgICA8L2Rpdj4KICAgICAgICA8ZGl2IGNsYXNzPSJjb2wtbWQtNCI+CiAgICAgICAgICA8ZGl2IGNsYXNzPSJjYXJkIG1iLTQgc2hhZG93LXNtIj4KICAgICAgICAgICAgPHN2ZyBjbGFzcz0iYmQtcGxhY2Vob2xkZXItaW1nIGNhcmQtaW1nLXRvcCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMjI1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIHNsaWNlIiBmb2N1c2FibGU9ImZhbHNlIiByb2xlPSJpbWciIGFyaWEtbGFiZWw9IlBsYWNlaG9sZGVyOiBUaHVtYm5haWwiPjx0aXRsZT5QbGFjZWhvbGRlcjwvdGl0bGU+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzU1NTk1YyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjZWNlZWVmIiBkeT0iLjNlbSI+VGh1bWJuYWlsPC90ZXh0Pjwvc3ZnPgogICAgICAgICAgICA8ZGl2IGNsYXNzPSJjYXJkLWJvZHkiPgogICAgICAgICAgICAgIDxwIGNsYXNzPSJjYXJkLXRleHQiPlRoaXMgaXMgYSB3aWRlciBjYXJkIHdpdGggc3VwcG9ydGluZyB0ZXh0IGJlbG93IGFzIGEgbmF0dXJhbCBsZWFkLWluIHRvIGFkZGl0aW9uYWwgY29udGVudC4gVGhpcyBjb250ZW50IGlzIGEgbGl0dGxlIGJpdCBsb25nZXIuPC9wPgogICAgICAgICAgICAgIDxkaXYgY2xhc3M9ImQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtYmV0d2VlbiBhbGlnbi1pdGVtcy1jZW50ZXIiPgogICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0iYnRuLWdyb3VwIj4KICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSJidXR0b24iIGNsYXNzPSJidG4gYnRuLXNtIGJ0bi1vdXRsaW5lLXNlY29uZGFyeSI+VmlldzwvYnV0dG9uPgogICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9ImJ1dHRvbiIgY2xhc3M9ImJ0biBidG4tc20gYnRuLW91dGxpbmUtc2Vjb25kYXJ5Ij5FZGl0PC9idXR0b24+CiAgICAgICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgICAgIDxzbWFsbCBjbGFzcz0idGV4dC1tdXRlZCI+OSBtaW5zPC9zbWFsbD4KICAgICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICA8L2Rpdj4KICAgICAgICA8L2Rpdj4KICAgICAgICA8ZGl2IGNsYXNzPSJjb2wtbWQtNCI+CiAgICAgICAgICA8ZGl2IGNsYXNzPSJjYXJkIG1iLTQgc2hhZG93LXNtIj4KICAgICAgICAgICAgPHN2ZyBjbGFzcz0iYmQtcGxhY2Vob2xkZXItaW1nIGNhcmQtaW1nLXRvcCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMjI1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIHNsaWNlIiBmb2N1c2FibGU9ImZhbHNlIiByb2xlPSJpbWciIGFyaWEtbGFiZWw9IlBsYWNlaG9sZGVyOiBUaHVtYm5haWwiPjx0aXRsZT5QbGFjZWhvbGRlcjwvdGl0bGU+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzU1NTk1YyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjZWNlZWVmIiBkeT0iLjNlbSI+VGh1bWJuYWlsPC90ZXh0Pjwvc3ZnPgogICAgICAgICAgICA8ZGl2IGNsYXNzPSJjYXJkLWJvZHkiPgogICAgICAgICAgICAgIDxwIGNsYXNzPSJjYXJkLXRleHQiPlRoaXMgaXMgYSB3aWRlciBjYXJkIHdpdGggc3VwcG9ydGluZyB0ZXh0IGJlbG93IGFzIGEgbmF0dXJhbCBsZWFkLWluIHRvIGFkZGl0aW9uYWwgY29udGVudC4gVGhpcyBjb250ZW50IGlzIGEgbGl0dGxlIGJpdCBsb25nZXIuPC9wPgogICAgICAgICAgICAgIDxkaXYgY2xhc3M9ImQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtYmV0d2VlbiBhbGlnbi1pdGVtcy1jZW50ZXIiPgogICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0iYnRuLWdyb3VwIj4KICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSJidXR0b24iIGNsYXNzPSJidG4gYnRuLXNtIGJ0bi1vdXRsaW5lLXNlY29uZGFyeSI+VmlldzwvYnV0dG9uPgogICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9ImJ1dHRvbiIgY2xhc3M9ImJ0biBidG4tc20gYnRuLW91dGxpbmUtc2Vjb25kYXJ5Ij5FZGl0PC9idXR0b24+CiAgICAgICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgICAgIDxzbWFsbCBjbGFzcz0idGV4dC1tdXRlZCI+OSBtaW5zPC9zbWFsbD4KICAgICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICA8L2Rpdj4KICAgICAgICA8L2Rpdj4KCiAgICAgICAgPGRpdiBjbGFzcz0iY29sLW1kLTQiPgogICAgICAgICAgPGRpdiBjbGFzcz0iY2FyZCBtYi00IHNoYWRvdy1zbSI+CiAgICAgICAgICAgIDxzdmcgY2xhc3M9ImJkLXBsYWNlaG9sZGVyLWltZyBjYXJkLWltZy10b3AiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBzbGljZSIgZm9jdXNhYmxlPSJmYWxzZSIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJQbGFjZWhvbGRlcjogVGh1bWJuYWlsIj48dGl0bGU+UGxhY2Vob2xkZXI8L3RpdGxlPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiM1NTU5NWMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iI2VjZWVlZiIgZHk9Ii4zZW0iPlRodW1ibmFpbDwvdGV4dD48L3N2Zz4KICAgICAgICAgICAgPGRpdiBjbGFzcz0iY2FyZC1ib2R5Ij4KICAgICAgICAgICAgICA8cCBjbGFzcz0iY2FyZC10ZXh0Ij5UaGlzIGlzIGEgd2lkZXIgY2FyZCB3aXRoIHN1cHBvcnRpbmcgdGV4dCBiZWxvdyBhcyBhIG5hdHVyYWwgbGVhZC1pbiB0byBhZGRpdGlvbmFsIGNvbnRlbnQuIFRoaXMgY29udGVudCBpcyBhIGxpdHRsZSBiaXQgbG9uZ2VyLjwvcD4KICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSJkLWZsZXgganVzdGlmeS1jb250ZW50LWJldHdlZW4gYWxpZ24taXRlbXMtY2VudGVyIj4KICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9ImJ0bi1ncm91cCI+CiAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0iYnV0dG9uIiBjbGFzcz0iYnRuIGJ0bi1zbSBidG4tb3V0bGluZS1zZWNvbmRhcnkiPlZpZXc8L2J1dHRvbj4KICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSJidXR0b24iIGNsYXNzPSJidG4gYnRuLXNtIGJ0bi1vdXRsaW5lLXNlY29uZGFyeSI+RWRpdDwvYnV0dG9uPgogICAgICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgICAgICA8c21hbGwgY2xhc3M9InRleHQtbXV0ZWQiPjkgbWluczwvc21hbGw+CiAgICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgPC9kaXY+CiAgICAgICAgPC9kaXY+CiAgICAgICAgPGRpdiBjbGFzcz0iY29sLW1kLTQiPgogICAgICAgICAgPGRpdiBjbGFzcz0iY2FyZCBtYi00IHNoYWRvdy1zbSI+CiAgICAgICAgICAgIDxzdmcgY2xhc3M9ImJkLXBsYWNlaG9sZGVyLWltZyBjYXJkLWltZy10b3AiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBzbGljZSIgZm9jdXNhYmxlPSJmYWxzZSIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJQbGFjZWhvbGRlcjogVGh1bWJuYWlsIj48dGl0bGU+UGxhY2Vob2xkZXI8L3RpdGxlPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiM1NTU5NWMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iI2VjZWVlZiIgZHk9Ii4zZW0iPlRodW1ibmFpbDwvdGV4dD48L3N2Zz4KICAgICAgICAgICAgPGRpdiBjbGFzcz0iY2FyZC1ib2R5Ij4KICAgICAgICAgICAgICA8cCBjbGFzcz0iY2FyZC10ZXh0Ij5UaGlzIGlzIGEgd2lkZXIgY2FyZCB3aXRoIHN1cHBvcnRpbmcgdGV4dCBiZWxvdyBhcyBhIG5hdHVyYWwgbGVhZC1pbiB0byBhZGRpdGlvbmFsIGNvbnRlbnQuIFRoaXMgY29udGVudCBpcyBhIGxpdHRsZSBiaXQgbG9uZ2VyLjwvcD4KICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSJkLWZsZXgganVzdGlmeS1jb250ZW50LWJldHdlZW4gYWxpZ24taXRlbXMtY2VudGVyIj4KICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9ImJ0bi1ncm91cCI+CiAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0iYnV0dG9uIiBjbGFzcz0iYnRuIGJ0bi1zbSBidG4tb3V0bGluZS1zZWNvbmRhcnkiPlZpZXc8L2J1dHRvbj4KICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSJidXR0b24iIGNsYXNzPSJidG4gYnRuLXNtIGJ0bi1vdXRsaW5lLXNlY29uZGFyeSI+RWRpdDwvYnV0dG9uPgogICAgICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgICAgICA8c21hbGwgY2xhc3M9InRleHQtbXV0ZWQiPjkgbWluczwvc21hbGw+CiAgICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgPC9kaXY+CiAgICAgICAgPC9kaXY+CiAgICAgICAgPGRpdiBjbGFzcz0iY29sLW1kLTQiPgogICAgICAgICAgPGRpdiBjbGFzcz0iY2FyZCBtYi00IHNoYWRvdy1zbSI+CiAgICAgICAgICAgIDxzdmcgY2xhc3M9ImJkLXBsYWNlaG9sZGVyLWltZyBjYXJkLWltZy10b3AiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBzbGljZSIgZm9jdXNhYmxlPSJmYWxzZSIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJQbGFjZWhvbGRlcjogVGh1bWJuYWlsIj48dGl0bGU+UGxhY2Vob2xkZXI8L3RpdGxlPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiM1NTU5NWMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iI2VjZWVlZiIgZHk9Ii4zZW0iPlRodW1ibmFpbDwvdGV4dD48L3N2Zz4KICAgICAgICAgICAgPGRpdiBjbGFzcz0iY2FyZC1ib2R5Ij4KICAgICAgICAgICAgICA8cCBjbGFzcz0iY2FyZC10ZXh0Ij5UaGlzIGlzIGEgd2lkZXIgY2FyZCB3aXRoIHN1cHBvcnRpbmcgdGV4dCBiZWxvdyBhcyBhIG5hdHVyYWwgbGVhZC1pbiB0byBhZGRpdGlvbmFsIGNvbnRlbnQuIFRoaXMgY29udGVudCBpcyBhIGxpdHRsZSBiaXQgbG9uZ2VyLjwvcD4KICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSJkLWZsZXgganVzdGlmeS1jb250ZW50LWJldHdlZW4gYWxpZ24taXRlbXMtY2VudGVyIj4KICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9ImJ0bi1ncm91cCI+CiAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0iYnV0dG9uIiBjbGFzcz0iYnRuIGJ0bi1zbSBidG4tb3V0bGluZS1zZWNvbmRhcnkiPlZpZXc8L2J1dHRvbj4KICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSJidXR0b24iIGNsYXNzPSJidG4gYnRuLXNtIGJ0bi1vdXRsaW5lLXNlY29uZGFyeSI+RWRpdDwvYnV0dG9uPgogICAgICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgICAgICA8c21hbGwgY2xhc3M9InRleHQtbXV0ZWQiPjkgbWluczwvc21hbGw+CiAgICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgPC9kaXY+CiAgICAgICAgPC9kaXY+CgogICAgICAgIDxkaXYgY2xhc3M9ImNvbC1tZC00Ij4KICAgICAgICAgIDxkaXYgY2xhc3M9ImNhcmQgbWItNCBzaGFkb3ctc20iPgogICAgICAgICAgICA8c3ZnIGNsYXNzPSJiZC1wbGFjZWhvbGRlci1pbWcgY2FyZC1pbWctdG9wIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIyMjUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgc2xpY2UiIGZvY3VzYWJsZT0iZmFsc2UiIHJvbGU9ImltZyIgYXJpYS1sYWJlbD0iUGxhY2Vob2xkZXI6IFRodW1ibmFpbCI+PHRpdGxlPlBsYWNlaG9sZGVyPC90aXRsZT48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNTU1OTVjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiNlY2VlZWYiIGR5PSIuM2VtIj5UaHVtYm5haWw8L3RleHQ+PC9zdmc+CiAgICAgICAgICAgIDxkaXYgY2xhc3M9ImNhcmQtYm9keSI+CiAgICAgICAgICAgICAgPHAgY2xhc3M9ImNhcmQtdGV4dCI+VGhpcyBpcyBhIHdpZGVyIGNhcmQgd2l0aCBzdXBwb3J0aW5nIHRleHQgYmVsb3cgYXMgYSBuYXR1cmFsIGxlYWQtaW4gdG8gYWRkaXRpb25hbCBjb250ZW50LiBUaGlzIGNvbnRlbnQgaXMgYSBsaXR0bGUgYml0IGxvbmdlci48L3A+CiAgICAgICAgICAgICAgPGRpdiBjbGFzcz0iZC1mbGV4IGp1c3RpZnktY29udGVudC1iZXR3ZWVuIGFsaWduLWl0ZW1zLWNlbnRlciI+CiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSJidG4tZ3JvdXAiPgogICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9ImJ1dHRvbiIgY2xhc3M9ImJ0biBidG4tc20gYnRuLW91dGxpbmUtc2Vjb25kYXJ5Ij5WaWV3PC9idXR0b24+CiAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0iYnV0dG9uIiBjbGFzcz0iYnRuIGJ0bi1zbSBidG4tb3V0bGluZS1zZWNvbmRhcnkiPkVkaXQ8L2J1dHRvbj4KICAgICAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgICAgICAgPHNtYWxsIGNsYXNzPSJ0ZXh0LW11dGVkIj45IG1pbnM8L3NtYWxsPgogICAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgIDwvZGl2PgogICAgICAgIDwvZGl2PgogICAgICAgIDxkaXYgY2xhc3M9ImNvbC1tZC00Ij4KICAgICAgICAgIDxkaXYgY2xhc3M9ImNhcmQgbWItNCBzaGFkb3ctc20iPgogICAgICAgICAgICA8c3ZnIGNsYXNzPSJiZC1wbGFjZWhvbGRlci1pbWcgY2FyZC1pbWctdG9wIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIyMjUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgc2xpY2UiIGZvY3VzYWJsZT0iZmFsc2UiIHJvbGU9ImltZyIgYXJpYS1sYWJlbD0iUGxhY2Vob2xkZXI6IFRodW1ibmFpbCI+PHRpdGxlPlBsYWNlaG9sZGVyPC90aXRsZT48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNTU1OTVjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiNlY2VlZWYiIGR5PSIuM2VtIj5UaHVtYm5haWw8L3RleHQ+PC9zdmc+CiAgICAgICAgICAgIDxkaXYgY2xhc3M9ImNhcmQtYm9keSI+CiAgICAgICAgICAgICAgPHAgY2xhc3M9ImNhcmQtdGV4dCI+VGhpcyBpcyBhIHdpZGVyIGNhcmQgd2l0aCBzdXBwb3J0aW5nIHRleHQgYmVsb3cgYXMgYSBuYXR1cmFsIGxlYWQtaW4gdG8gYWRkaXRpb25hbCBjb250ZW50LiBUaGlzIGNvbnRlbnQgaXMgYSBsaXR0bGUgYml0IGxvbmdlci48L3A+CiAgICAgICAgICAgICAgPGRpdiBjbGFzcz0iZC1mbGV4IGp1c3RpZnktY29udGVudC1iZXR3ZWVuIGFsaWduLWl0ZW1zLWNlbnRlciI+CiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSJidG4tZ3JvdXAiPgogICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9ImJ1dHRvbiIgY2xhc3M9ImJ0biBidG4tc20gYnRuLW91dGxpbmUtc2Vjb25kYXJ5Ij5WaWV3PC9idXR0b24+CiAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0iYnV0dG9uIiBjbGFzcz0iYnRuIGJ0bi1zbSBidG4tb3V0bGluZS1zZWNvbmRhcnkiPkVkaXQ8L2J1dHRvbj4KICAgICAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgICAgICAgPHNtYWxsIGNsYXNzPSJ0ZXh0LW11dGVkIj45IG1pbnM8L3NtYWxsPgogICAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgIDwvZGl2PgogICAgICAgIDwvZGl2PgogICAgICAgIDxkaXYgY2xhc3M9ImNvbC1tZC00Ij4KICAgICAgICAgIDxkaXYgY2xhc3M9ImNhcmQgbWItNCBzaGFkb3ctc20iPgogICAgICAgICAgICA8c3ZnIGNsYXNzPSJiZC1wbGFjZWhvbGRlci1pbWcgY2FyZC1pbWctdG9wIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIyMjUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgc2xpY2UiIGZvY3VzYWJsZT0iZmFsc2UiIHJvbGU9ImltZyIgYXJpYS1sYWJlbD0iUGxhY2Vob2xkZXI6IFRodW1ibmFpbCI+PHRpdGxlPlBsYWNlaG9sZGVyPC90aXRsZT48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNTU1OTVjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiNlY2VlZWYiIGR5PSIuM2VtIj5UaHVtYm5haWw8L3RleHQ+PC9zdmc+CiAgICAgICAgICAgIDxkaXYgY2xhc3M9ImNhcmQtYm9keSI+CiAgICAgICAgICAgICAgPHAgY2xhc3M9ImNhcmQtdGV4dCI+VGhpcyBpcyBhIHdpZGVyIGNhcmQgd2l0aCBzdXBwb3J0aW5nIHRleHQgYmVsb3cgYXMgYSBuYXR1cmFsIGxlYWQtaW4gdG8gYWRkaXRpb25hbCBjb250ZW50LiBUaGlzIGNvbnRlbnQgaXMgYSBsaXR0bGUgYml0IGxvbmdlci48L3A+CiAgICAgICAgICAgICAgPGRpdiBjbGFzcz0iZC1mbGV4IGp1c3RpZnktY29udGVudC1iZXR3ZWVuIGFsaWduLWl0ZW1zLWNlbnRlciI+CiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSJidG4tZ3JvdXAiPgogICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9ImJ1dHRvbiIgY2xhc3M9ImJ0biBidG4tc20gYnRuLW91dGxpbmUtc2Vjb25kYXJ5Ij5WaWV3PC9idXR0b24+CiAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0iYnV0dG9uIiBjbGFzcz0iYnRuIGJ0bi1zbSBidG4tb3V0bGluZS1zZWNvbmRhcnkiPkVkaXQ8L2J1dHRvbj4KICAgICAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgICAgICAgPHNtYWxsIGNsYXNzPSJ0ZXh0LW11dGVkIj45IG1pbnM8L3NtYWxsPgogICAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgIDwvZGl2PgogICAgICAgIDwvZGl2PgogICAgICA8L2Rpdj4KICAgIDwvZGl2PgogIDwvZGl2PgoKPC9tYWluPgoKPGZvb3RlciBjbGFzcz0idGV4dC1tdXRlZCI+CiAgPGRpdiBjbGFzcz0iY29udGFpbmVyIj4KICAgIDxwIGNsYXNzPSJmbG9hdC1yaWdodCI+CiAgICAgIDxhIGhyZWY9IiMiPkJhY2sgdG8gdG9wPC9hPgogICAgPC9wPgogICAgPHA+QWxidW0gZXhhbXBsZSBpcyAmY29weTsgQm9vdHN0cmFwLCBidXQgcGxlYXNlIGRvd25sb2FkIGFuZCBjdXN0b21pemUgaXQgZm9yIHlvdXJzZWxmITwvcD4KICAgIDxwPk5ldyB0byBCb290c3RyYXA/IDxhIGhyZWY9Imh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS8iPlZpc2l0IHRoZSBob21lcGFnZTwvYT4gb3IgcmVhZCBvdXIgPGEgaHJlZj0iL2RvY3MvNC40L2dldHRpbmctc3RhcnRlZC9pbnRyb2R1Y3Rpb24vIj5nZXR0aW5nIHN0YXJ0ZWQgZ3VpZGU8L2E+LjwvcD4KICA8L2Rpdj4KPC9mb290ZXI+CjxzY3JpcHQgc3JjPSJodHRwczovL2NvZGUuanF1ZXJ5LmNvbS9qcXVlcnktMy40LjEuc2xpbS5taW4uanMiIGludGVncml0eT0ic2hhMzg0LUo2cWE0ODQ5YmxFMitwb1Q0V255S2h2NXZaRjVTclBvMGlFandCdktVN2ltR0ZBVjB3d2oxeVlmb1JTSm9aK24iIGNyb3Nzb3JpZ2luPSJhbm9ueW1vdXMiPjwvc2NyaXB0PgogICAgICA8c2NyaXB0PndpbmRvdy5qUXVlcnkgfHwgZG9jdW1lbnQud3JpdGUoJzxzY3JpcHQgc3JjPSIvZG9jcy80LjQvYXNzZXRzL2pzL3ZlbmRvci9qcXVlcnkuc2xpbS5taW4uanMiPjxcL3NjcmlwdD4nKTwvc2NyaXB0PjxzY3JpcHQgc3JjPSIvZG9jcy80LjQvZGlzdC9qcy9ib290c3RyYXAuYnVuZGxlLm1pbi5qcyIgaW50ZWdyaXR5PSJzaGEzODQtNmtodU1nOWdhWXI1QXhPcWhrVklPRFZJdm05eW5UVDVKNFYxY2Z0aG1UK2VtQ0c2eVZtRVpzUkhkeGxvdFVubSIgY3Jvc3NvcmlnaW49ImFub255bW91cyI+PC9zY3JpcHQ+PC9ib2R5Pgo8L2h0bWw+Cg==`/**-eb68698052763504f55b96b6d89f404c**/);
        /*!*************************************************************!*\
          !*** Template: view/main/text.php:4 ***!
          !*** Create:   2020-04-03T13:56:36.295Z ***!
          !*** Modified: 2020-04-24T11:17:46.769Z ***!
          \*************************************************************/
        __classPrivateFieldGet(this, _templates).set('1fa19149f2641188b20f581c81f186c7', /**1fa19149f2641188b20f581c81f186c7**/`c2RhZA==`/**-1fa19149f2641188b20f581c81f186c7**/);
    }
    render(name, handler = false) {
        if (__classPrivateFieldGet(this, _options).dirHash) {
            name = Md5.init(name);
        }
        let content = __classPrivateFieldGet(this, _templates).get(name) || '';
        if (__classPrivateFieldGet(this, _options).contentBase64 && content) {
            content = decodeURIComponent(atob(content).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        }
        return content || '';
    }
    static setMD5(md5) {
        CrossTemplateClass.md5 = md5;
    }
}
_templates = new WeakMap(), _options = new WeakMap();
CrossTemplateClass.md5 = void 0;
if (typeof md5 !== 'undefined') {
    CrossTemplateClass.setMD5(md5);
}


    window.crossTpl = new CrossTemplateClass();
})(window);