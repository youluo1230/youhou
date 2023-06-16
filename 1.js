var xhr = new XMLHttpRequest();
xhr.open('GET', "https://m.baidu.com/s?wd=%E4%BA%B2%E5%AD%90%E9%89%B4%E5%AE%9A&gpc=stf=1617744602,1617748202%7Cstftype%3D1", false); // 同步请求
xhr.send();
let str = xhr.responseText
let parser = new DOMParser();
let doc = parser.parseFromString(str, 'text/html');
let sz = doc.querySelectorAll(".c-result.result");