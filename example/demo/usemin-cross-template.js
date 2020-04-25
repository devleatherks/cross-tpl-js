(function(window, Object, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });
var CrossTplCore = /** @class */ (function () {
    function CrossTplCore() {
    }
    CrossTplCore.templates = new Map();
    CrossTplCore.options = {
        contentBase64: true,
        dirHash: true
    };
    return CrossTplCore;
}());
/**
 * Cross JS Template
 *
 * @class CrossJSTemplate
 * @link usemint.com
 */
var CrossTemplateClass = /** @class */ (function () {
    function CrossTemplateClass() {
        /*!*************************************************************!*\
  !*** Template: view/common/header.php:6 ***!
  !*** Create:   2020-03-12T12:16:00.092Z ***!
  !*** Modified: 2020-04-24T18:08:24.975Z ***!
  \*************************************************************/
        CrossTplCore.templates.set('66456aa6b8c31da65a17daf250e26fdd', /**66456aa6b8c31da65a17daf250e26fdd**/ "PCEtLS9vcGVuLyB2aWV3L2NvbW1vbi9oZWFkZXIucGhwIC8tLT4KPCEtLSB2ZXJzaW9uOiAxNTg3NzUxNzA0OTc1IC0tPgo5OTk5OSAKPCEtLS9lbmQvIDwlJWZpbGVfZGlyJSU+IC8tLT4=" /**-66456aa6b8c31da65a17daf250e26fdd**/);
        /*!*************************************************************!*\
          !*** Template: view/index.html:3 ***!
          !*** Create:   2020-03-12T12:15:52.576Z ***!
          !*** Modified: 2020-04-24T18:42:55.518Z ***!
          \*************************************************************/
        CrossTplCore.templates.set('68382b9aa5b82414a20bf208bb1b0859', /**68382b9aa5b82414a20bf208bb1b0859**/ "PCEtLS9vcGVuLyB2aWV3L2luZGV4Lmh0bWwgLy0tPgo8IS0tIHZlcnNpb246IDE1ODc3NTM3NzU1MTggLS0+Cnd3dwo8IS0tL2VuZC8gPCUlZmlsZV9kaXIlJT4gLy0tPg==" /**-68382b9aa5b82414a20bf208bb1b0859**/);
        /*!*************************************************************!*\
          !*** Template: view/main/home.blade.php:15151 ***!
          !*** Create:   2020-03-12T12:15:57.844Z ***!
          !*** Modified: 2020-04-24T18:08:30.047Z ***!
          \*************************************************************/
        CrossTplCore.templates.set('eb68698052763504f55b96b6d89f404c', /**eb68698052763504f55b96b6d89f404c**/ "PCEtLS9vcGVuLyB2aWV3L21haW4vaG9tZS5ibGFkZS5waHAgLy0tPgo8IS0tIHZlcnNpb246IDE1ODc3NTE3MTAwNDcgLS0+Cgo8IWRvY3R5cGUgaHRtbD4KPGh0bWwgbGFuZz0iZW4iPgogIDxoZWFkPgogICAgPG1ldGEgY2hhcnNldD0idXRmLTgiPgogICAgPG1ldGEgbmFtZT0idmlld3BvcnQiIGNvbnRlbnQ9IndpZHRoPWRldmljZS13aWR0aCwgaW5pdGlhbC1zY2FsZT0xLCBzaHJpbmstdG8tZml0PW5vIj4KICAgIDxtZXRhIG5hbWU9ImRlc2NyaXB0aW9uIiBjb250ZW50PSIiPgogICAgPG1ldGEgbmFtZT0iYXV0aG9yIiBjb250ZW50PSJNYXJrIE90dG8sIEphY29iIFRob3JudG9uLCBhbmQgQm9vdHN0cmFwIGNvbnRyaWJ1dG9ycyI+CiAgICA8bWV0YSBuYW1lPSJnZW5lcmF0b3IiIGNvbnRlbnQ9Ikpla3lsbCB2My44LjYiPgogICAgPHRpdGxlPkFsYnVtIGV4YW1wbGUgwrcgQm9vdHN0cmFwPC90aXRsZT4KCiAgICA8bGluayByZWw9ImNhbm9uaWNhbCIgaHJlZj0iaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvNC40L2V4YW1wbGVzL2FsYnVtLyI+CgogICAgPCEtLSBCb290c3RyYXAgY29yZSBDU1MgLS0+CjxsaW5rIGhyZWY9Ii9kb2NzLzQuNC9kaXN0L2Nzcy9ib290c3RyYXAubWluLmNzcyIgcmVsPSJzdHlsZXNoZWV0IiBpbnRlZ3JpdHk9InNoYTM4NC1Wa29vOHg0Q0dzTzMrSGh4djhUL1E1UGFYdGtLdHU2dWc1VE9lTlY2Z0JpRmVXUEdGTjlNdWhPZjIzUTlJZmpoIiBjcm9zc29yaWdpbj0iYW5vbnltb3VzIj4KCiAgICA8IS0tIEZhdmljb25zIC0tPgo8bGluayByZWw9ImFwcGxlLXRvdWNoLWljb24iIGhyZWY9Ii9kb2NzLzQuNC9hc3NldHMvaW1nL2Zhdmljb25zL2FwcGxlLXRvdWNoLWljb24ucG5nIiBzaXplcz0iMTgweDE4MCI+CjxsaW5rIHJlbD0iaWNvbiIgaHJlZj0iL2RvY3MvNC40L2Fzc2V0cy9pbWcvZmF2aWNvbnMvZmF2aWNvbi0zMngzMi5wbmciIHNpemVzPSIzMngzMiIgdHlwZT0iaW1hZ2UvcG5nIj4KPGxpbmsgcmVsPSJpY29uIiBocmVmPSIvZG9jcy80LjQvYXNzZXRzL2ltZy9mYXZpY29ucy9mYXZpY29uLTE2eDE2LnBuZyIgc2l6ZXM9IjE2eDE2IiB0eXBlPSJpbWFnZS9wbmciPgo8bGluayByZWw9Im1hbmlmZXN0IiBocmVmPSIvZG9jcy80LjQvYXNzZXRzL2ltZy9mYXZpY29ucy9tYW5pZmVzdC5qc29uIj4KPGxpbmsgcmVsPSJtYXNrLWljb24iIGhyZWY9Ii9kb2NzLzQuNC9hc3NldHMvaW1nL2Zhdmljb25zL3NhZmFyaS1waW5uZWQtdGFiLnN2ZyIgY29sb3I9IiM1NjNkN2MiPgo8bGluayByZWw9Imljb24iIGhyZWY9Ii9kb2NzLzQuNC9hc3NldHMvaW1nL2Zhdmljb25zL2Zhdmljb24uaWNvIj4KPG1ldGEgbmFtZT0ibXNhcHBsaWNhdGlvbi1jb25maWciIGNvbnRlbnQ9Ii9kb2NzLzQuNC9hc3NldHMvaW1nL2Zhdmljb25zL2Jyb3dzZXJjb25maWcueG1sIj4KPG1ldGEgbmFtZT0idGhlbWUtY29sb3IiIGNvbnRlbnQ9IiM1NjNkN2MiPgoKCiAgICA8c3R5bGU+CiAgICAgIC5iZC1wbGFjZWhvbGRlci1pbWcgewogICAgICAgIGZvbnQtc2l6ZTogMS4xMjVyZW07CiAgICAgICAgdGV4dC1hbmNob3I6IG1pZGRsZTsKICAgICAgICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lOwogICAgICAgIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7CiAgICAgICAgLW1zLXVzZXItc2VsZWN0OiBub25lOwogICAgICAgIHVzZXItc2VsZWN0OiBub25lOwogICAgICB9CgogICAgICBAbWVkaWEgKG1pbi13aWR0aDogNzY4cHgpIHsKICAgICAgICAuYmQtcGxhY2Vob2xkZXItaW1nLWxnIHsKICAgICAgICAgIGZvbnQtc2l6ZTogMy41cmVtOwogICAgICAgIH0KICAgICAgfQogICAgPC9zdHlsZT4KICAgIDwhLS0gQ3VzdG9tIHN0eWxlcyBmb3IgdGhpcyB0ZW1wbGF0ZSAtLT4KICAgIDxsaW5rIGhyZWY9ImFsYnVtLmNzcyIgcmVsPSJzdHlsZXNoZWV0Ij4KICA8L2hlYWQ+CiAgPGJvZHk+CiAgICA8aGVhZGVyPgogIDxkaXYgY2xhc3M9ImNvbGxhcHNlIGJnLWRhcmsiIGlkPSJuYXZiYXJIZWFkZXIiPgogICAgPGRpdiBjbGFzcz0iY29udGFpbmVyIj4KICAgICAgPGRpdiBjbGFzcz0icm93Ij4KICAgICAgICA8ZGl2IGNsYXNzPSJjb2wtc20tOCBjb2wtbWQtNyBweS00Ij4KICAgICAgICAgIDxoNCBjbGFzcz0idGV4dC13aGl0ZSI+QWJvdXQ8L2g0PgogICAgICAgICAgPHAgY2xhc3M9InRleHQtbXV0ZWQiPkFkZCBzb21lIGluZm9ybWF0aW9uIGFib3V0IHRoZSBhbGJ1bSBiZWxvdywgdGhlIGF1dGhvciwgb3IgYW55IG90aGVyIGJhY2tncm91bmQgY29udGV4dC4gTWFrZSBpdCBhIGZldyBzZW50ZW5jZXMgbG9uZyBzbyBmb2xrcyBjYW4gcGljayB1cCBzb21lIGluZm9ybWF0aXZlIHRpZGJpdHMuIFRoZW4sIGxpbmsgdGhlbSBvZmYgdG8gc29tZSBzb2NpYWwgbmV0d29ya2luZyBzaXRlcyBvciBjb250YWN0IGluZm9ybWF0aW9uLjwvcD4KICAgICAgICA8L2Rpdj4KICAgICAgICA8ZGl2IGNsYXNzPSJjb2wtc20tNCBvZmZzZXQtbWQtMSBweS00Ij4KICAgICAgICAgIDxoNCBjbGFzcz0idGV4dC13aGl0ZSI+Q29udGFjdDwvaDQ+CiAgICAgICAgICA8dWwgY2xhc3M9Imxpc3QtdW5zdHlsZWQiPgogICAgICAgICAgICA8bGk+PGEgaHJlZj0iIyIgY2xhc3M9InRleHQtd2hpdGUiPkZvbGxvdyBvbiBUd2l0dGVyPC9hPjwvbGk+CiAgICAgICAgICAgIDxsaT48YSBocmVmPSIjIiBjbGFzcz0idGV4dC13aGl0ZSI+TGlrZSBvbiBGYWNlYm9vazwvYT48L2xpPgogICAgICAgICAgICA8bGk+PGEgaHJlZj0iIyIgY2xhc3M9InRleHQtd2hpdGUiPkVtYWlsIG1lPC9hPjwvbGk+CiAgICAgICAgICA8L3VsPgogICAgICAgIDwvZGl2PgogICAgICA8L2Rpdj4KICAgIDwvZGl2PgogIDwvZGl2PgogIDxkaXYgY2xhc3M9Im5hdmJhciBuYXZiYXItZGFyayBiZy1kYXJrIHNoYWRvdy1zbSI+CiAgICA8ZGl2IGNsYXNzPSJjb250YWluZXIgZC1mbGV4IGp1c3RpZnktY29udGVudC1iZXR3ZWVuIj4KICAgICAgPGEgaHJlZj0iIyIgY2xhc3M9Im5hdmJhci1icmFuZCBkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyIj4KICAgICAgICA8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiIGFyaWEtaGlkZGVuPSJ0cnVlIiBjbGFzcz0ibXItMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmb2N1c2FibGU9ImZhbHNlIj48cGF0aCBkPSJNMjMgMTlhMiAyIDAgMCAxLTIgMkgzYTIgMiAwIDAgMS0yLTJWOGEyIDIgMCAwIDEgMi0yaDRsMi0zaDZsMiAzaDRhMiAyIDAgMCAxIDIgMnoiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEzIiByPSI0Ii8+PC9zdmc+CiAgICAgICAgPHN0cm9uZz5BbGJ1bTwvc3Ryb25nPgogICAgICA8L2E+CiAgICAgIDxidXR0b24gY2xhc3M9Im5hdmJhci10b2dnbGVyIiB0eXBlPSJidXR0b24iIGRhdGEtdG9nZ2xlPSJjb2xsYXBzZSIgZGF0YS10YXJnZXQ9IiNuYXZiYXJIZWFkZXIiIGFyaWEtY29udHJvbHM9Im5hdmJhckhlYWRlciIgYXJpYS1leHBhbmRlZD0iZmFsc2UiIGFyaWEtbGFiZWw9IlRvZ2dsZSBuYXZpZ2F0aW9uIj4KICAgICAgICA8c3BhbiBjbGFzcz0ibmF2YmFyLXRvZ2dsZXItaWNvbiI+PC9zcGFuPgogICAgICA8L2J1dHRvbj4KICAgIDwvZGl2PgogIDwvZGl2Pgo8L2hlYWRlcj4KCjxtYWluIHJvbGU9Im1haW4iPgoKICA8c2VjdGlvbiBjbGFzcz0ianVtYm90cm9uIHRleHQtY2VudGVyIj4KICAgIDxkaXYgY2xhc3M9ImNvbnRhaW5lciI+CiAgICAgIDxoMT5BbGJ1bSBleGFtcGxlPC9oMT4KICAgICAgPHAgY2xhc3M9ImxlYWQgdGV4dC1tdXRlZCI+U29tZXRoaW5nIHNob3J0IGFuZCBsZWFkaW5nIGFib3V0IHRoZSBjb2xsZWN0aW9uIGJlbG934oCUaXRzIGNvbnRlbnRzLCB0aGUgY3JlYXRvciwgZXRjLiBNYWtlIGl0IHNob3J0IGFuZCBzd2VldCwgYnV0IG5vdCB0b28gc2hvcnQgc28gZm9sa3MgZG9u4oCZdCBzaW1wbHkgc2tpcCBvdmVyIGl0IGVudGlyZWx5LjwvcD4KICAgICAgPHA+CiAgICAgICAgPGEgaHJlZj0iIyIgY2xhc3M9ImJ0biBidG4tcHJpbWFyeSBteS0yIj5NYWluIGNhbGwgdG8gYWN0aW9uPC9hPgogICAgICAgIDxhIGhyZWY9IiMiIGNsYXNzPSJidG4gYnRuLXNlY29uZGFyeSBteS0yIj5TZWNvbmRhcnkgYWN0aW9uPC9hPgogICAgICA8L3A+CiAgICA8L2Rpdj4KICA8L3NlY3Rpb24+CgogIDxkaXYgY2xhc3M9ImFsYnVtIHB5LTUgYmctbGlnaHQiPgogICAgPGRpdiBjbGFzcz0iY29udGFpbmVyIj4KCiAgICAgIDxkaXYgY2xhc3M9InJvdyI+CiAgICAgICAgPGRpdiBjbGFzcz0iY29sLW1kLTQiPgogICAgICAgICAgPGRpdiBjbGFzcz0iY2FyZCBtYi00IHNoYWRvdy1zbSI+CiAgICAgICAgICAgIDxzdmcgY2xhc3M9ImJkLXBsYWNlaG9sZGVyLWltZyBjYXJkLWltZy10b3AiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBzbGljZSIgZm9jdXNhYmxlPSJmYWxzZSIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJQbGFjZWhvbGRlcjogVGh1bWJuYWlsIj48dGl0bGU+UGxhY2Vob2xkZXI8L3RpdGxlPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiM1NTU5NWMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iI2VjZWVlZiIgZHk9Ii4zZW0iPlRodW1ibmFpbDwvdGV4dD48L3N2Zz4KICAgICAgICAgICAgPGRpdiBjbGFzcz0iY2FyZC1ib2R5Ij4KICAgICAgICAgICAgICA8cCBjbGFzcz0iY2FyZC10ZXh0Ij5UaGlzIGlzIGEgd2lkZXIgY2FyZCB3aXRoIHN1cHBvcnRpbmcgdGV4dCBiZWxvdyBhcyBhIG5hdHVyYWwgbGVhZC1pbiB0byBhZGRpdGlvbmFsIGNvbnRlbnQuIFRoaXMgY29udGVudCBpcyBhIGxpdHRsZSBiaXQgbG9uZ2VyLjwvcD4KICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSJkLWZsZXgganVzdGlmeS1jb250ZW50LWJldHdlZW4gYWxpZ24taXRlbXMtY2VudGVyIj4KICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9ImJ0bi1ncm91cCI+CiAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0iYnV0dG9uIiBjbGFzcz0iYnRuIGJ0bi1zbSBidG4tb3V0bGluZS1zZWNvbmRhcnkiPlZpZXc8L2J1dHRvbj4KICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSJidXR0b24iIGNsYXNzPSJidG4gYnRuLXNtIGJ0bi1vdXRsaW5lLXNlY29uZGFyeSI+RWRpdDwvYnV0dG9uPgogICAgICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgICAgICA8c21hbGwgY2xhc3M9InRleHQtbXV0ZWQiPjkgbWluczwvc21hbGw+CiAgICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgPC9kaXY+CiAgICAgICAgPC9kaXY+CiAgICAgICAgPGRpdiBjbGFzcz0iY29sLW1kLTQiPgogICAgICAgICAgPGRpdiBjbGFzcz0iY2FyZCBtYi00IHNoYWRvdy1zbSI+CiAgICAgICAgICAgIDxzdmcgY2xhc3M9ImJkLXBsYWNlaG9sZGVyLWltZyBjYXJkLWltZy10b3AiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBzbGljZSIgZm9jdXNhYmxlPSJmYWxzZSIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJQbGFjZWhvbGRlcjogVGh1bWJuYWlsIj48dGl0bGU+UGxhY2Vob2xkZXI8L3RpdGxlPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiM1NTU5NWMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iI2VjZWVlZiIgZHk9Ii4zZW0iPlRodW1ibmFpbDwvdGV4dD48L3N2Zz4KICAgICAgICAgICAgPGRpdiBjbGFzcz0iY2FyZC1ib2R5Ij4KICAgICAgICAgICAgICA8cCBjbGFzcz0iY2FyZC10ZXh0Ij5UaGlzIGlzIGEgd2lkZXIgY2FyZCB3aXRoIHN1cHBvcnRpbmcgdGV4dCBiZWxvdyBhcyBhIG5hdHVyYWwgbGVhZC1pbiB0byBhZGRpdGlvbmFsIGNvbnRlbnQuIFRoaXMgY29udGVudCBpcyBhIGxpdHRsZSBiaXQgbG9uZ2VyLjwvcD4KICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSJkLWZsZXgganVzdGlmeS1jb250ZW50LWJldHdlZW4gYWxpZ24taXRlbXMtY2VudGVyIj4KICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9ImJ0bi1ncm91cCI+CiAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0iYnV0dG9uIiBjbGFzcz0iYnRuIGJ0bi1zbSBidG4tb3V0bGluZS1zZWNvbmRhcnkiPlZpZXc8L2J1dHRvbj4KICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSJidXR0b24iIGNsYXNzPSJidG4gYnRuLXNtIGJ0bi1vdXRsaW5lLXNlY29uZGFyeSI+RWRpdDwvYnV0dG9uPgogICAgICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgICAgICA8c21hbGwgY2xhc3M9InRleHQtbXV0ZWQiPjkgbWluczwvc21hbGw+CiAgICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgPC9kaXY+CiAgICAgICAgPC9kaXY+CiAgICAgICAgPGRpdiBjbGFzcz0iY29sLW1kLTQiPgogICAgICAgICAgPGRpdiBjbGFzcz0iY2FyZCBtYi00IHNoYWRvdy1zbSI+CiAgICAgICAgICAgIDxzdmcgY2xhc3M9ImJkLXBsYWNlaG9sZGVyLWltZyBjYXJkLWltZy10b3AiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBzbGljZSIgZm9jdXNhYmxlPSJmYWxzZSIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJQbGFjZWhvbGRlcjogVGh1bWJuYWlsIj48dGl0bGU+UGxhY2Vob2xkZXI8L3RpdGxlPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiM1NTU5NWMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iI2VjZWVlZiIgZHk9Ii4zZW0iPlRodW1ibmFpbDwvdGV4dD48L3N2Zz4KICAgICAgICAgICAgPGRpdiBjbGFzcz0iY2FyZC1ib2R5Ij4KICAgICAgICAgICAgICA8cCBjbGFzcz0iY2FyZC10ZXh0Ij5UaGlzIGlzIGEgd2lkZXIgY2FyZCB3aXRoIHN1cHBvcnRpbmcgdGV4dCBiZWxvdyBhcyBhIG5hdHVyYWwgbGVhZC1pbiB0byBhZGRpdGlvbmFsIGNvbnRlbnQuIFRoaXMgY29udGVudCBpcyBhIGxpdHRsZSBiaXQgbG9uZ2VyLjwvcD4KICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSJkLWZsZXgganVzdGlmeS1jb250ZW50LWJldHdlZW4gYWxpZ24taXRlbXMtY2VudGVyIj4KICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9ImJ0bi1ncm91cCI+CiAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0iYnV0dG9uIiBjbGFzcz0iYnRuIGJ0bi1zbSBidG4tb3V0bGluZS1zZWNvbmRhcnkiPlZpZXc8L2J1dHRvbj4KICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSJidXR0b24iIGNsYXNzPSJidG4gYnRuLXNtIGJ0bi1vdXRsaW5lLXNlY29uZGFyeSI+RWRpdDwvYnV0dG9uPgogICAgICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgICAgICA8c21hbGwgY2xhc3M9InRleHQtbXV0ZWQiPjkgbWluczwvc21hbGw+CiAgICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgPC9kaXY+CiAgICAgICAgPC9kaXY+CgogICAgICAgIDxkaXYgY2xhc3M9ImNvbC1tZC00Ij4KICAgICAgICAgIDxkaXYgY2xhc3M9ImNhcmQgbWItNCBzaGFkb3ctc20iPgogICAgICAgICAgICA8c3ZnIGNsYXNzPSJiZC1wbGFjZWhvbGRlci1pbWcgY2FyZC1pbWctdG9wIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIyMjUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgc2xpY2UiIGZvY3VzYWJsZT0iZmFsc2UiIHJvbGU9ImltZyIgYXJpYS1sYWJlbD0iUGxhY2Vob2xkZXI6IFRodW1ibmFpbCI+PHRpdGxlPlBsYWNlaG9sZGVyPC90aXRsZT48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNTU1OTVjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiNlY2VlZWYiIGR5PSIuM2VtIj5UaHVtYm5haWw8L3RleHQ+PC9zdmc+CiAgICAgICAgICAgIDxkaXYgY2xhc3M9ImNhcmQtYm9keSI+CiAgICAgICAgICAgICAgPHAgY2xhc3M9ImNhcmQtdGV4dCI+VGhpcyBpcyBhIHdpZGVyIGNhcmQgd2l0aCBzdXBwb3J0aW5nIHRleHQgYmVsb3cgYXMgYSBuYXR1cmFsIGxlYWQtaW4gdG8gYWRkaXRpb25hbCBjb250ZW50LiBUaGlzIGNvbnRlbnQgaXMgYSBsaXR0bGUgYml0IGxvbmdlci48L3A+CiAgICAgICAgICAgICAgPGRpdiBjbGFzcz0iZC1mbGV4IGp1c3RpZnktY29udGVudC1iZXR3ZWVuIGFsaWduLWl0ZW1zLWNlbnRlciI+CiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSJidG4tZ3JvdXAiPgogICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9ImJ1dHRvbiIgY2xhc3M9ImJ0biBidG4tc20gYnRuLW91dGxpbmUtc2Vjb25kYXJ5Ij5WaWV3PC9idXR0b24+CiAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0iYnV0dG9uIiBjbGFzcz0iYnRuIGJ0bi1zbSBidG4tb3V0bGluZS1zZWNvbmRhcnkiPkVkaXQ8L2J1dHRvbj4KICAgICAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgICAgICAgPHNtYWxsIGNsYXNzPSJ0ZXh0LW11dGVkIj45IG1pbnM8L3NtYWxsPgogICAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgIDwvZGl2PgogICAgICAgIDwvZGl2PgogICAgICAgIDxkaXYgY2xhc3M9ImNvbC1tZC00Ij4KICAgICAgICAgIDxkaXYgY2xhc3M9ImNhcmQgbWItNCBzaGFkb3ctc20iPgogICAgICAgICAgICA8c3ZnIGNsYXNzPSJiZC1wbGFjZWhvbGRlci1pbWcgY2FyZC1pbWctdG9wIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIyMjUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgc2xpY2UiIGZvY3VzYWJsZT0iZmFsc2UiIHJvbGU9ImltZyIgYXJpYS1sYWJlbD0iUGxhY2Vob2xkZXI6IFRodW1ibmFpbCI+PHRpdGxlPlBsYWNlaG9sZGVyPC90aXRsZT48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNTU1OTVjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiNlY2VlZWYiIGR5PSIuM2VtIj5UaHVtYm5haWw8L3RleHQ+PC9zdmc+CiAgICAgICAgICAgIDxkaXYgY2xhc3M9ImNhcmQtYm9keSI+CiAgICAgICAgICAgICAgPHAgY2xhc3M9ImNhcmQtdGV4dCI+VGhpcyBpcyBhIHdpZGVyIGNhcmQgd2l0aCBzdXBwb3J0aW5nIHRleHQgYmVsb3cgYXMgYSBuYXR1cmFsIGxlYWQtaW4gdG8gYWRkaXRpb25hbCBjb250ZW50LiBUaGlzIGNvbnRlbnQgaXMgYSBsaXR0bGUgYml0IGxvbmdlci48L3A+CiAgICAgICAgICAgICAgPGRpdiBjbGFzcz0iZC1mbGV4IGp1c3RpZnktY29udGVudC1iZXR3ZWVuIGFsaWduLWl0ZW1zLWNlbnRlciI+CiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSJidG4tZ3JvdXAiPgogICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9ImJ1dHRvbiIgY2xhc3M9ImJ0biBidG4tc20gYnRuLW91dGxpbmUtc2Vjb25kYXJ5Ij5WaWV3PC9idXR0b24+CiAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0iYnV0dG9uIiBjbGFzcz0iYnRuIGJ0bi1zbSBidG4tb3V0bGluZS1zZWNvbmRhcnkiPkVkaXQ8L2J1dHRvbj4KICAgICAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgICAgICAgPHNtYWxsIGNsYXNzPSJ0ZXh0LW11dGVkIj45IG1pbnM8L3NtYWxsPgogICAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgIDwvZGl2PgogICAgICAgIDwvZGl2PgogICAgICAgIDxkaXYgY2xhc3M9ImNvbC1tZC00Ij4KICAgICAgICAgIDxkaXYgY2xhc3M9ImNhcmQgbWItNCBzaGFkb3ctc20iPgogICAgICAgICAgICA8c3ZnIGNsYXNzPSJiZC1wbGFjZWhvbGRlci1pbWcgY2FyZC1pbWctdG9wIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIyMjUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgc2xpY2UiIGZvY3VzYWJsZT0iZmFsc2UiIHJvbGU9ImltZyIgYXJpYS1sYWJlbD0iUGxhY2Vob2xkZXI6IFRodW1ibmFpbCI+PHRpdGxlPlBsYWNlaG9sZGVyPC90aXRsZT48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNTU1OTVjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiNlY2VlZWYiIGR5PSIuM2VtIj5UaHVtYm5haWw8L3RleHQ+PC9zdmc+CiAgICAgICAgICAgIDxkaXYgY2xhc3M9ImNhcmQtYm9keSI+CiAgICAgICAgICAgICAgPHAgY2xhc3M9ImNhcmQtdGV4dCI+VGhpcyBpcyBhIHdpZGVyIGNhcmQgd2l0aCBzdXBwb3J0aW5nIHRleHQgYmVsb3cgYXMgYSBuYXR1cmFsIGxlYWQtaW4gdG8gYWRkaXRpb25hbCBjb250ZW50LiBUaGlzIGNvbnRlbnQgaXMgYSBsaXR0bGUgYml0IGxvbmdlci48L3A+CiAgICAgICAgICAgICAgPGRpdiBjbGFzcz0iZC1mbGV4IGp1c3RpZnktY29udGVudC1iZXR3ZWVuIGFsaWduLWl0ZW1zLWNlbnRlciI+CiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSJidG4tZ3JvdXAiPgogICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9ImJ1dHRvbiIgY2xhc3M9ImJ0biBidG4tc20gYnRuLW91dGxpbmUtc2Vjb25kYXJ5Ij5WaWV3PC9idXR0b24+CiAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0iYnV0dG9uIiBjbGFzcz0iYnRuIGJ0bi1zbSBidG4tb3V0bGluZS1zZWNvbmRhcnkiPkVkaXQ8L2J1dHRvbj4KICAgICAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgICAgICAgPHNtYWxsIGNsYXNzPSJ0ZXh0LW11dGVkIj45IG1pbnM8L3NtYWxsPgogICAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgIDwvZGl2PgogICAgICAgIDwvZGl2PgoKICAgICAgICA8ZGl2IGNsYXNzPSJjb2wtbWQtNCI+CiAgICAgICAgICA8ZGl2IGNsYXNzPSJjYXJkIG1iLTQgc2hhZG93LXNtIj4KICAgICAgICAgICAgPHN2ZyBjbGFzcz0iYmQtcGxhY2Vob2xkZXItaW1nIGNhcmQtaW1nLXRvcCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMjI1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIHNsaWNlIiBmb2N1c2FibGU9ImZhbHNlIiByb2xlPSJpbWciIGFyaWEtbGFiZWw9IlBsYWNlaG9sZGVyOiBUaHVtYm5haWwiPjx0aXRsZT5QbGFjZWhvbGRlcjwvdGl0bGU+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzU1NTk1YyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjZWNlZWVmIiBkeT0iLjNlbSI+VGh1bWJuYWlsPC90ZXh0Pjwvc3ZnPgogICAgICAgICAgICA8ZGl2IGNsYXNzPSJjYXJkLWJvZHkiPgogICAgICAgICAgICAgIDxwIGNsYXNzPSJjYXJkLXRleHQiPlRoaXMgaXMgYSB3aWRlciBjYXJkIHdpdGggc3VwcG9ydGluZyB0ZXh0IGJlbG93IGFzIGEgbmF0dXJhbCBsZWFkLWluIHRvIGFkZGl0aW9uYWwgY29udGVudC4gVGhpcyBjb250ZW50IGlzIGEgbGl0dGxlIGJpdCBsb25nZXIuPC9wPgogICAgICAgICAgICAgIDxkaXYgY2xhc3M9ImQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtYmV0d2VlbiBhbGlnbi1pdGVtcy1jZW50ZXIiPgogICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0iYnRuLWdyb3VwIj4KICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSJidXR0b24iIGNsYXNzPSJidG4gYnRuLXNtIGJ0bi1vdXRsaW5lLXNlY29uZGFyeSI+VmlldzwvYnV0dG9uPgogICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9ImJ1dHRvbiIgY2xhc3M9ImJ0biBidG4tc20gYnRuLW91dGxpbmUtc2Vjb25kYXJ5Ij5FZGl0PC9idXR0b24+CiAgICAgICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgICAgIDxzbWFsbCBjbGFzcz0idGV4dC1tdXRlZCI+OSBtaW5zPC9zbWFsbD4KICAgICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICA8L2Rpdj4KICAgICAgICA8L2Rpdj4KICAgICAgICA8ZGl2IGNsYXNzPSJjb2wtbWQtNCI+CiAgICAgICAgICA8ZGl2IGNsYXNzPSJjYXJkIG1iLTQgc2hhZG93LXNtIj4KICAgICAgICAgICAgPHN2ZyBjbGFzcz0iYmQtcGxhY2Vob2xkZXItaW1nIGNhcmQtaW1nLXRvcCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMjI1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIHNsaWNlIiBmb2N1c2FibGU9ImZhbHNlIiByb2xlPSJpbWciIGFyaWEtbGFiZWw9IlBsYWNlaG9sZGVyOiBUaHVtYm5haWwiPjx0aXRsZT5QbGFjZWhvbGRlcjwvdGl0bGU+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzU1NTk1YyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjZWNlZWVmIiBkeT0iLjNlbSI+VGh1bWJuYWlsPC90ZXh0Pjwvc3ZnPgogICAgICAgICAgICA8ZGl2IGNsYXNzPSJjYXJkLWJvZHkiPgogICAgICAgICAgICAgIDxwIGNsYXNzPSJjYXJkLXRleHQiPlRoaXMgaXMgYSB3aWRlciBjYXJkIHdpdGggc3VwcG9ydGluZyB0ZXh0IGJlbG93IGFzIGEgbmF0dXJhbCBsZWFkLWluIHRvIGFkZGl0aW9uYWwgY29udGVudC4gVGhpcyBjb250ZW50IGlzIGEgbGl0dGxlIGJpdCBsb25nZXIuPC9wPgogICAgICAgICAgICAgIDxkaXYgY2xhc3M9ImQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtYmV0d2VlbiBhbGlnbi1pdGVtcy1jZW50ZXIiPgogICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0iYnRuLWdyb3VwIj4KICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSJidXR0b24iIGNsYXNzPSJidG4gYnRuLXNtIGJ0bi1vdXRsaW5lLXNlY29uZGFyeSI+VmlldzwvYnV0dG9uPgogICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9ImJ1dHRvbiIgY2xhc3M9ImJ0biBidG4tc20gYnRuLW91dGxpbmUtc2Vjb25kYXJ5Ij5FZGl0PC9idXR0b24+CiAgICAgICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgICAgIDxzbWFsbCBjbGFzcz0idGV4dC1tdXRlZCI+OSBtaW5zPC9zbWFsbD4KICAgICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICA8L2Rpdj4KICAgICAgICA8L2Rpdj4KICAgICAgICA8ZGl2IGNsYXNzPSJjb2wtbWQtNCI+CiAgICAgICAgICA8ZGl2IGNsYXNzPSJjYXJkIG1iLTQgc2hhZG93LXNtIj4KICAgICAgICAgICAgPHN2ZyBjbGFzcz0iYmQtcGxhY2Vob2xkZXItaW1nIGNhcmQtaW1nLXRvcCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMjI1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIHNsaWNlIiBmb2N1c2FibGU9ImZhbHNlIiByb2xlPSJpbWciIGFyaWEtbGFiZWw9IlBsYWNlaG9sZGVyOiBUaHVtYm5haWwiPjx0aXRsZT5QbGFjZWhvbGRlcjwvdGl0bGU+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzU1NTk1YyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjZWNlZWVmIiBkeT0iLjNlbSI+VGh1bWJuYWlsPC90ZXh0Pjwvc3ZnPgogICAgICAgICAgICA8ZGl2IGNsYXNzPSJjYXJkLWJvZHkiPgogICAgICAgICAgICAgIDxwIGNsYXNzPSJjYXJkLXRleHQiPlRoaXMgaXMgYSB3aWRlciBjYXJkIHdpdGggc3VwcG9ydGluZyB0ZXh0IGJlbG93IGFzIGEgbmF0dXJhbCBsZWFkLWluIHRvIGFkZGl0aW9uYWwgY29udGVudC4gVGhpcyBjb250ZW50IGlzIGEgbGl0dGxlIGJpdCBsb25nZXIuPC9wPgogICAgICAgICAgICAgIDxkaXYgY2xhc3M9ImQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtYmV0d2VlbiBhbGlnbi1pdGVtcy1jZW50ZXIiPgogICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0iYnRuLWdyb3VwIj4KICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSJidXR0b24iIGNsYXNzPSJidG4gYnRuLXNtIGJ0bi1vdXRsaW5lLXNlY29uZGFyeSI+VmlldzwvYnV0dG9uPgogICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9ImJ1dHRvbiIgY2xhc3M9ImJ0biBidG4tc20gYnRuLW91dGxpbmUtc2Vjb25kYXJ5Ij5FZGl0PC9idXR0b24+CiAgICAgICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgICAgIDxzbWFsbCBjbGFzcz0idGV4dC1tdXRlZCI+OSBtaW5zPC9zbWFsbD4KICAgICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICA8L2Rpdj4KICAgICAgICA8L2Rpdj4KICAgICAgPC9kaXY+CiAgICA8L2Rpdj4KICA8L2Rpdj4KCjwvbWFpbj4KCjxmb290ZXIgY2xhc3M9InRleHQtbXV0ZWQiPgogIDxkaXYgY2xhc3M9ImNvbnRhaW5lciI+CiAgICA8cCBjbGFzcz0iZmxvYXQtcmlnaHQiPgogICAgICA8YSBocmVmPSIjIj5CYWNrIHRvIHRvcDwvYT4KICAgIDwvcD4KICAgIDxwPkFsYnVtIGV4YW1wbGUgaXMgJmNvcHk7IEJvb3RzdHJhcCwgYnV0IHBsZWFzZSBkb3dubG9hZCBhbmQgY3VzdG9taXplIGl0IGZvciB5b3Vyc2VsZiE8L3A+CiAgICA8cD5OZXcgdG8gQm9vdHN0cmFwPyA8YSBocmVmPSJodHRwczovL2dldGJvb3RzdHJhcC5jb20vIj5WaXNpdCB0aGUgaG9tZXBhZ2U8L2E+IG9yIHJlYWQgb3VyIDxhIGhyZWY9Ii9kb2NzLzQuNC9nZXR0aW5nLXN0YXJ0ZWQvaW50cm9kdWN0aW9uLyI+Z2V0dGluZyBzdGFydGVkIGd1aWRlPC9hPi48L3A+CiAgPC9kaXY+CjwvZm9vdGVyPgo8c2NyaXB0IHNyYz0iaHR0cHM6Ly9jb2RlLmpxdWVyeS5jb20vanF1ZXJ5LTMuNC4xLnNsaW0ubWluLmpzIiBpbnRlZ3JpdHk9InNoYTM4NC1KNnFhNDg0OWJsRTIrcG9UNFdueUtodjV2WkY1U3JQbzBpRWp3QnZLVTdpbUdGQVYwd3dqMXlZZm9SU0pvWituIiBjcm9zc29yaWdpbj0iYW5vbnltb3VzIj48L3NjcmlwdD4KICAgICAgPHNjcmlwdD53aW5kb3cualF1ZXJ5IHx8IGRvY3VtZW50LndyaXRlKCc8c2NyaXB0IHNyYz0iL2RvY3MvNC40L2Fzc2V0cy9qcy92ZW5kb3IvanF1ZXJ5LnNsaW0ubWluLmpzIj48XC9zY3JpcHQ+Jyk8L3NjcmlwdD48c2NyaXB0IHNyYz0iL2RvY3MvNC40L2Rpc3QvanMvYm9vdHN0cmFwLmJ1bmRsZS5taW4uanMiIGludGVncml0eT0ic2hhMzg0LTZraHVNZzlnYVlyNUF4T3Foa1ZJT0RWSXZtOXluVFQ1SjRWMWNmdGhtVCtlbUNHNnlWbUVac1JIZHhsb3RVbm0iIGNyb3Nzb3JpZ2luPSJhbm9ueW1vdXMiPjwvc2NyaXB0PjwvYm9keT4KPC9odG1sPgoKPCEtLS9lbmQvIDwlJWZpbGVfZGlyJSU+IC8tLT4=" /**-eb68698052763504f55b96b6d89f404c**/);
        /*!*************************************************************!*\
          !*** Template: view/main/text.php:4 ***!
          !*** Create:   2020-04-03T13:56:36.295Z ***!
          !*** Modified: 2020-04-24T18:10:10.431Z ***!
          \*************************************************************/
        CrossTplCore.templates.set('1fa19149f2641188b20f581c81f186c7', /**1fa19149f2641188b20f581c81f186c7**/ "PCEtLS9vcGVuLyB2aWV3L21haW4vdGV4dC5waHAgLy0tPgo8IS0tIHZlcnNpb246IDE1ODc3NTE4MTA0MzEgLS0+CnNkYWQKPCEtLS9lbmQvIDwlJWZpbGVfZGlyJSU+IC8tLT4=" /**-1fa19149f2641188b20f581c81f186c7**/);
    }
    CrossTemplateClass.prototype.render = function (name, handler) {
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
    CrossTemplateClass.setMD5 = function (md5) {
        CrossTemplateClass.md5 = md5;
    };
    CrossTemplateClass.md5 = void 0;
    return CrossTemplateClass;
}());
exports.CrossTemplateClass = CrossTemplateClass;
if (typeof md5 !== 'undefined') {
    CrossTemplateClass.setMD5(md5);
}


    window.CrossTemplate = new CrossTemplateClass();
})(window, Object, {});