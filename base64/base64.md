# Base64

## 1. Base64是什么

1. 目的

   - 将二进制数据转换成一种包含有限字符集的文本表示形式（即64个字符 A-Z a-z 0-9 + /)
   - 六比特是一个单元（2^6 = 64）

2. 用途

   - 数据传输：

     base64将二进制转化为文本，有利于网络传输（例：HTTP、SMTP、FTP等协议要求数据以文本格式传输）

   - 数据存储：

     将二进制数据存储文本文件中而不破坏文件格式（例：XML、JSON或配置文件）

   - 加密签名：

     Base64编码有时用于存储或传输数字签名、证书等加密数据（注意：此处的Base64本身并不提供加密或签名的安全性，它只是将数字签名转换为文本格式，便于存储或传输，但它不会影响数字签名的安全性）

   - 图像和多媒体处理：

     在Web开发和图像处理中，Base64编码可以用于嵌入图像、音频或视频数据直接到HTML、CSS或JavaScript代码中，而不需要外部文件

     - 减少HTTP请求/服务器请求
     - 避免跨域问题
     - 简化部署

   - 数据URI：Base64编码可用于创建数据URI，这是一种包含Base64编码图像或其他资源的特殊URI格式，通常用于嵌入图像、样式表和脚本等内容

   - 编码二进制文件：在编程中，可以使用Base64编码来将二进制文件（如图像、音频或压缩文件）转换为字符串，以便在程序中进行处理或存储

   - 数据传输的可读性：Base64编码使二进制数据更容易阅读，仅有的64位字符在调试和数据传输中很有用



## 2. 编码步骤

1. 首先，将要编码的二进制数据划分为3个字节一组。如果最后一个组的字节数不足3个字节，进行填充。
2. 对每个3字节的数据组进行编码。每个字节由8个比特组成，所以3个字节总共有24个比特。
3. 将这24个比特分成4组，每组6个比特。
4. 使用Base64字符表，将每组6个比特转换为一个Base64字符。
5. 如果原始数据的字节数不是3的倍数，会在编码完成后添加一些填充字符，通常是等号（=），以使编码后的数据长度为4的倍数。



## 3. 实现代码

### 1. 实现ASCII码版本

**JavaScript: **

编码：

```javascript
function stringToBytes(str) {
    let bytes = [];
    let binaryCode = '';
    for (let i = 0; i < str.length; i++) {
        binaryCode += unicodeToByte(str.charCodeAt(i)).padStart(8, '0');
    }
    for (let i = 0; i < binaryCode.length; i += 6) {
        bytes.push(binaryCode.slice(i, i + 6).padEnd(6, '0'));
    }
    return bytes;
}

function unicodeToByte(unicode) {
    return unicode.toString(2);
}

function encode(str) {
    let base64Collection = 'ABCDEFGHIJKLMNOPQISTUVWXYZabcdefghijklmnopqistuvwxyz0123456789+/'.split('');
    let base64Code = '';
    stringToBytes(str).forEach(element => {
        base64Code += base64Collection[parseInt(element, 2)];
    })
    base64Code = supplyEqual(base64Code);
    console.log('base64Code ', base64Code);
}

function supplyEqual(base64Code) {
    if (base64Code.length % 4 === 0) {
        return base64Code;
    } else {
        base64Code += '=';
        base64Code = supplyEqual(base64Code);
    }
    return base64Code;
}
```

解码：

```javascript
function decode(base64Code) {
    let base64Collection = 'ABCDEFGHIJKLMNOPQISTUVWXYZabcdefghijklmnopqistuvwxyz0123456789+/'.split('');
    let binaryCode = '';
    let bytes = [];
    let str = '';
    for (let i = 0; i < base64Code.length; i++) {
        if (base64Collection.indexOf(base64Code.charAt(i)) >= 0) {
            binaryCode += base64Collection.indexOf(base64Code.charAt(i)).toString(2).padStart(6, '0');
        }
    }
    for (let i = 0; i < binaryCode.length; i += 8) {
        bytes.push(binaryCode.slice(i, i + 8));
    }
    bytes.map(element => {
        str += String.fromCharCode((parseInt(element, 2)));
    })
    console.log('string: ', str);
}
```

### 2. 实现UFT-8版本

> 汉字进行base64编码通常需要将汉字转化为UTF-8后再进行Base64的编码

将先前代码进行更新并且结合ES6语法可得：

