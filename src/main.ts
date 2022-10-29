enum ENCODING {
  'ASCII' = 'ASCII',
  'UTF8' = 'UTF8',
  'GBK' = 'GBK'
}

class bufferDetect {
  encoding!: ENCODING | string;
  countUtf8!: number;
  countGbk!: number;
  ConfidenceCount!: number;
  CountGbk(buffer: Buffer | Uint8Array) {
    let count = 0; //存在GBK的byte

    const length = buffer.length; //总长度

    const head = 0x80; //小于127 通过 &head==0

    for (let i = 0; i < length; i++) {
      const firstByte = buffer[i]; //第一个byte，GBK有两个
      if ((firstByte & head) == 0) {
        //如果是127以下，那么就是英文等字符，不确定是不是GBK
        continue; //文件全部都是127以下字符，可能是Utf-8 或ASCII
      }
      if (i + 1 >= length) {
        //如果是大于127，需要两字符，如果只有一个，那么文件错了，但是我也没法做什么
        break;
      }
      const secondByte = buffer[i + 1]; //如果是GBK，那么添加GBK byte 2
      if (
        firstByte >= 161 &&
        firstByte <= 247 &&
        secondByte >= 161 &&
        secondByte <= 254
      ) {
        count += 2;
        i++;
      }
    }
    return count;
  }

  CountUtf8(buffer: Buffer) {
    let count = 0;

    const length = buffer.length;

    const head = 0x80;
    {
      for (let i = 0; i < length; i++) {
        const temp = buffer[i];
        if (temp < 128) {
          //  !(temp&head)
          //utf8 一开始如果byte大小在 0-127 表示英文等，使用一byte
          //length++; 我们记录的是和CountGBK比较
          continue;
        }
        let tempHead = head;
        let wordLength = 0; //单词长度，一个字使用多少个byte

        while ((temp & tempHead) != 0) {
          //存在多少个byte
          wordLength++;
          tempHead >>= 1;
        }

        if (wordLength <= 1) {
          //utf8最小长度为2
          continue;
        }

        wordLength--; //去掉最后一个，可以让后面的 point大于wordLength
        if (wordLength + i >= length) {
          break;
        }
        let point = 1; //utf8的这个word 是多少 byte
        //utf8在两字节和三字节的编码，除了最后一个 byte
        //其他byte 大于127
        //所以 除了最后一个byte，其他的byte &head >0
        for (; point <= wordLength; point++) {
          const secondChar = buffer[i + point];
          if ((secondChar & head) == 0) {
            break;
          }
        }

        if (point > wordLength) {
          count += wordLength + 1;
          i += wordLength;
        }
      }
    }
    return count;
  }

  async detect(buffer: Buffer | Uint8Array) {
    const bom = buffer.slice(0, 4); // [0,4)
    const encoding = this.AutoEncoding(bom);
    this.encoding = encoding;
    if (encoding === "ASCII") {
      //如果都是ASCII，那么无法知道编码
      //如果属于 Utf8的byte数大于 GBK byte数，那么编码是 utf8，否则是GBK
      //如果两个数相同，那么不知道是哪个
      const countUtf8 = this.CountUtf8(buffer as Buffer);
      this.countUtf8 = countUtf8;
      // if (countUtf8 == 0) {
      // this.encoding = 'ASCII';
      // } else {
      const countGbk = this.CountGbk(buffer as Buffer);
      this.countGbk = countGbk;
      if (countUtf8 > countGbk) {
        this.encoding = "UTF8";
        // this.ConfidenceCount = countUtf8 / (countUtf8 + countGbk);
        this.ConfidenceCount = countUtf8 / (countUtf8 + countGbk);
      } else {
        this.encoding = "GBK";
        this.ConfidenceCount = countGbk / (countUtf8 + countGbk);
      }
      // }
    } else {
      this.ConfidenceCount = 1;
    }
  }

  AutoEncoding(bom: Buffer | Uint8Array) {
    if (bom.length != 4) {
      throw new Error("EncodingScrutator.AutoEncoding 参数大小不等于4");
    }

    // Analyze the BOM

    if (bom[0] == 0x2b && bom[1] == 0x2f && bom[2] == 0x76) return "UTF7"; //85 116 102 55    //utf7 aa 97 97 0 0
    //utf7 编码 = 43 102 120 90

    if (bom[0] == 0xef && bom[1] == 0xbb && bom[2] == 0xbf) return "UTF8"; //无签名 117 116 102 56
    // 130 151 160 231
    if (bom[0] == 0xff && bom[1] == 0xfe) return "Unicode"; //UTF-16LE

    if (bom[0] == 0xfe && bom[1] == 0xff) return "BigEndianUnicode"; //UTF-16BE

    if (bom[0] == 0 && bom[1] == 0 && bom[2] == 0xfe && bom[3] == 0xff)
      return "UTF32";

    return "ASCII"; //如果返回ASCII可能是GBK 无签名utf8
  }
}

export { bufferDetect, ENCODING };
