interface Date {
  addDays(days: number): Date;
  subDays(days: number): Date;
  toDateTime(): string;
  toTimeDate(): string;
  toDDMMYYYY(): string;
}

Date.prototype.addDays = function (days: number) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

Date.prototype.subDays = function (days: number) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() - days);
  return date;
};

Date.prototype.toDateTime = function () {
  const YYYY = String(this.getFullYear()).padStart(4, '0');
  const MM = String(this.getMonth() + 1).padStart(2, '0');
  const DD = String(this.getDate()).padStart(2, '0');

  const HH = String(this.getHours()).padStart(2, '0');
  const mm = String(this.getMinutes()).padStart(2, '0');
  const ss = String(this.getSeconds()).padStart(2, '0');

  const leading = [YYYY, MM, DD].join('-');
  const trailing = [HH, mm, ss].join(':');

  return [leading, trailing].join(' ');
};

Date.prototype.toTimeDate = function () {
  const YYYY = String(this.getFullYear()).padStart(4, '0');
  const MM = String(this.getMonth() + 1).padStart(2, '0');
  const DD = String(this.getDate()).padStart(2, '0');

  const HH = String(this.getHours()).padStart(2, '0');
  const mm = String(this.getMinutes()).padStart(2, '0');

  const leading = [HH, mm].join(':');
  const trailing = [DD, MM, YYYY].join('/');

  return [leading, trailing].join(' - ');
};

Date.prototype.toDDMMYYYY = function () {
  const YYYY = String(this.getFullYear()).padStart(4, '0');
  const MM = String(this.getMonth() + 1).padStart(2, '0');
  const DD = String(this.getDate()).padStart(2, '0');

  return [DD, MM, YYYY].join('-');
};
