export default class CookieUtils {
  static parseCookie = (str: string): Record<string, string> => {
    return str
      .split(';')
      .map(v => v.split('='))
      .reduce((acc, v) => {
        if (v[0] && v[1])
          // @ts-ignore
          acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(
            v[1].trim(),
          );
        return acc;
      }, {});
  };
}