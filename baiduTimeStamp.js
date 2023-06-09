// ==UserScript==
// @name         百度时间戳处理
// @namespace    https://sxnxcy.com/
// @version      1.0.6
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
// @require      https://unpkg.com/layui@2.8.6/dist/layui.js
// ==/UserScript==

(function () {
    console.log("脚本注入成功", layui.v);
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
    #progress-bar {
        width: 500px;
        height: 10px;
        background-color: #f0f0f0;
        border-radius: 10px;
        overflow: hidden;
      }
      #progress {
        height: 100%;
        background-color: #007bff;
        width: 0%;
        transition: width 0.3s ease-in-out;
      }
    #progress-text {
        line-height: 20px;
        text-align: center;
        color: #ffffff;
      }
    `);
    test()
})();
function test() {
}
document.addEventListener('DOMContentLoaded', function () {
    initCustomPanel();
    document.querySelector("legend").innerText = "时间戳检测配置 " + GM_info.script.version
    localStorage.yzm = 1
    document.querySelector('#sl').value = localStorage.sl
    if (localStorage.sl == undefined) {
        document.querySelector('#sl').value = 1
    }
    document.querySelector('#ms').value = localStorage.ms
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
    $("#test").click(function () {
        localStorage.yzm == 1;
        console.log(layui);
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
// 任务处理
async function rw(gjc, wz, zjsj, sl) {
    localStorage.ms = document.querySelector('#ms').value
    localStorage.sl = document.querySelector('#sl').value
    updateProgressBar(0)
    let arr = [];
    let gjcsz = gjc.trim().split("\n")
    let wzsz = wz.trim().split("\n")
    if (gjcsz.length != wzsz.length) {
        sendMessage("百度搜索", "关键词和网址数量不同")
        return false
    }
    for (let index = 0; index < gjcsz.length; index++) {
        let la = await getApi(gjcsz[index], wzsz[index], zjsj, sl)
        arr.push(...la)
        updateProgressBar(Math.floor((index + 1) / gjcsz.length * 100))
        await delayedAction()
    }
    $("#jg").val(arr.join("\n"))
    sendMessage('百度搜索', '任务完成');
}
// 单任务处理
async function getApi(gjc, wz, zjsj, sl) {
    let arr = [];
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://www.baidu.com/s?wd=' + gjc + '&tn=json', false);  // 替换为你要发送请求的 URL，并将第三个参数设置为 false
    xhr.send();
    if (xhr.readyState === 4 && xhr.status === 200) {
        let response = xhr.responseText;
        let dx = JSON.parse(response)
        for (let index = 0; index < dx.feed.entry.length; index++) {
            if (dx.feed.entry[index].hasOwnProperty('url')) {
                if (dx.feed.entry[index] != {} && dx.feed.entry[index].url.indexOf(wz) > -1) {
                    let strat = dx.feed.entry[index].time
                    let end = strat + zjsj
                    let s1 = gjc + '|' + dx.feed.entry[index].title + "|" + dx.feed.entry[index].url + "|" + strat + "," + end
                    if (await jsonVerify(gjc, strat + ',' + end, wz)) {
                        arr.push(s1)
                    }
                }
            }
            if (arr.length >= sl) {
                break;
            }
        }
    }
    return arr
}
// 进度条更新
function updateProgressBar(progress) {
    const progressBar = document.getElementById('progress');
    const progressText = document.getElementById('progress-text');

    progressBar.style.width = `${progress}%`;
    progressText.innerText = `${progress}%`;
}
// 进度条更新
function updateProgress(progress) {
    // 在这里调用 updateProgressBar 函数来更新进度条位置
    updateProgressBar(progress);
}
// 延迟
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function jsonVerify(gjc, sjc, url) {
    let xhr = new XMLHttpRequest();
    while (true) {
        if (localStorage.yzm == 1 && xhr.readyState == 0) {
            xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://www.baidu.com/s?wd=' + gjc + '&tn=json&gpc=stf=' + sjc + '&inputT=' + (Math.floor(Math.random() * (6000 - 2000 + 1)) + 2000));  // 替换为你要发送请求的 URL，并将第三个参数设置为 false
            xhr.send();
        }
        await delayedAction()
        if (xhr.readyState === 4) {
            if (xhr.status == 302 && localStorage.yzm != 0) {
                localStorage.yzm = 0
                window.open(xhr.responseURL)
                sendMessage("百度搜索", "出现验证码请手动处理")
            }
            if (xhr.readyState == 4 && xhr.status == 200) {
                break
            }
        }
    }
    if (xhr.readyState === 4 && xhr.status === 200) {
        let jsdx = JSON.parse(xhr.responseText)
        for (let index = 0; index < jsdx.feed.entry.length; index++) {
            if (jsdx.feed.entry[index].hasOwnProperty('url')) {
                let furl = jsdx.feed.entry[index].url
                if (furl.indexOf(url) > -1 || furl == url) {
                    return true
                }
            }
        }
    }
    return false
}
//延迟执行
async function delayedAction() {
    await sleep(1000);
}
