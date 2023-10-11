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