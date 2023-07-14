// ==UserScript==
// @name         Canvas指纹修改
// @namespace    http://blog.sxnxcy.com/
// @version      1.0
// @description  Hook canvas以生成随机或指定的指纹
// @match        http://*/*
// @match        https://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 钩住canvas元素的getContext方法
    var originalGetContext = HTMLCanvasElement.prototype.getContext;

    HTMLCanvasElement.prototype.getContext = function (contextType, contextAttributes) {
        // 检查请求的上下文是否为2d
        if (contextType === '2d') {
            // 生成随机指纹或使用指定的指纹
            var fingerprint = generateFingerprint();

            // 记录指纹或执行任何所需的操作
            console.log('Canvas指纹随机:', fingerprint);
        }

        // 调用原始的getContext方法
        return originalGetContext.apply(this, arguments);
    };

    // 生成随机或指定的指纹的函数
    function generateFingerprint(specifiedFingerprint) {
        if (specifiedFingerprint) {
            return specifiedFingerprint;
        } else {
            // 生成一个随机指纹
            var fingerprint = Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);
            return fingerprint;
        }
    }
})();