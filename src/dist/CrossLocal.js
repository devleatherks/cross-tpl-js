(function(window, Object, exports) {
    var Md5 = /** @class */ (function () {function Md5() {}Md5.AddUnsigned = function (lX, lY) {var lX4, lY4, lX8, lY8, lResult;lX8 = (lX & 0x80000000);lY8 = (lY & 0x80000000);lX4 = (lX & 0x40000000);lY4 = (lY & 0x40000000);lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);if (!!(lX4 & lY4)) {return (lResult ^ 0x80000000 ^ lX8 ^ lY8);}if (!!(lX4 | lY4)) {if (!!(lResult & 0x40000000)) {return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);}else {return (lResult ^ 0x40000000 ^ lX8 ^ lY8);}}else {return (lResult ^ lX8 ^ lY8);}};Md5.FF = function (a, b, c, d, x, s, ac) {a = this.AddUnsigned(a, this.AddUnsigned(this.AddUnsigned(this.F(b, c, d), x), ac));return this.AddUnsigned(this.RotateLeft(a, s), b);};Md5.GG = function (a, b, c, d, x, s, ac) {a = this.AddUnsigned(a, this.AddUnsigned(this.AddUnsigned(this.G(b, c, d), x), ac));return this.AddUnsigned(this.RotateLeft(a, s), b);};Md5.HH = function (a, b, c, d, x, s, ac) {a = this.AddUnsigned(a, this.AddUnsigned(this.AddUnsigned(this.H(b, c, d), x), ac));return this.AddUnsigned(this.RotateLeft(a, s), b);};Md5.II = function (a, b, c, d, x, s, ac) {a = this.AddUnsigned(a, this.AddUnsigned(this.AddUnsigned(this.I(b, c, d), x), ac));return this.AddUnsigned(this.RotateLeft(a, s), b);};Md5.ConvertToWordArray = function (string) {var lWordCount, lMessageLength = string.length, lNumberOfWords_temp1 = lMessageLength + 8, lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64, lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16, lWordArray = Array(lNumberOfWords - 1), lBytePosition = 0, lByteCount = 0;while (lByteCount < lMessageLength) {lWordCount = (lByteCount - (lByteCount % 4)) / 4;lBytePosition = (lByteCount % 4) * 8;lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));lByteCount++;}lWordCount = (lByteCount - (lByteCount % 4)) / 4;lBytePosition = (lByteCount % 4) * 8;lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);lWordArray[lNumberOfWords - 2] = lMessageLength << 3;lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;return lWordArray;};Md5.WordToHex = function (lValue) {var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;for (lCount = 0; lCount <= 3; lCount++) {lByte = (lValue >>> (lCount * 8)) & 255;WordToHexValue_temp = "0" + lByte.toString(16);WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);}return WordToHexValue;};Md5.Utf8Encode = function (string) {var utftext = "", c;string = string.replace(/\r\n/g, "\n");for (var n = 0; n < string.length; n++) {c = string.charCodeAt(n);if (c < 128) {utftext += String.fromCharCode(c);}else if ((c > 127) && (c < 2048)) {utftext += String.fromCharCode((c >> 6) | 192);utftext += String.fromCharCode((c & 63) | 128);}else {utftext += String.fromCharCode((c >> 12) | 224);utftext += String.fromCharCode(((c >> 6) & 63) | 128);utftext += String.fromCharCode((c & 63) | 128);}}return utftext;};Md5.init = function (string) {var temp;if (typeof string !== 'string')string = JSON.stringify(string);this._string = this.Utf8Encode(string);this.x = this.ConvertToWordArray(this._string);this.a = 0x67452301;this.b = 0xEFCDAB89;this.c = 0x98BADCFE;this.d = 0x10325476;for (this.k = 0; this.k < this.x.length; this.k += 16) {this.AA = this.a;this.BB = this.b;this.CC = this.c;this.DD = this.d;this.a = this.FF(this.a, this.b, this.c, this.d, this.x[this.k], this.S11, 0xD76AA478);this.d = this.FF(this.d, this.a, this.b, this.c, this.x[this.k + 1], this.S12, 0xE8C7B756);this.c = this.FF(this.c, this.d, this.a, this.b, this.x[this.k + 2], this.S13, 0x242070DB);this.b = this.FF(this.b, this.c, this.d, this.a, this.x[this.k + 3], this.S14, 0xC1BDCEEE);this.a = this.FF(this.a, this.b, this.c, this.d, this.x[this.k + 4], this.S11, 0xF57C0FAF);this.d = this.FF(this.d, this.a, this.b, this.c, this.x[this.k + 5], this.S12, 0x4787C62A);this.c = this.FF(this.c, this.d, this.a, this.b, this.x[this.k + 6], this.S13, 0xA8304613);this.b = this.FF(this.b, this.c, this.d, this.a, this.x[this.k + 7], this.S14, 0xFD469501);this.a = this.FF(this.a, this.b, this.c, this.d, this.x[this.k + 8], this.S11, 0x698098D8);this.d = this.FF(this.d, this.a, this.b, this.c, this.x[this.k + 9], this.S12, 0x8B44F7AF);this.c = this.FF(this.c, this.d, this.a, this.b, this.x[this.k + 10], this.S13, 0xFFFF5BB1);this.b = this.FF(this.b, this.c, this.d, this.a, this.x[this.k + 11], this.S14, 0x895CD7BE);this.a = this.FF(this.a, this.b, this.c, this.d, this.x[this.k + 12], this.S11, 0x6B901122);this.d = this.FF(this.d, this.a, this.b, this.c, this.x[this.k + 13], this.S12, 0xFD987193);this.c = this.FF(this.c, this.d, this.a, this.b, this.x[this.k + 14], this.S13, 0xA679438E);this.b = this.FF(this.b, this.c, this.d, this.a, this.x[this.k + 15], this.S14, 0x49B40821);this.a = this.GG(this.a, this.b, this.c, this.d, this.x[this.k + 1], this.S21, 0xF61E2562);this.d = this.GG(this.d, this.a, this.b, this.c, this.x[this.k + 6], this.S22, 0xC040B340);this.c = this.GG(this.c, this.d, this.a, this.b, this.x[this.k + 11], this.S23, 0x265E5A51);this.b = this.GG(this.b, this.c, this.d, this.a, this.x[this.k], this.S24, 0xE9B6C7AA);this.a = this.GG(this.a, this.b, this.c, this.d, this.x[this.k + 5], this.S21, 0xD62F105D);this.d = this.GG(this.d, this.a, this.b, this.c, this.x[this.k + 10], this.S22, 0x2441453);this.c = this.GG(this.c, this.d, this.a, this.b, this.x[this.k + 15], this.S23, 0xD8A1E681);this.b = this.GG(this.b, this.c, this.d, this.a, this.x[this.k + 4], this.S24, 0xE7D3FBC8);this.a = this.GG(this.a, this.b, this.c, this.d, this.x[this.k + 9], this.S21, 0x21E1CDE6);this.d = this.GG(this.d, this.a, this.b, this.c, this.x[this.k + 14], this.S22, 0xC33707D6);this.c = this.GG(this.c, this.d, this.a, this.b, this.x[this.k + 3], this.S23, 0xF4D50D87);this.b = this.GG(this.b, this.c, this.d, this.a, this.x[this.k + 8], this.S24, 0x455A14ED);this.a = this.GG(this.a, this.b, this.c, this.d, this.x[this.k + 13], this.S21, 0xA9E3E905);this.d = this.GG(this.d, this.a, this.b, this.c, this.x[this.k + 2], this.S22, 0xFCEFA3F8);this.c = this.GG(this.c, this.d, this.a, this.b, this.x[this.k + 7], this.S23, 0x676F02D9);this.b = this.GG(this.b, this.c, this.d, this.a, this.x[this.k + 12], this.S24, 0x8D2A4C8A);this.a = this.HH(this.a, this.b, this.c, this.d, this.x[this.k + 5], this.S31, 0xFFFA3942);this.d = this.HH(this.d, this.a, this.b, this.c, this.x[this.k + 8], this.S32, 0x8771F681);this.c = this.HH(this.c, this.d, this.a, this.b, this.x[this.k + 11], this.S33, 0x6D9D6122);this.b = this.HH(this.b, this.c, this.d, this.a, this.x[this.k + 14], this.S34, 0xFDE5380C);this.a = this.HH(this.a, this.b, this.c, this.d, this.x[this.k + 1], this.S31, 0xA4BEEA44);this.d = this.HH(this.d, this.a, this.b, this.c, this.x[this.k + 4], this.S32, 0x4BDECFA9);this.c = this.HH(this.c, this.d, this.a, this.b, this.x[this.k + 7], this.S33, 0xF6BB4B60);this.b = this.HH(this.b, this.c, this.d, this.a, this.x[this.k + 10], this.S34, 0xBEBFBC70);this.a = this.HH(this.a, this.b, this.c, this.d, this.x[this.k + 13], this.S31, 0x289B7EC6);this.d = this.HH(this.d, this.a, this.b, this.c, this.x[this.k], this.S32, 0xEAA127FA);this.c = this.HH(this.c, this.d, this.a, this.b, this.x[this.k + 3], this.S33, 0xD4EF3085);this.b = this.HH(this.b, this.c, this.d, this.a, this.x[this.k + 6], this.S34, 0x4881D05);this.a = this.HH(this.a, this.b, this.c, this.d, this.x[this.k + 9], this.S31, 0xD9D4D039);this.d = this.HH(this.d, this.a, this.b, this.c, this.x[this.k + 12], this.S32, 0xE6DB99E5);this.c = this.HH(this.c, this.d, this.a, this.b, this.x[this.k + 15], this.S33, 0x1FA27CF8);this.b = this.HH(this.b, this.c, this.d, this.a, this.x[this.k + 2], this.S34, 0xC4AC5665);this.a = this.II(this.a, this.b, this.c, this.d, this.x[this.k], this.S41, 0xF4292244);this.d = this.II(this.d, this.a, this.b, this.c, this.x[this.k + 7], this.S42, 0x432AFF97);this.c = this.II(this.c, this.d, this.a, this.b, this.x[this.k + 14], this.S43, 0xAB9423A7);this.b = this.II(this.b, this.c, this.d, this.a, this.x[this.k + 5], this.S44, 0xFC93A039);this.a = this.II(this.a, this.b, this.c, this.d, this.x[this.k + 12], this.S41, 0x655B59C3);this.d = this.II(this.d, this.a, this.b, this.c, this.x[this.k + 3], this.S42, 0x8F0CCC92);this.c = this.II(this.c, this.d, this.a, this.b, this.x[this.k + 10], this.S43, 0xFFEFF47D);this.b = this.II(this.b, this.c, this.d, this.a, this.x[this.k + 1], this.S44, 0x85845DD1);this.a = this.II(this.a, this.b, this.c, this.d, this.x[this.k + 8], this.S41, 0x6FA87E4F);this.d = this.II(this.d, this.a, this.b, this.c, this.x[this.k + 15], this.S42, 0xFE2CE6E0);this.c = this.II(this.c, this.d, this.a, this.b, this.x[this.k + 6], this.S43, 0xA3014314);this.b = this.II(this.b, this.c, this.d, this.a, this.x[this.k + 13], this.S44, 0x4E0811A1);this.a = this.II(this.a, this.b, this.c, this.d, this.x[this.k + 4], this.S41, 0xF7537E82);this.d = this.II(this.d, this.a, this.b, this.c, this.x[this.k + 11], this.S42, 0xBD3AF235);this.c = this.II(this.c, this.d, this.a, this.b, this.x[this.k + 2], this.S43, 0x2AD7D2BB);this.b = this.II(this.b, this.c, this.d, this.a, this.x[this.k + 9], this.S44, 0xEB86D391);this.a = this.AddUnsigned(this.a, this.AA);this.b = this.AddUnsigned(this.b, this.BB);this.c = this.AddUnsigned(this.c, this.CC);this.d = this.AddUnsigned(this.d, this.DD);}temp = this.WordToHex(this.a) + this.WordToHex(this.b) + this.WordToHex(this.c) + this.WordToHex(this.d);return temp.toLowerCase();};Md5.x = Array();Md5.S11 = 7;Md5.S12 = 12;Md5.S13 = 17;Md5.S14 = 22;Md5.S21 = 5;Md5.S22 = 9;Md5.S23 = 14;Md5.S24 = 20;Md5.S31 = 4;Md5.S32 = 11;Md5.S33 = 16;Md5.S34 = 23;Md5.S41 = 6;Md5.S42 = 10;Md5.S43 = 15;Md5.S44 = 21;Md5.RotateLeft = function (lValue, iShiftBits) { return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits)); };Md5.F = function (x, y, z) { return (x & y) | ((~x) & z); };Md5.G = function (x, y, z) { return (x & z) | (y & (~z)); };Md5.H = function (x, y, z) { return (x ^ y ^ z); };Md5.I = function (x, y, z) { return (y ^ (x | (~z))); };return Md5;
}());

