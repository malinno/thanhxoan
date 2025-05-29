
import dayjs from 'dayjs';
import {isNaN, isNil} from 'lodash';
import moment, {Moment} from 'moment';

const FORMAT = [
  {value: 60, title: 'phút'},
  {value: 24, title: 'giờ'},
];

const numberParser = (number: number) => {
  const stringNumber = number.toString();
  if (stringNumber.length >= 2) return stringNumber;
  return ('0' + stringNumber).slice(-2);
};

const formatTime = (
  hours: number | string,
  minutes: number | string,
  seconds: number | string,
) => {
  if (Number(hours) < 10) {
    hours = `0${hours}`;
  }
  if (Number(minutes) < 10) {
    minutes = `0${minutes}`;
  }
  if (Number(seconds) < 10) {
    seconds = `0${seconds}`;
  }
  return {hours, minutes, seconds};
};

export interface Duration {
  hours: string;
  minutes: string;
  seconds: string;
}

class TimeUtils {
  static durationFormat = (difference: number) => {
    let duration = [];
    difference = Math.floor(difference / 60);
    for (const item of FORMAT) {
      const result = difference % item.value;
      difference = Math.floor(difference / item.value);
      if (result !== 0) {
        duration.unshift(`${result} ${item.title}`);
      }
      if (difference === 0) {
        break;
      }
    }
    if (difference !== 0) {
      duration.unshift(`${difference} ngày`);
    }
    return duration.join(' ');
  };

  static getNextDays = (start: Date | string, days: number) => {
    let nextDays = [];
    for (let index = 1; index < days; index++) {
      nextDays.push(moment(start).add(index, 'days'));
    }
    return nextDays;
  };

  static durationSince = (fromTimestamp?: number, toTimestamp?: number, returnType: 'string' | 'object' = 'string',) => {
    const to = moment(toTimestamp);
    if (!fromTimestamp || fromTimestamp > to.valueOf()) return;
    const from = moment(fromTimestamp)

    var dif = moment.duration(moment(to).diff(from));
    const difHours = Math.floor(dif.asHours());
    const difMins = Math.floor(dif.minutes());
    const difSecs = Math.floor(dif.seconds());
    const difMiliseconds = Math.floor(dif.milliseconds() / 100);
    const duration = [difHours, difMins, difSecs].join(':');
    if (returnType === 'object') {
      return {
        hours: numberParser(difHours),
        minutes: numberParser(difMins),
        seconds: numberParser(difSecs),
        milliseconds: numberParser(difMiliseconds),
      };
    }
    return `${duration}.${difMiliseconds}`;
  }

  static durationFromNow = (
    expireTime: number,
    returnType: 'string' | 'object' = 'string',
  ) => {
    const currentTime = moment();
    if (currentTime.valueOf() > expireTime) return;

    var dif = moment.duration(moment(expireTime).diff(currentTime));
    const difHours = Math.floor(dif.asHours());
    const difMins = Math.floor(dif.minutes());
    const difSecs = Math.floor(dif.seconds());
    const difMiliseconds = Math.floor(dif.milliseconds() / 100);
    const duration = [difHours, difMins, difSecs].join(':');
    if (returnType === 'object') {
      return {
        hours: numberParser(difHours),
        minutes: numberParser(difMins),
        seconds: numberParser(difSecs),
        milliseconds: numberParser(difMiliseconds),
      };
    }
    return `${duration}.${difMiliseconds}`;
  };

  static durationFromNowWithDays = (expireTime: number) => {
    const currentTime = moment();
    if (currentTime.valueOf() > expireTime) return;

    var dif = moment.duration(moment(expireTime).diff(currentTime));
    const difDays = Math.floor(dif.asDays());
    const difHours = Math.floor(dif.hours());
    const difMins = Math.floor(dif.minutes());
    const difSecs = Math.floor(dif.seconds());
    const difMiliseconds = Math.floor(dif.milliseconds() / 100);

    return {
      days: numberParser(difDays),
      hours: numberParser(difHours),
      minutes: numberParser(difMins),
      seconds: numberParser(difSecs),
      milliseconds: numberParser(difMiliseconds),
    };
  };

  static durationFromNowWithSeconds = (expireTime: number) => {
    const currentTime = moment();
    if (currentTime.valueOf() > expireTime) return;

    var dif = moment.duration(moment(expireTime).diff(currentTime));
    const difSecs = Math.floor(dif.asSeconds());

    return difSecs;
  };

  static formatNumberToTime = (number: string | number) => {
    const secNum = Math.max(
      typeof number === 'string' ? parseInt(number) : number,
      0,
    );
    if (isNil(secNum) || secNum < 0 || isNaN(secNum)) {
      return {hours: 0, minutes: 0, seconds: 0};
    }

    const hours = Math.floor(secNum / 3600);
    const minutes = Math.floor((secNum - hours * 3600) / 60);
    const seconds = secNum - hours * 3600 - minutes * 60;
    return formatTime(hours, minutes, seconds);
  };

  static getFutureTimeStamp = (next: number) => {
    const now = moment().unix();
    const future = now + next;
    return moment.unix(future).format('DD/MM/YYYY');
  };

  static currentTimestamp() {
    return moment().unix();
  }

  /**
   * parse server time to client time UTC +7
   * @param time
   * @returns
   */
  static parseServerTime(time?: Date | string): Moment {
    if (!time) return moment();
    return moment.utc(time, 'YYYY-MM-DDTHH:mm:ss').utcOffset(7);
  }

  /**
   * Generate list of interval times
   * @param startHour start time by hour
   * @param endHour end time by hour
   * @param minInterval minutes interval
   * @returns list of interval times
   */
  static generateTimeInterval(
    startHour: number = 0,
    endHour: number = 24,
    minInterval: number = 5,
  ) {
    const minPerHour = 60;
    let startMin = startHour * minPerHour;
    const endMin = endHour * minPerHour;
    const times = [];
    for (var i = 0; startMin <= endMin; i++) {
      var hh = Math.floor(startMin / 60); // getting hours of day in 0-24 format
      var mm = startMin % 60; // getting minutes of the hour in 0-55 format
      times[i] = ('0' + hh).slice(-2) + ':' + ('0' + mm).slice(-2);
      startMin = startMin + minInterval;
    }

    return times;
  }

  static secondsToMmSs(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    // Use String.padStart to ensure two-digit formatting
    const mm = String(minutes).padStart(2, '0');
    const ss = String(remainingSeconds).padStart(2, '0');
  
    return mm + ':' + ss;
  }

  static decimalHoursToHHMM (decimalHours: number) {
    const totalMinutes = decimalHours * 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);

    // Đảm bảo hiển thị đúng định dạng (2 chữ số cho giờ và phút)
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    return `${formattedHours}:${formattedMinutes}`;
  }
}

export default TimeUtils;
