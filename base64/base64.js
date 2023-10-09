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

// =========================================

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