//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CrossTplCore = /** @class */ (function () {
    function CrossTplCore() {
    }
    /**
     * Determines if a variable is an array
     *
     * @param variable
     *
     * @returns {boolean}
     */
    CrossTplCore.isArray = function (variable) {
        return Array.isArray(variable);
    };
    /**
     * Get an item from an array using "dot" notation.
     *
     * @param {array}                   object
     * @param {string|Array<string>}    path
     * @param {any}                     def
     *
     * @return {any}
     */
    CrossTplCore.get = function (object, path, def) {
        if (def === void 0) { def = void 0; }
        path = CrossTplCore.isArray(path) ? path : path.split('.');
        var result = path.reduce(function (previousValue, currentValue) {
            return previousValue && previousValue[currentValue];
        }, object);
        return result !== undefined ? result : def;
    };
    CrossTplCore.set = function (langCode, hash, content) {
        if (CrossTplCore.lang[langCode] === void 0) {
            CrossTplCore.lang[langCode] = new Map();
        }
        CrossTplCore.lang[langCode].set(hash, content);
    };
    CrossTplCore.lang = {};
    CrossTplCore.code = '_';
    CrossTplCore.options = {
        contentBase64: true,
        dirHash: true
    };
    return CrossTplCore;
}());
/*/open/a5d0ae9e7c86aa216cdf3d4b1b0e735d***/
/*!*************************************************************!*\
  !*** Name: login ***!
  !*** Lang: en ***!
  !*** Translation: en/login.php:744 ***!
  !*** Create:   2020-04-28T19:03:17.510Z ***!
  !*** Modified: 2020-05-02T15:06:03.960Z ***!
  \*************************************************************/
