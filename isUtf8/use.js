const fs = require('fs')
const path = require('path')
const isutf8 = require('./is-utf8')

const res = fs.readFileSync(path.resolve(__dirname, "./txt/gbk.txt"))
// const res = fs.readFileSync(path.resolve(__dirname, "./txt/utf-8.txt"))

let result = isutf8(res)
console.log(result)
