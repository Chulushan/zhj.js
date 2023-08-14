/**
 * title: 公用js文件
 * Author: zhj
 * timer: 2023-6-6 10:56:55
 * PS: 长期更新
 */

/**
 * 判断当前项目所处的环境
 * 其中192.168一般是是本地ip
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
 * 数组或数组对象去重
 * @param {array} val1 需要去重的数组
 * @param {string} val2 唯一标识字段
 * @returns {array} 返回去重之后的数组
 */
export function distinctArr(val1, val2) {
  // 判断是否为数组
  if (!(val1 instanceof Array)) {
    alert("要去重的数据不是个数组")
    return
  }
  // 判断数组是否为空
  if (!val1.length) {
    alert("需要去重的数组为空")
    return
  }
  let flag = ""
  // 判断数组是对象数组还是普通数组（不考虑date类型了）
  if (val1.every((item) => typeof item != "object")) {
    flag = "arr"
  } else if (val1.some((item) => typeof item != "object")) {
    alert("需要去重的数组数据格式不一致")
    return
  } else {
    flag = "objarr"
  }
  if (flag == "arr") {
    return [...new Set(val1)]
  } else if (flag == "objarr") {
    if (!val2) {
      alert("唯一标识符为空")
      return
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
 * 下载文件（只针对于单个文件，主要用于下载doc、xlsx或者pdf文件）
 * 其他类型如图片、视频、音频也可以下载就是如果体积过大，页面没有提示会僵持住，体验不好
 * @downFlag 控制节流
 * @param {string} val1 'flow'或'url' 流或者链接地址
 * @param {string} val2 要操作的数据本体（url地址或流）
 * @param {object} val3 {name:'',type:''} 下载文件的名字与后缀名
 * PS：如果是流的话，获取流的那个ajax调用需要设置接收类型responseType: "blob"，否则可能会乱码
 */
let downFlag = true
export function downloadDFile(val1, val2, val3) {
  if (!downFlag) {
    alert("正在下载，请稍后！")
    return
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
 * 限制只能输入数字
 * 最好是配合输入框的oninput事件使用
 * @param {string} val1 需要操作的字符串
 * @param {number} val2 1（数字）||2（字母）||3（汉字）||4（数字字母）||5（字母汉字） 默认是1
 * @returns {string} 最终返回符合规则的字符串
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
      return val1.replace(/[^\d]/g, "")
  }
}

/**
 * 手机号校验
 * @param {string | number} val 校验对象
 * @returns {boolean} 返回校验结果
 */
export function checkPhone(val) {
  if (val.length != 11) {
    alert("手机号码长度不是11位")
    return
  }
  var re = /^1\d{10}$/
  if (re.test(val)) return true
  else return false
}

/**
 * 邮箱校验
 * @param {string | number} val 校验对象
 * @returns {boolean} 返回校验结果
 */
export function checkEmail(val) {
  var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
  if (re.test(val)) return true
  else return false
}

/**
 * 字符串截取
 * @param {string} val1 源字符串
 * @param {string} val2 所需要截取的字段名
 * @param {string} val3 截取字段结尾标识符不传默认为'&'
 * @returns 返回最终字段
 */
export function strIntercept(val1, val2, val3) {
  if (!val1) {
    alert("请传入字符串")
    return
  }
  if (!val2) {
    alert("请传入您要截取的字段名")
    return
  }
  let url = decodeURI(val1) // 可能有中文
  let _url = "" // 传入字段索引之后的字符串
  let str = "" // 最终返回的字符串
  let augIdx = url.indexOf(val2) // 字段的索引
  if (augIdx == -1) {
    alert("字符串中不存在您需要截取的字段")
    return
  }
  let l = val2.length // 字段的长度
  _url = url.substring(augIdx + l)
  let idx = _url.indexOf(!val3 ? "&" : val3) //结尾字段的索引
  if (idx != -1) str = _url.substring(0, idx)
  else str = _url.substring(0)
  return str
}

/**
 * 密码复杂度校验（其中规则为大小写字母、数字以及特殊字符，不能包含空格）
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
