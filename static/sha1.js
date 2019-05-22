/**
 * Created by zhang on 18/4/3.
 */


var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase    */
var b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance  */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */


//sha1两次加密,截取16个字节,base64编码
function sha1(s) {
//将字符串编码为utf-8。
    var str1 = str2rstr_utf8(s);
//        sha1第一次加密
    var str2 = rstr_sha1(str1);
    // console.log('str2: ' + str2);

    var str = rstr2hex(str2);
//        console.log('str: ' + str);
//      sha1第二次加密
    var str3 = rstr_sha1(str2);
//        console.log('str3: ' + str3);

//        转换为16进制字符串
    var str4 = rstr2hex(str3);
//        console.log('str4: ' + str4);
//        将16进制字符串转换为字符数组,截取16个字节,并转换为16进制字符串
    var hexStr = Bytes2Str(Str2Bytes('d5d171885b18d0db26e279c6cf24d79d17f2c85e',16));
//        16进制字符串转换为字符串
    var shaStr = hexCharCodeToStr(hexStr);
//        base64编码
    var base64 = rstr2b64(shaStr);
    // console.log('base64: ' + base64);
    return base64;
}

//    16进制字符串转换为字符串
function hexCharCodeToStr(hexCharCodeStr) {
    var trimedStr = hexCharCodeStr.trim();
    var rawStr =
        trimedStr.substr(0,2).toLowerCase() === "0x"
            ?
            trimedStr.substr(2)
            :
            trimedStr;
    var len = rawStr.length;
    if(len % 2 !== 0) {
        alert("Illegal Format ASCII Code!");
        return "";
    }
    var curCharCode;
    var resultStr = [];
    for(var i = 0; i < len;i = i + 2) {
        curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
        resultStr.push(String.fromCharCode(curCharCode));
    }
    return resultStr.join("");
}

// sha1加密,base64编码
function privateKeysha1(s) {
    var sha1Str = rstr_sha1(str2rstr_utf8(s));
    return rstr2b64(sha1Str);
}





/*
 * Calculate the SHA1 of a raw string计算原始字符串的SHA1
 */
function rstr_sha1(s) {return binb2rstr(binb_sha1(rstr2binb(s), s.length * 8));}


/*
 * Convert a raw string to a hex string将原始字符串转换为16进制字符串。
 */
function rstr2hex(input)
{
    try { hexcase } catch(e) { hexcase=0; }
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var output = "";
    var x;
    for(var i = 0; i < input.length; i++)
    {
        x = input.charCodeAt(i);
        output += hex_tab.charAt((x >>> 4) & 0x0F)
            + hex_tab.charAt( x    & 0x0F);
    }
    return output;
}

/*
 * Convert a raw string to a base-64 string将原始字符串转换为base-64字符串。
 */
function rstr2b64(input)
{
    var b64pad='=';
//        console.log(b64pad);
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var output = "";
    var len = input.length;
//        alert(len);
    for(var i = 0; i < len; i += 3)
    {
        var triplet = (input.charCodeAt(i) << 16)
            | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
            | (i + 2 < len ? input.charCodeAt(i+2)   : 0);
        for(var j = 0; j < 4; j++)
        {
            if(i * 8 + j * 6 > input.length * 8) {
                output += b64pad;
//                    console.log('if' + j + ': ' + output);
            }
            else {
                output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
//                    console.log('else: ' + output);
            }
        }
    }
    return output;
}


/*将字符串编码为utf-8。
 * Encode a string as utf-8.
 * For efficiency, this assumes the input is valid utf-16.
 */
function str2rstr_utf8(input)
{
    var output = "";
    var i = -1;
    var x, y;

    while(++i < input.length)
    {
        /* Decode utf-16 surrogate pairs */
        x = input.charCodeAt(i);
        y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
        if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF)
        {
            x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
            i++;
        }

        /* Encode output as utf-8 */
        if(x <= 0x7F)
            output += String.fromCharCode(x);
        else if(x <= 0x7FF)
            output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                0x80 | ( x     & 0x3F));
        else if(x <= 0xFFFF)
            output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                0x80 | ((x >>> 6 ) & 0x3F),
                0x80 | ( x     & 0x3F));
        else if(x <= 0x1FFFFF)
            output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                0x80 | ((x >>> 12) & 0x3F),
                0x80 | ((x >>> 6 ) & 0x3F),
                0x80 | ( x     & 0x3F));
    }
    return output;
}


/*
 * Convert a raw string to an array of big-endian words将一个原始字符串转换成一个大字的数组。
 * Characters >255 have their high-byte silently ignored.
 */
function rstr2binb(input)
{
    var output = Array(input.length >> 2);
    for(var i = 0; i < output.length; i++)
        output[i] = 0;
    for(var i = 0; i < input.length * 8; i += 8)
        output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
//        console.log("rstr2binb----" + output);
    return output;
}

/*
 * Convert an array of big-endian words to a string
 */
function binb2rstr(input)
{
    var output = "";
    for(var i = 0; i < input.length * 32; i += 8)
        output += String.fromCharCode((input[i>>5] >>> (24 - i % 32)) & 0xFF);
//        console.log("binb2rstr------" +  output)
    return output;
}

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function binb_sha1(x, len)
{
    /* append padding */
    x[len >> 5] |= 0x80 << (24 - len % 32);
    x[((len + 64 >> 9) << 4) + 15] = len;

    var w = Array(80);
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    var e = -1009589776;

    for(var i = 0; i < x.length; i += 16)
    {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        var olde = e;

        for(var j = 0; j < 80; j++)
        {
            if(j < 16) w[j] = x[i + j];
            else w[j] = bit_rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
            var t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)),
                safe_add(safe_add(e, w[j]), sha1_kt(j)));
            e = d;
            d = c;
            c = bit_rol(b, 30);
            b = a;
            a = t;
        }

        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
        e = safe_add(e, olde);
    }
//        console.log("binb_sha1----" + Array(a, b, c, d, e));
    return Array(a, b, c, d, e);

}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d)
{
    if(t < 20) return (b & c) | ((~b) & d);
    if(t < 40) return b ^ c ^ d;
    if(t < 60) return (b & c) | (b & d) | (c & d);
    return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t)
{
    return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 :
        (t < 60) ? -1894007588 : -899497514;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
    return (num << cnt) | (num >>> (32 - cnt));
}







//字节数组转十六进制字符串
function Bytes2Str(arr)

{

    var str = "";

    for(var i=0; i<arr.length; i++)

    {

        var tmp = arr[i].toString(16);

        if(tmp.length == 1)

        {

            tmp = "0" + tmp;

        }

        str += tmp;

    }

    return str;

}

//十六进制字符串转字节数组
function Str2Bytes(str,num)

{

    var pos = 0;

    var len = str.length;

    if(len %2 != 0)

    {

        return null;

    }

    len /= 2;
//        alert(len);

//        if(len >= num) {
//            len = 16;
//        }
    var hexA = [];

    for(var i=0; i<num; i++)

    {

        var s = str.substr(pos, 2);

        var v = parseInt(s, 16);

        hexA.push(v);

        pos += 2;

    }

    return hexA;

}












