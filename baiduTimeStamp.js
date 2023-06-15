// ==UserScript==
// @name         百度时间戳处理
// @namespace    https://blog.sxnxcy.com/
// @version      1.0.9
// @description  时间戳
// @author       xiaobao
// @license      CC-BY-4.0
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_getResourceURL
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @match        *://*.baidu.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @require      https://unpkg.com/layui@2.8.6/dist/layui.js

// ==/UserScript==

(function () {
    console.log("脚本注入成功", GM_info.script.version);
    GM_addStyle(`@import url('https://unpkg.com/layui@2.8.6/dist/css/layui.css');
    .chrome-plugin-demo-panel {
        position: fixed;
        right: 0;
        bottom: 10px;
        padding: 10px;
        width: 500px;
        height: 800px;
        margin-right: 30px;
    }
    #pzdv{
        position: fixed;
        right: 0;
        bottom: 30px;
        padding: 40px;
        margin-right: 40px;
    }
    `);
})();
let nbHtml = `
            <div class="layui-field-box">
                <div class="layui-row layui-col-space5">
                    <div class="layui-col-xs6">
                        <input type="text" id="sl" placeholder="输入需要的数量" class="layui-input" value="1">
                    </div>
                    <div class="layui-col-xs6">
                        <input type="text" id="ms" placeholder="增加时间秒数" class="layui-input" value="3600">
                    </div>
                </div>
                <div class="layui-row">
                    <div class="layui-col-xs12">
                        <textarea id="gjc" placeholder="请输入关键词" class="layui-textarea"
                            style="height: 200px;"></textarea>
                    </div>
                </div>
                <div class="layui-row">
                    <div class="layui-col-xs12">
                    <textarea id="wz" placeholder="请输入域名或者链接" class="layui-textarea"
                    style="height: 200px;"></textarea>
                    </div>
                </div>
                <div class="layui-row">
                    <div class="layui-col-xs12">
                        <textarea id="jg" placeholder="" class="layui-textarea"
                            style="height: 200px;"></textarea>
                    </div>
                </div>

                <div class="layui-row">
                <hr>
                    <div class="layui-progress layui-progress-big" lay-showPercent="true" lay-filter="demo-filter-progress">
                        <div id="jdt" class="layui-progress-bar" lay-percent="0%">
                        </div>
                    </div>
                </div>
                <div class="layui-row layui-col-space5">
                    <hr>
                    <select id="sslx" style="margin-right: 10px;">
                        <option value="0" selected>搜关键词</option>
                        <option value="1">搜链接</option>
                    </select>
                    <select id="btlx" style="margin-right: 10px;">
                        <option value="0" selected>PC标题</option>
                        <option value="1">移动标题</option>
                    </select>
                    <button id="saveStart" class="layui-btn layui-btn-primary layui-border-blue">开始</button>
                    <button id="copy" class="layui-btn layui-btn-primary layui-border-green">复制结果</button>
                    <button id="clyzm" class="layui-btn layui-btn-primary layui-border-red">已处理验证码</button>
                    <button id="butTest" class="layui-btn layui-btn-primary layui-border-red">测试</button>
                </div>
            </div>
`;
document.addEventListener('DOMContentLoaded', function () {
    insertPage();
    localStorage.yzm = 1
    $("#pzan").click(function () {
        layer.open({
            type: 1,
            title: "时间戳配置",
            offset: 'auto',
            anim: 'slideLeft', // 从右往左
            area: ['650px', '80%'],
            shade: 0.1,
            shadeClose: true,
            id: 'ID-demo-layer-direction-r',
            content: nbHtml
        });
        configurationButtonEvent()
    });
})
function sendMessage(title, message) {
    GM_notification({
        text: message,
        title: title,
        timeout: 5000, // 通知显示时间，单位为毫秒，默认为 4000 毫秒
        onclick: function () {
        }
    });
}
// 配置按钮事件
function configurationButtonEvent() {
    document.querySelector('#sl').value = localStorage.sl
    document.querySelector('#ms').value = localStorage.ms
    if (localStorage.sl == undefined) {
        document.querySelector('#sl').value = 1
    }
    if (localStorage.ms == undefined) {
        document.querySelector('#ms').value = 3600
    }
    $("#saveStart").click(() => {
        rw($("#gjc").val(), $("#wz").val(), Number($("#ms").val()), Number($("#sl").val()))
    })
    $("#copy").click(() => {
        $("#jg").select()
        document.execCommand('copy');
        $("#jg").blur()
        sendMessage('百度搜索', '已复制到剪贴板');
    })
    $("#clyzm").click(function () {
        localStorage.yzm == 1;
    });
    $("#butTest").click(function () {
        console.log(111);
    });
}

// 进度条更新
function jdtup(bfb) {
    layui.element.progress('demo-filter-progress', bfb + "%")
    document.querySelector("#jdt").innerText = bfb + "%"
}

