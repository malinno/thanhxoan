import { isEmpty, round } from 'lodash';

const numeral = require('numeral');

if (numeral.locales['vn'] === undefined) {
  numeral.register('locale', 'vn', {
    delimiters: {
      thousands: '.',
      decimal: ',',
    },
  });
  numeral.locale('vn');
}

export default class PriceUtils {
  static format = (
    price: string | number = 0,
    currency = '₫',
    separator = ' ',
  ) => {
    if (typeof price !== 'number' && typeof price !== 'string') {
      return price;
    }

    if (typeof price === 'string') {
      if (!isEmpty(currency) && price.indexOf(currency) !== -1) {
        return price;
      }
      return (
        numeral(parseInt(price)).format('0,0').replace(/,/g, '.') +
        separator +
        currency
      );
    }

    return (
      numeral(price).format('0,0').replace(/,/g, '.') + separator + currency
    );
  };

  static formateSalePrice = (
    price: string | number = 0,
    currency: string = '₫',
    separator = ' ',
  ) => {
    if (typeof price !== 'number' && typeof price !== 'string') {
      return price;
    }

    const parsedPrice = numeral(price).format('0,0').replace(/,/g, '.');

    if (parsedPrice.length === 5) {
      return 'x' + parsedPrice.substr(1) + currency;
    } else if (parsedPrice.length > 5) {
      const first = parsedPrice.substr(0, 1);
      const neededParse = parsedPrice.substr(1, parsedPrice.length - 5);
      const tail = parsedPrice.substr(
        parsedPrice.length - 4,
        parsedPrice.length,
      );

      return (
        first + neededParse.replace(/[0-9]/g, 'x') + tail + separator + currency
      );
    }

    return parsedPrice + currency;
  };

  static removeDot = (value: string): string => {
    return value
      .toString()
      .replace(/\./g, '')
      .replace(/\,/g, '')
      .replace(/[^\d\.]/g, '');
  };

  static roundedWithAbbreviations(count: number) {
    let thousand = count / 1000;
    let million = count / 1000000;
    if (million >= 1.0) {
      const result = round(million, 1);
      return result + 'M';
    } else if (thousand >= 1.0) {
      const result = round(thousand, 1);
      return result + 'K';
    } else {
      return `${count}`;
    }
  }

  static nFormatter(num = 0, digits = 2) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function(item) {
      return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
  }
}