CrossTplCore.set('9cfefed8fb9497baa5cd519d7d2bb5d7', 'a5d0ae9e7c86aa216cdf3d4b1b0e735d', /**a5d0ae9e7c86aa216cdf3d4b1b0e735d**/ "eyJyZXNldCI6IllvdXIgcGFzc3dvcmQgaGFzIGJlZW4gcmVzZXQhIiwic2VudCI6IldlIGhhdmUgZW1haWxlZCB5b3VyIHBhc3N3b3JkIHJlc2V0IGxpbmshIiwidGhyb3R0bGVkIjoiUGxlYXNlIHdhaXQgYmVmb3JlIHJldHJ5aW5nLiIsInRva2VuIjoiVGhpcyBwYXNzd29yZCByZXNldCB0b2tlbiBpcyBpbnZhbGlkLiIsInVzZXIiOiJXZSBjYW4ndCBmaW5kIGEgdXNlciB3aXRoIHRoYXQgZW1haWwgYWRkcmVzcy4ifQ==" /**-a5d0ae9e7c86aa216cdf3d4b1b0e735d**/);
/*/close/a5d0ae9e7c86aa216cdf3d4b1b0e735d***/
/*/open/d02533f62e82d235c8fe533d05ec1cd2***/
/*!*************************************************************!*\
  !*** Name: login ***!
  !*** Lang: ru ***!
  !*** Translation: ru/login.php:744 ***!
  !*** Create:   2020-04-28T19:03:24.794Z ***!
  !*** Modified: 2020-05-02T09:56:40.644Z ***!
  \*************************************************************/