function initCustomPanel() {
    var panel = document.createElement('div');
    panel.className = 'chrome-plugin-demo-panel';
    panel.innerHTML = `
	<fieldset class="layui-elem-field">
				<legend id="mc">时间戳检测配置</legend>
				<div class="layui-field-box">
					<div class="layui-row layui-col-space5">
						<div class="layui-col-xs6">
							<input type="text" id="sl" placeholder="输入需要的数量" class="layui-input" value="1">
						</div>
						<div class="layui-col-xs6">
							<input type="text" id="ms" placeholder="增加时间秒数" class="layui-input" value="3600">
						</div>
					</div>
					<div class="layui-row layui-col-space5">
						<div class="layui-col-xs12">
							<textarea id="gjc" placeholder="请输入关键词" class="layui-textarea"
								style="height: 200px;"></textarea>
						</div>
					</div>
					<div class="layui-row layui-col-space5">
						<div class="layui-col-xs12">
						<textarea id="wz" placeholder="请输入域名或者链接" class="layui-textarea"
						style="height: 200px;"></textarea>
						</div>
					</div>
					<div class="layui-row layui-col-space5">
						<button id="saveStart" class="layui-btn layui-btn-primary layui-border-blue">开始</button>
						<button id="copy" class="layui-btn layui-btn-primary layui-border-green">复制结果</button>
						<button id="test" class="layui-btn layui-btn-primary layui-border-red">已处理验证码</button>
					</div>
					<div class="layui-row layui-col-space5">
						<div class="layui-col-xs12">
							<textarea id="jg" placeholder="" class="layui-textarea"
								style="height: 200px;"></textarea>
						</div>
					</div>
					<div class="layui-row layui-col-space5">
						<div id="progress-bar">
							<div id="progress"></div>
							<div id="progress-text"></div>
						</div>
					</div>
				</div>
			</fieldset>
	`;
    document.body.appendChild(panel);
}

function insertPage() {
    var panel = document.createElement('div');
    panel.id = 'pzdv';
    let html = `<button id="pzan" type="button" class="layui-btn layui-btn-primary" lay-on="test-offset-r"></button>`
    panel.innerHTML = html
    document.body.appendChild(panel);
    document.querySelector("#pzan").innerText = "开启配置页面 当前版本:" + GM_info.script.version
}

// 任务处理
async function rw(gjc, wz, zjsj, sl) {
    localStorage.ms = document.querySelector('#ms').value
    localStorage.sl = document.querySelector('#sl').value
    let btlx = document.querySelector("#btlx").value
    let sslx = document.querySelector("#sslx").value
    jdtup(0)
    let arr = [];
    let gjcsz = gjc.trim().split("\n")
    let wzsz = wz.trim().split("\n")
    if (gjcsz.length != wzsz.length) {
        sendMessage("百度搜索", "关键词和网址数量不同")
        return false
    }
    for (let index = 0; index < gjcsz.length; index++) {
        let la = await getApi(gjcsz[index], wzsz[index], zjsj, sl, btlx, sslx)
        arr.push(...la)
        jdtup(Math.floor((index + 1) / gjcsz.length * 100))
        await delayedAction()
    }
    $("#jg").val(arr.join("\n"))
    sendMessage('百度搜索', '任务完成');
}
// 单任务处理
async function getApi(gjc, wz, zjsj, sl, btlx, sslx) {
    let arr = [];
    let sgjc = gjc;
    if (sslx == "1") {
        sgjc = wz
    }
    let url = 'https://www.baidu.com/s?wd=' + sgjc + '&tn=json&rn=50'
    let str = await syncGet(url)
    let dx = JSON.parse(str)
    for (let index = 0; index < dx.feed.entry.length; index++) {
        if (dx.feed.entry[index].hasOwnProperty('url')) {
            if (dx.feed.entry[index] != {} && dx.feed.entry[index].url.indexOf(wz) > -1) {
                let strat = dx.feed.entry[index].time
                let end = strat + zjsj
                let lsbt = dx.feed.entry[index].title
                let url = dx.feed.entry[index].url
                if (await jsonVerify(gjc, strat + ',' + end, wz)) {
                    if (btlx == "1") {
                        lsbt = await mobileTitleFetch(url)
                    }
                    let s1 = gjc + '|' + lsbt + "|" + url + "|" + strat + "," + end
                    arr.push(s1)
                }
            }
        }
        if (arr.length >= sl) {
            break;
        }
    }
    return arr
}
// 延迟
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
// json 验证
async function jsonVerify(gjc, sjc, url) {
    let lj = 'https://www.baidu.com/s?wd=' + gjc + '&tn=json&gpc=stf=' + sjc + '&inputT=' + (Math.floor(Math.random() * (6000 - 2000 + 1)) + 2000)
    let str = await syncGet(lj)
    try {
        let jsdx = JSON.parse(str)
        for (let index = 0; index < jsdx.feed.entry.length; index++) {
            if (jsdx.feed.entry[index].hasOwnProperty('url')) {
                let furl = jsdx.feed.entry[index].url
                if (furl.indexOf(url) > -1 || furl == url) {
                    return true
                }
            }
        }
    } catch (error) {
        console.log("jsonVerify错误:" + error);
        return false
    }

    return false
}

// 移动标题获取
async function mobileTitleFetch(lj) {
    let url = 'https://m.baidu.com/s?word=' + lj
    let str = await syncGet(url)
    let parser = new DOMParser();
    let doc = parser.parseFromString(str, 'text/html');
    let sz = doc.querySelectorAll(".c-result.result");
    for (let index = 0; index < sz.length; index++) {
        let j = sz[index].getAttribute("data-log")
        if (j && sz[index].querySelector("h3")) {
            j = JSON.parse(j)
            let mu = j.mu;
            let lsbt = sz[index].querySelector("h3").innerText;
            console.log(mu, lsbt);
            if (mu == lj) {
                return lsbt;
            }
        }
    }
    return false
}
//延迟执行
async function delayedAction(s) {
    if (s == null | s == undefined) {
        s = 1000
    }
    await sleep(s);
}


async function syncGet(url) {
    let xhr = null
    while (true) {
        if (localStorage.yzm == "1") {
            xhr = await fetch(url)
        }
        if (xhr && xhr.redirected === true) {
            localStorage.yzm = "0"
            sendMessage("百度搜索", "请手动处理验证码")
            window.open(xhr.url)
        } else { //ok
            return await xhr.text()
        }
        if (localStorage.yzm == "0") {
            await delayedAction(1000 * 60)
            console.log("等待验证码处理中...");
        }
    }
}