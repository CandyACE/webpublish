import {
  camelCase,
  compact,
  difference,
  isArray,
  isEmpty,
  isFunction,
  isNaN,
  kebabCase,
  omitBy,
  parseInt,
  pick,
} from 'lodash'
import { resolve } from 'path'

/**
 * 转换文件大小
 * @param {Number} bytes 大小
 */
export function bytesToSize(bytes) {
  const b = parseInt(bytes, 10)
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (b === 0) { return '0 KB' }
  const i = parseInt(Math.floor(Math.log(b) / Math.log(1024)), 10)
  if (i === 0) { return `${b} ${sizes[i]}` }
  return `${(b / (1024 ** i)).toFixed(1)} ${sizes[i]}`
}

export function countToSize(count) {
  return `${count} 次`
}

/**
 * 计算进度百分比
 * @param {Number} totalLength 全部大小
 * @param {Number} completedLength 完成大小
 */
export function calcProgress(totalLength, completedLength) {
  const total = parseInt(totalLength, 10)
  const completed = parseInt(completedLength, 10)
  if (total === 0 || completed === 0) {
    return 0
  }
  const percentage = completed / total * 100
  const result = parseFloat(percentage.toFixed(2))
  return result
}

/**
 * 计算需要完成时间
 * @param {Number} totalLength 全部大小
 * @param {Number} completedLength 完成大小
 * @param {Number} downloadSpeed 下载速度
 */
export function timeRemaining(totalLength, completedLength, downloadSpeed) {
  const remainingLength = totalLength - completedLength
  return Math.ceil(remainingLength / downloadSpeed)
}

/**
 * timeFormat
 * @param {int} seconds
 * @param {string} prefix
 * @param {string} suffix
 * @param {object} i18n
 * i18n: {
 *  gt1d: 'More than one day',
 *  hour: 'h',
 *  minute: 'm',
 *  second: 's'
 * }
 */
export function timeFormat(seconds, { prefix = '', suffix = '', i18n }) {
  let result = ''
  let hours = ''
  let minutes = ''
  let secs = seconds || 0
  const i = {
    gt1d: '> 1 day',
    hour: 'h',
    minute: 'm',
    second: 's',
    ...i18n
  }

  if (secs <= 0) {
    return ''
  }
  if (secs > 86400) {
    return `${prefix} ${i.gt1d} ${suffix}`
  }
  if (secs > 3600) {
    hours = `${Math.floor(secs / 3600)}${i.hour} `
    secs %= 3600
  }
  if (secs > 60) {
    minutes = `${Math.floor(secs / 60)}${i.minute} `
    secs %= 60
  }
  secs += i.second
  result = hours + minutes + secs
  return result ? `${prefix} ${result} ${suffix}` : result
}

/**
 * 缩减文字长度
 * @param {*} str 
 * @param {*} maxLen 
 */
export function ellipsis(str = '', maxLen = 64) {
  const len = str.length
  let result = str
  if (len < maxLen) {
    return result
  }

  if (maxLen > 0) {
    result = `${result.substring(0, maxLen)}...`
  }

  return result
}

export function buildFileList(rawFile) {
  rawFile.uid = Date.now()
  const file = {
    status: 'ready',
    name: rawFile.name,
    size: rawFile.size,
    percentage: 0,
    uid: rawFile.uid,
    raw: rawFile
  }
  const fileList = [file]
  return fileList
}


export function calcFormLabelWidth(locale) {
  return locale.startsWith('de') ? '28%' : '25%'
}

export function changeKeysToKebabCase(obj) {
  return changeKeysCase(obj, kebabCase)
}

export function changeKeysCase(obj, caseConverter) {
  const result = {}
  if (isEmpty(obj) || !isFunction(caseConverter)) {
    return result
  }

  for (const [k, value] of Object.entries(obj)) {
    const key = caseConverter(k)
    result[key] = value
  }

  return result
}

export function changeKeysToCamelCase(obj) {
  return changeKeysCase(obj, camelCase)
}

export function diffConfig(current = {}, next = {}) {
  const curr = pick(current, Object.keys(next))
  const result = omitBy(next, (val, key) => {
    if (isArray(val)) {
      return JSON.stringify(curr[key]) === JSON.stringify(val)
    }
    return curr[key] === val
  })
  return result
}