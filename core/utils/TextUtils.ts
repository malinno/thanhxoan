import _, { isEmpty, isNil, round, startsWith } from 'lodash';

class TextUtils {
  static truncate = (string: string, length: number, tail?: string) => {
    if (!_.isNil(tail)) {
      length -= tail.length;
    }
    if (_.isEmpty(string) || string.length <= length) {
      return string;
    }

    const trimmedString = string.substr(0, length);
    return (
      trimmedString.substr(
        0,
        Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')),
      ) + (tail ? tail : '')
    );
  };

  static validateEmail = (email?: string) => {
    if (isEmpty(email)) {
      return false;
    }
    const re = /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/gm;
    return re.test(String(email).toLowerCase());
  };

  static validatePassWord = (verify_password: string) => {
    const re = /^\w{6,}$/;
    return re.test(String(verify_password));
  };

  static validatePhone = (phone?: string, trim = true) => {
    if (!phone || isEmpty(phone)) {
      return false;
    }
    phone = this.parseLanguageNumber(phone);
    if (!phone) return false;
    const re =
      /\b[\+]?[(]?[0-9]{2,4}[)]?[-\s\.]?[0-9]{2,4}[-\s\.]?[0-9]{3,6}\b/gim;

    const phoneStr = trim ? String(phone.replace(/\s/g, '')) : phone;
    return re.test(phoneStr.toLowerCase());
  };

  static parseLanguageNumber(text?: string) {
    if (!text || typeof text !== 'string') {
      return;
    }
    text = text.replace(/၁|๑|१/g, '1');
    text = text.replace(/၂|๒|२/g, '2');
    text = text.replace(/၃|๓|३/g, '3');
    text = text.replace(/၄|๔|४/g, '4');
    text = text.replace(/၅|๕|५/g, '5');
    text = text.replace(/၆|๖|६/g, '6');
    text = text.replace(/၇|๗|७/g, '7');
    text = text.replace(/၈|๘|८/g, '8');
    text = text.replace(/၉|๙|९/g, '9');
    text = text.replace(/၀|๐|०/g, '0');
    return text;
  }

  static getNumberValue = (string: string) => {
    if (_.isEmpty(string)) {
      return string;
    }
    return parseInt(string.replace(/[^\d\.]/g, ''));
  };

  static unCapitalize = (string: string) => {
    const newString = _.clone(string);
    return newString.charAt(0).toLowerCase() + newString.slice(1);
  };

  static capitalize = (string: string) => {
    const newString = _.clone(string);
    return newString.charAt(0).toUpperCase() + newString.slice(1);
  };

  static normalize = (str: string) => {
    str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, 'A');
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, 'E');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/I|Í|Ì|Ĩ|Ị/g, 'I');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, 'O');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, 'U');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, 'Y');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/Đ/g, 'D');
    str = str.replace(/đ/g, 'd');
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
    return str;
  };

  static getAvatarInitials = (textString: string) => {
    if (!textString || typeof textString !== 'string') {
      return '';
    }

    const text = textString.trim();

    const textSplit = text.split(' ');

    if (textSplit.length <= 1) {
      return text.charAt(0);
    }

    const initials = (
      textSplit[0].charAt(0) + textSplit[textSplit.length - 1].charAt(0)
    ).replace(/[^0-9a-z]/gi, ''); // remove non characters

    return initials;
  };

  static isValidURL(str: string) {
    var pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i',
    ); // fragment locator
    return !!pattern.test(str);
  }

  // đổi số 84 ở đầu string thành 0
  static parsePubCodeToPhone = (str?: string) => {
    if (typeof str !== 'string') {
      return str;
    }

    let phoneNumber = '';
    if (!isEmpty(str)) {
      if (startsWith(str, '84')) {
        phoneNumber = str.replace('84', '0');
      } else {
        phoneNumber = str;
      }
    }
    return phoneNumber;
  };
}

export default TextUtils;