```javascript
class Base64 {
    base64Collection = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

    // ==============================encode==============================
    encode(str) {
        let base64Code = '';
        this.stringToBytes(str).forEach(element => {
            base64Code += this.base64Collection[parseInt(element, 2)];
        })
        base64Code = this.supplyEqual(base64Code);
        console.log('base64Code ', base64Code);
    }

    stringToBytes(str) {
        let bytes = [];
        let binaryCode = '';
        for (let i = 0; i < str.length; i++) {
            const tempBinaryCode = this.toByte(str.charCodeAt(i));
            if (tempBinaryCode.length <= 8) {
                binaryCode += tempBinaryCode.padStart(8, '0');
            } else {
                binaryCode += this.toUFT8(tempBinaryCode.padStart(16, '0'));
            }
        }
        for (let i = 0; i < binaryCode.length; i += 6) {
            bytes.push(binaryCode.slice(i, i + 6).padEnd(6, '0'));
        }
        return bytes;
    }

    toByte(unicode) {
        return unicode.toString(2);
    }

    toUFT8(unicode) {
        return '1110' + unicode.slice(0, 4) + '10' + unicode.slice(4, 10) + '10' + unicode.slice(10, 16);
    }

    supplyEqual(base64Code) {
        if (base64Code.length % 4 === 0) {
            return base64Code;
        } else {
            base64Code += '=';
            base64Code = this.supplyEqual(base64Code);
        }
        return base64Code;
    }

    // ==============================decode==============================
    decode(base64Code) {
        let binaryCode = '';
        let bytes = [];
        let str = '';
        const uft8Regex = /(1110[01]{4}10[01]{6}10[01]{6})/g;
        for (let i = 0; i < base64Code.length; i++) {
            if (this.base64Collection.indexOf(base64Code.charAt(i)) >= 0) {
                binaryCode += this.base64Collection.indexOf(base64Code.charAt(i)).toString(2).padStart(6, '0');
            }
        }
        binaryCode.split(uft8Regex).forEach(element => {
            if (element.length === 24 && element.match(uft8Regex)) {
                bytes.push(this.toUnicode(element));
            } else {
                for (let i = 0; i < element.length; i += 8) {
                    bytes.push(element.slice(i, i + 8));
                }
            }
        })
        console.log(bytes)
        bytes.map(element => {
            str += String.fromCharCode((parseInt(element, 2)));
        })
        console.log('string: ', str);
    }

    toUnicode(utf8) {
        return utf8.slice(4, 8) + utf8.slice(10, 16) + utf8.slice(18, 24);
    }
}
```

### 3. 运算符版本

运算符版本的优点相比于之前的字符串版本多了一些优点：

1. **位级操作**: `<<` 操作符允许你对二进制位进行精确的操作。这对于位级编程，如处理二进制数据、位掩码、位移和位掩码操作非常有用。
2. **性能**: 位运算通常比其他方式更高效。因为它们直接操作二进制位，所以可以在底层实现中更快地执行。
3. **位移操作**: 位移操作（`<<` 和 `>>`）是处理二进制数据时的常见需求，例如，将整数表示的颜色值从RGB格式转换为其他格式。
4. **与硬件相关**: 位运算常常与硬件接口和底层编程有关，因为硬件通常是以位为单位进行操作的。

**JavaScript: **

```javascript
class Base64 {
    base64Collection = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    encode(string) {
        let base64Code = "";
        const encoder = new TextEncoder();
        const utf8 = encoder.encode(string);

        for (let i = 0; i < utf8.length; i += 3) {
            const char1 = utf8[i];
            const char2 = utf8[i + 1];
            const char3 = utf8[i + 2];

            const byte1 = char1 >> 2;
            const byte2 = ((char1 & 3) << 4) | (char2 >> 4);
            const byte3 = ((char2 & 15) << 2) | (char3 >> 6);
            const byte4 = char3 & 63;


            base64Code += this.base64Collection.charAt(byte1) + this.base64Collection.charAt(byte2) + this.base64Collection.charAt(byte3) + this.base64Collection.charAt(byte4);
        }

        if (utf8.length % 3 === 1) {
            base64Code = base64Code.slice(0, -2) + '==';
        } else if (utf8.length % 3 === 2) {
            base64Code = base64Code.slice(0, -1) + '=';
        }

        return base64Code;
    }

    decode(base64Code) {
        let string = "";

        for (let i = 0; i < base64Code.length; i += 4) {
            const byte1 = this.base64Collection.indexOf(base64Code.charAt(i));
            const byte2 = this.base64Collection.indexOf(base64Code.charAt(i + 1));
            const byte3 = base64Code.charAt(i + 2) !== "=" ? this.base64Collection.indexOf(base64Code.charAt(i + 2)) : 0;

            const byte4 = base64Code.charAt(i + 3) !== "=" ? this.base64Collection.indexOf(base64Code.charAt(i + 3)) : 0;
            const char1 = (byte1 << 2) | (byte2 >> 4);
            const char2 = ((byte2 & 15) << 4) | (byte3 >> 2);
            const char3 = ((byte3 & 3) << 6) | byte4;

            string += String.fromCharCode(char1);

            if (byte3 !== 0) {
                string += String.fromCharCode(char2);
            }

            if (byte4 !== 0) {
                string += String.fromCharCode(char3);
            }
        }

        return this.utf8Decode(string);
    }

    utf8Decode(utf8) {
        const utf8Decoder = new TextDecoder('utf-8');
        const bytes = new Uint8Array(utf8.length);

        for (let i = 0; i < utf8.length; i++) {
            bytes[i] = utf8.charCodeAt(i);
        }

        return utf8Decoder.decode(bytes);
    }
}
```

