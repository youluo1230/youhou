// ==UserScript==
// @name         百度系网站去广告
// @namespace    http://tampermonkey.net/
// @version      5.4.4
// @icon         https://www.baidu.com/favicon.ico
// @description  去除百度搜索结果和页面中的绝大多数广告，包括：百度搜索、百度百科、百度知道、百度文库、百度贴吧等
// @author       CodeLumos
// @homepageURL  https://github.com/codelumos/tampermonkey-scripts
// @match        *://*.baidu.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// ==/UserScript==
document.addEventListener('DOMContentLoaded', function () {
    setInterval(() => {
        $(".ec_wise_ad").remove()
        $("#page-copyright").remove()
        let sz = document.querySelectorAll("body>div")
        sz.forEach(a => {
            if (a.style.length > 10) {
                if (a.style[0] == "position"
                    && a.style[1] == "bottom"
                    && a.style[2] == "left"
                    && a.style[3] == "z-index"
                    && a.style[4] == "width"
                    && a.style[5] == "height"
                    && a.style[12] == "background-attachment"
                    && a.style[20] == "display") {
                    a.remove()
                }
            }
        })
    }, 5000);
})


