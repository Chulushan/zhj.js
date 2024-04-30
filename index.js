/**
 * Title: 公用js文件
 * Author: zhj
 * StartTimer: 2023-6-6 10:56:55
 * PS: 所有调用失败结果格式返回都为{ flag: flase, msg: 这是失败原因}
 */

/**
 * @description 判断当前项目所处的环境（其中192.168一般是是本地ip）
 * @returns {string} 最终返回的字段local、bate、pro
 */
export function envJudge() {
  const host = window.location.host
  const localList = ["localhost", "127.0.0.1", "192.168"]
  const bateList = ["bate", "test"]
  let flag1 = localList.find((item) => host.indexOf(item) != -1)
  let flag2 = bateList.find((item) => host.indexOf(item) != -1)
  if (flag1) {
    return "local"
  } else if (flag2) {
    return "bate"
  } else {
    return "pro"
  }
}

/**
 * @description 数组或数组对象去重
 * @param {array} val1 需要去重的数组
 * @param {string} val2 唯一标识字段
 * @returns {array} 返回去重之后的数组
 */
export function distinctArr(val1, val2) {
  // 判断是否为数组
  if (!(val1 instanceof Array)) {
    return { flag: false, msg: "要去重的数据不是个数组" }
  }
  // 判断数组是否为空
  if (!val1.length) {
    return { flag: false, msg: "需要去重的数组为空" }
  }
  let flag = ""
  // 判断数组是对象数组还是普通数组（不考虑date类型了）
  if (val1.every((item) => typeof item != "object")) {
    flag = "arr"
  } else if (val1.some((item) => typeof item != "object")) {
    return { flag: false, msg: "需要去重的数组数据格式不一致" }
  } else {
    flag = "objarr"
  }
  if (flag == "arr") {
    return [...new Set(val1)]
  } else if (flag == "objarr") {
    if (!val2) {
      return { flag: false, msg: "唯一标识符为空" }
    }
    let obj = {}
    let arr = val1.reduce((pre, item) => {
      if (!obj[item[val2]]) {
        obj[item[val2]] = true
        return [...pre, item]
      } else {
        return pre
      }
    }, [])
    return arr
  }
}

/**
 * @description 下载文件（只针对于单个文件，主要用于下载doc、xlsx或者pdf文件）
 * @description 其他类型如图片、视频、音频也可以下载就是如果体积过大，页面没有提示会僵持住，体验不好
 * @downFlag 控制节流
 * @param {string} val1 'flow'或'url' 流或者链接地址
 * @param {string} val2 要操作的数据本体（url地址或流）
 * @param {object} val3 {name:'',type:''} 下载文件的名字与后缀名
 * PS：如果是流的话，获取流的那个ajax调用需要设置接收类型responseType: "blob"，否则可能会乱码
 */
let downFlag = true
export function downloadDFile(val1, val2, val3) {
  if (!downFlag) {
    return { flag: "loading", msg: "正在下载，请稍后！" }
  }
  const download = (str) => {
    const a = document.createElement("a")
    document.body.appendChild(a)
    a.style.display = "none"
    a.href = window.URL.createObjectURL(str)
    a.download = val3.name + "." + val3.type
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(str)
    downFlag = true
  }
  downFlag = false
  if (val1 == "flow") {
    let blob = new Blob([val2])
    download(blob)
  } else if (val1 == "url") {
    fetch(val2)
      .then((res) => res.blob())
      .then((blob) => {
        // const _blob = window.URL.createObjectURL(blob)
        download(blob)
      })
  }
}

/**
 * @description 限制只能输入规定字符（最好是配合输入框的oninput事件使用）
 * @param {string} val1 需要操作的字符串
 * @param {number} val2 1（数字）||2（字母）||3（汉字）||4（数字字母）||5（字母汉字） 默认不做处理
 * @returns {string} 返回最终符合规则的字符串
 */
export function limitInput(val1, val2) {
  switch (val2) {
    case 1:
      return val1.replace(/[^\d]/g, "")
    case 2:
      return val1.replace(/[^a-zA-Z]/g, "")
    case 3:
      return val1.replace(/[^\u4e00-\u9fa5]/g, "")
    case 4:
      return val1.replace(/[^\w\.\/]/gi, "")
    case 5:
      return val1.replace(/[\d]/g, "")
    default:
      return val1
  }
}

/**
 * @description 手机号校验
 * @param {string | number} val 校验对象
 * @returns {boolean} 返回校验结果
 */
export function checkPhone(val) {
  if (val.toString().length != 11) {
    return { flag: false, msg: "手机号码长度不是11位" }
  }
  var re = /^1\d{10}$/
  if (re.test(val)) return true
  else return false
}

/**
 * @description 邮箱校验
 * @param {string | number} val 校验对象
 * @returns {boolean} 返回校验结果
 */
export function checkEmail(val) {
  var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
  if (re.test(val)) return true
  else return false
}

/**
 * @description 域名地址参数截取
 * @param {string} val1 源字符串
 * @param {string} val2 所需要截取的字段名
 * @param {string} val3 截取字段结尾标识符不传默认为'&'
 * @returns {string} 返回最终字段
 */
export function strIntercept(val1, val2, val3) {
  if (!val1) {
    return { flag: false, msg: "请传入字符串" }
  }
  if (!val2) {
    return { flag: false, msg: "请传入您要截取的字段名" }
  }
  let url = decodeURI(val1) // 可能有中文
  let _url = "" // 传入字段索引之后的字符串
  let str = "" // 最终返回的字符串
  let augIdx = url.indexOf(val2) // 字段的索引
  if (augIdx == -1) {
    alert("")
    return { flag: false, msg: "字符串中不存在您需要截取的字段" }
  }
  let l = val2.length + 1 // 字段的长度(+1是加上'='符号)
  _url = url.substring(augIdx + l)
  let idx = _url.indexOf(!val3 ? "&" : val3) //结尾字段的索引
  if (idx != -1) str = _url.substring(0, idx)
  else str = _url.substring(0)
  return str
}

/**
 * @description 截取域名所有参数
 * @param {string} val 源域名字符串
 * @returns {object} 返回所有参数结合s
 */
export function urlIntercept(val) {
  if (!val) return { flag: false, msg: "请传入字符串" }
  const obj = {}
  val.replace(/([^?&=])=([^&]+)/g, (_, k, v) => (obj[k] = v))
  return obj
}

/**
 * @description 密码复杂度校验（其中规则为大小写字母、数字以及特殊字符，不能包含空格）
 * @param {string} val1 源字符串
 * @returns {object} {flag: true, msg: ''}flag为true表示是合规的，msg是不合规的提示
 */
export function passwordCheck(val) {
  const regex =
    /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,15}$/
}

// 大写字母，小写字母，数字，特殊字符，不能包含空格，
// 四种
// var regex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]){8,30}$/
// var regex = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}');

/**
 * @description 测试npm版本方法
 * @returns {string} 版本测试
 */
export function testVersion() {
  return "1.0.1"
}
