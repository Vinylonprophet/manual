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

