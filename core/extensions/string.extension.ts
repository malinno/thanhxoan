import { isNil } from 'lodash';
import UrlParse from 'url-parse';

declare global {
  interface String {
    toInt(): number;
    isUrl(): boolean;
    isSvgUri(): boolean;
    toCapitalize(): string
  }
}

String.prototype.toInt = function () {
  return Number(this.replace(/\D/g, ''));
};

String.prototype.isUrl = function () {
  if (isNil(this)) return false;
  try {
    const newUrl = UrlParse(`${this}`);
    return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
  } catch (err) {
    return false;
  }
};

String.prototype.isSvgUri = function () {
  if (isNil(this)) return false;
  return `${this}`.isUrl() && `${this}`.endsWith('.svg');
};

String.prototype.toCapitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

export {};