CrossTplCore.set('89484b14b36a8d5329426a3d944d2983', 'd02533f62e82d235c8fe533d05ec1cd2', /**d02533f62e82d235c8fe533d05ec1cd2**/ "eyJyZXNldCI6IllvdXIgcGFzc3dvcmQgaGFzIGJlZW4gcmVzZXQhIiwic2VudCI6IldlIGhhdmUgZW1haWxlZCB5b3VyIHBhc3N3b3JkIHJlc2V0IGxpbmshIiwidGhyb3R0bGVkIjoiUGxlYXNlIHdhaXQgYmVmb3JlIHJldHJ5aW5nLiIsInRva2VuIjoiVGhpcyBwYXNzd29yZCByZXNldCB0b2tlbiBpcyBpbnZhbGlkLiIsInVzZXIiOiJXZSBjYW4ndCBmaW5kIGEgdXNlciB3aXRoIHRoYXQgZW1haWwgYWRkcmVzcy4ifQ==" /**-d02533f62e82d235c8fe533d05ec1cd2**/);
/*/close/d02533f62e82d235c8fe533d05ec1cd2***/
/**<%%app_templates%%>**/
/**
 * Cross JS Template
 *
 * @class CrossJSTemplate
 * @link usemint.com
 */
var CrossLocale = /** @class */ (function () {
    function CrossLocale(code) {
        CrossTplCore.code = code;
        if (CrossTplCore.options.dirHash) {
            CrossTplCore.code = Md5.init(CrossTplCore.code);
        }
    }
    /**
     * @param {string} path
     * @param {any} def
     */
    CrossLocale.prototype.text = function (path, def) {
        if (def === void 0) { def = void 0; }
        var list = path.split('.');
        if ((list.length === 0 || list.length === 1) || !(CrossTplCore.code in CrossTplCore.lang)) {
            return def || path;
        }
        var file = list[0];
        if (CrossTplCore.options.dirHash) {
            file = Md5.init(CrossTplCore.code + '-' + file);
        }
        var content = CrossTplCore.lang[CrossTplCore.code].get(file) || void 0;
        if (content === void 0) {
            return def || path;
        }
        if (CrossTplCore.options.contentBase64 && content) {
            content = decodeURIComponent(atob(content).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        }
        return CrossTplCore.get(JSON.parse(content), path.replace(list[0] + '.', ''), def) || '';
    };
    CrossLocale.setMD5 = function (md5) {
        CrossLocale.md5 = md5;
    };
    CrossLocale.md5 = void 0;
    return CrossLocale;
}());
exports.CrossLocale = CrossLocale;
if (typeof md5 !== 'undefined') {
    CrossLocale.setMD5(md5);
}

    window.CrossLocale = CrossLocale;
})(window, Object, {});