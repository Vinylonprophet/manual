// Version1
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
        bytes.map(element => {
            str += String.fromCharCode((parseInt(element, 2)));
        })
        console.log('string: ', str);
    }

    toUnicode(utf8) {
        return utf8.slice(4, 8) + utf8.slice(10, 16) + utf8.slice(18, 24);
    }
}

// Version2
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