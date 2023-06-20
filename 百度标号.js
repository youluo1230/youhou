// ==UserScript==
// @name         百度标号
// @namespace    http://blog.sxnxcy.com/
// @version      1.0.1
// @icon         https://www.baidu.com/favicon.ico
// @description  结果标号
// @author       xiaobao
// @license      CC-BY-4.0
// @run-at       document-start
// @match        *://www.baidu.com/s*

// ==/UserScript==

document.addEventListener('DOMContentLoaded', function () {
    t()
})
function t() {
    debugger
    if (document.querySelector('[srcid="28608"]') != null) {
        document.querySelector('[srcid="28608"]').remove();
    }
    let e = document.querySelectorAll("#content_left>[srcid]");
    for (var r = 0; r < e.length; r++) {
        var ss = "<span style='font-size:24px;margin-right: 5px;'>" + (r + 1) + "</span>"
        e[r].querySelector("a").innerHTML = ss + e[r].querySelector("a").innerHTML
    }
}