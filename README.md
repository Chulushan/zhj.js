# zhj的公用js文件

> 基于js原生封装的js方法

## Install
> npm install zhj.js，[点击查看包地址](https://www.npmjs.com/package/zhj.js?activeTab=readme)

## 方法调用说明
> 所有调用失败结果格式返回都为{ flag: flase, msg: 这是失败原因}
* envJudge
	```js
	/**
	* 判断当前项目所处的环境
	* 其中192.168一般是是本地ip
	* @returns {string} 最终返回的字段local、bate、pro，分别为本地，测试与生产
	*/
	function envJudge() {}
	```
* distinctArr
	```js
	/**
	* 数组或数组对象去重
	* @param {array} val1 需要去重的数组
	* @param {string} val2 唯一标识字段
	* @returns {array} 返回去重之后的数组
	*/
	function distinctArr(val1, val2) {}
	```
* downloadDFile
	```js
	/**
	* 下载文件（只针对于单个文件，主要用于下载doc、xlsx或者pdf文件）
	* 其他类型如图片、视频、音频也可以下载就是如果体积过大，页面没有提示会僵持住，体验不好
	* @downFlag 控制节流
	* @param {string} val1 'flow'或'url' 流或者链接地址
	* @param {string} val2 要操作的数据本体（url地址或流）
	* @param {object} val3 {name:'',type:''} 下载文件的名字与后缀名
	* PS：如果是流的话，获取流的那个ajax调用需要设置接收类型responseType: "blob"，否则可能会乱码
	*/
	let downFlag = true
	function downloadDFile(val1, val2, val3) {}
	```js
* limitInput
	```js
	/**
	* 限制只能输入规定字符
	* 最好是配合输入框的oninput事件使用
	* @param {string} val1 需要操作的字符串
	* @param {number} val2 1（数字）||2（字母）||3（汉字）||4（数字字母）||5（字母汉字） 默认不做处理
	* @returns {string} 返回最终符合规则的字符串
	*/
	function limitInput(val1, val2) {}
	```
* checkPhone
	```js
	/**
	* 手机号校验
	* @param {string | number} val 校验对象
	* @returns {boolean} 返回校验结果
	*/
	function checkPhone(val)  {}
	```
* checkEmail
	```js
	/**
	* 邮箱校验
	* @param {string | number} val 校验对象
	* @returns {boolean} 返回校验结果
	*/
	function checkEmail(val) {}
	```
* strIntercept
	```js
	/**
	* 域名地址参数截取
	* @param {string} val1 源字符串
	* @param {string} val2 所需要截取的字段名
	* @param {string} val3 截取字段结尾标识符不传默认为'&'
	* @returns {string} 返回最终字段
	*/
	function strIntercept(val1, val2, val3) {}
	```
