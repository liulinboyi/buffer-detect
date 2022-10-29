import { bufferDetect, ENCODING } from "../src/index";
import fs from 'fs'
import path from 'path'
import iconv from 'iconv-lite'

describe("buffer encod", () => {
  it("gbk.txt buffer's encod is GBK", async () => {
    const res = fs.readFileSync(path.resolve(__dirname, "./txt/gbk.txt"));
    const code = new bufferDetect();
    code.detect(res);
    console.log(code);
    expect(code.encoding === ENCODING.GBK)
    const decode = iconv.decode(res, code.encoding);
    console.log(decode);
  });

  it("gbk2.txt buffer's encod is GBK", async () => {
    const res = fs.readFileSync(path.resolve(__dirname, "./txt/gbk2.txt"));
    const code = new bufferDetect();
    code.detect(res);
    console.log(code);
    expect(code.encoding === ENCODING.GBK)
    const decode = iconv.decode(res, code.encoding);
    console.log(decode);
  });

  it("gbk3.txt buffer's encod is GBK", async () => {
    const res = fs.readFileSync(path.resolve(__dirname, "./txt/gbk3.txt"));
    const code = new bufferDetect();
    code.detect(res);
    console.log(code);
    expect(code.encoding === ENCODING.GBK)
    const decode = iconv.decode(res, code.encoding);
    console.log(decode);
  });

  it("gbk4.txt buffer's encod is GBK", async () => {
    const res = fs.readFileSync(path.resolve(__dirname, "./txt/gbk4.txt"));
    const code = new bufferDetect();
    code.detect(res);
    console.log(code);
    expect(code.encoding === ENCODING.GBK)
    const decode = iconv.decode(res, code.encoding);
    console.log(decode);
  });

  it("gbk5.txt buffer's encod is GBK", async () => {
    const res = fs.readFileSync(path.resolve(__dirname, "./txt/gbk5.txt"));
    const code = new bufferDetect();
    code.detect(res);
    console.log(code);
    expect(code.encoding === ENCODING.GBK)
    const decode = iconv.decode(res, code.encoding);
    console.log(decode);
  });

  it("gbk6.txt buffer's encod is GBK", async () => {
    const res = fs.readFileSync(path.resolve(__dirname, "./txt/gbk6.txt"));
    const code = new bufferDetect();
    code.detect(res);
    console.log(code);
    expect(code.encoding === ENCODING.GBK)
    const decode = iconv.decode(res, code.encoding);
    console.log(decode);
  });

  it("gbk7.txt buffer's encod is GBK", async () => {
    const res = fs.readFileSync(path.resolve(__dirname, "./txt/gbk7.txt"));
    const code = new bufferDetect();
    code.detect(res);
    console.log(code);
    expect(code.encoding === ENCODING.GBK)
    const decode = iconv.decode(res, code.encoding);
    console.log(decode);
  });

  it("utf-8.txt buffer's encod is UTF8", async () => {
    const res = fs.readFileSync(path.resolve(__dirname, "./txt/utf-8.txt"));
    const code = new bufferDetect();
    code.detect(res);
    console.log(code);
    expect(code.encoding === ENCODING.UTF8)
    const decode = iconv.decode(res, code.encoding);
    console.log(decode);
  });
});
