// const Steps = require('cli-step')
 
// const totalNumberOfSteps = 4
// const steps = new Steps(totalNumberOfSteps)
 
// const step1 = steps.advance('Linting...', null, 'npm run lint')
 
// step1.start() // start the animation
 
// try {
//  // perform task
 
//  step1.success('Successfully linted', 'white_check_mark')
// } catch (error) {
//   step1.error('Unable to lint', 'x')
// }

const content = 'qqqqqqq/**32213123213**/`PCEtLS9vcGVuLyB2aWV3L2NvbW1vbi9oZWFkZXIucGhwIC8tLT4KPCEtLSB2ZXJzaW9uOiAxNTg3NzI3MDY2NzY5IC0tPgo8dWwgY2xhc3M9Im5hdiI+CiAgPGxpIGNsYXNzPSJuYXYtaXRlbSI+CiAgICA8YSBjbGFzcz0ibmF2LWxpbmsgYWN0aXZlIiBocmVmPSIjIj5BY3RpdmU8L2E+CiAgPC9saT4KICA8bGkgY2xhc3M9Im5hdi1pdGVtIj4KICAgIDxhIGNsYXNzPSJuYXYtbGluayIgaHJlZj0iIyI+TGluazwvYT4KICA8L2xpPgogIDxsaSBjbGFzcz0ibmF2LWl0ZW0iPgogICAgPGEgY2xhc3M9Im5hdi1saW5rIiBocmVmPSIjIj5MaW5rPC9hPgogIDwvbGk+CiAgPGxpIGNsYXNzPSJuYXYtaXRlbSI+CiAgICA8YSBjbGFzcz0ibmF2LWxpbmsgZGlzYWJsZWQiIGhyZWY9IiMiPkRpc2FibGVkPC9hPgogIDwvbGk+CjwvdWw+CjwhLS0vZW5kLyA8JSVmaWxlX2RpciUlPiAvLS0+`/**32213123213**/wwwww';
// const content = 'PCEtLS9vcGVuLyB2aWV3L2NvbW1vbi9oZWFkZXIucGhwIC8tLT4KPCEtLSB2ZXJzaW9uOiAxNTg3NzI3MDY2NzY5IC0tPgo8dWwgY2xhc3M9Im5hdiI+CiAgPGxpIGNsYXNzPSJuYXYtaXRlbSI+CiAgICA8YSBjbGFzcz0ibmF2LWxpbmsgYWN0aXZlIiBocmVmPSIjIj5BY3RpdmU8L2E+CiAgPC9saT4KICA8bGkgY2xhc3M9Im5hdi1pdGVtIj4KICAgIDxhIGNsYXNzPSJuYXYtbGluayIgaHJlZj0iIyI+TGluazwvYT4KICA8L2xpPgogIDxsaSBjbGFzcz0ibmF2LWl0ZW0iPgogICAgPGEgY2xhc3M9Im5hdi1saW5rIiBocmVmPSIjIj5MaW5rPC9hPgogIDwvbGk+CiAgPGxpIGNsYXNzPSJuYXYtaXRlbSI+CiAgICA8YSBjbGFzcz0ibmF2LWxpbmsgZGlzYWJsZWQiIGhyZWY9IiMiPkRpc2FibGVkPC9hPgogIDwvbGk+CjwvdWw+CjwhLS0vZW5kLyA8JSVmaWxlX2RpciUlPiAvLS0+`';

// let rex = new RegExp(`*`, "g","i");
var str = 'Twas the night before Xmas...';
let res = content.replace(new RegExp('\\/\\*\\*32213123213\\*\\*\\/', 'g'), '55');
// let res = content.replace(new RegExp("\\/\\*\\*32213123213\\*\\*.*\\/\\*\\*-32213123213\\*\\*\\/", "gm"), '55');
console.log(res);
// console.log(content.replace('/^[-A-Za-z0-9+=]{1,50}|=[^=]|={3,}$/', 55));