import axios from 'axios';
import * as _ from 'lodash';
import { MMKV } from 'react-native-mmkv';
import { htmlToText } from 'html-to-text';
import Config from 'react-native-config';

const GMAP_BLOCKED_AT = 'GmapBlockedAt';
const COCCOC_BLOCKED_AT = 'CocCocBlockedAt';

const mmkv = new MMKV();

export interface IPlaceDetail {
  address: string;
  latitude: number;
  longitude: number;
}

export default class PlaceUtils {
  private static blockedAt = mmkv.getNumber(GMAP_BLOCKED_AT) ?? 0;
  private static cocCocBlockedAt = mmkv.getNumber(COCCOC_BLOCKED_AT) ?? 0;

  public static getAddressString(
    address: string,
    ward: string,
    district: string,
    city: string,
  ): string {
    if (!ward) {
      ward = '';
    }
    if (!district) {
      district = '';
    }
    if (!city) {
      city = '';
    }
    return `${ward
      .replace('[Pp]hường', '')
      .replace('[Xx]ã', '')
      .trim()}, ${district
      .replace('[Qq]uận', '')
      .replace('[Hh]uyện', '')
      .trim()}, ${city
      .replace('[Tt]ỉnh', '')
      .replace('[Tt]hành phố', '')
      .trim()}`;
  }

  public static distance(
    lat: number,
    lng: number,
    lat2: number,
    lng2: number,
  ): number {
    if (lat == lat2 && lng == lng2) {
      return 0;
    } else {
      const radlat1 = (Math.PI * lat) / 180;
      const radlat2 = (Math.PI * lat2) / 180;
      const theta = lng - lng2;
      const radtheta = (Math.PI * theta) / 180;
      let dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      dist = dist * 1.609344;
      return dist * 1000;
    }
  }

  public static async searchPlaceByGoogleMap(
    query: string,
    latitude: number,
    longitude: number,
  ): Promise<IPlaceDetail[]> {
    try {
      if (Date.now() - this.blockedAt < 30 * 60 * 1000) {
        throw new Error();
      }
      const response = await axios.get('https://www.google.com/s', {
        params: {
          gl: 'vn',
          gs_ri: 'maps',
          suggest: 'p',
          tbm: 'map',
          q: query,
          // pb: `u2d${longitude || 105.8199194}u2d${latitude || 21.022198}`,
          pb: `!2i6!4m12!1m3!1d6031.590089562343!2d${
            longitude || 105.8199194
          }!3d${
            latitude || 21.022198
          }!2m3!1f0!2f0!3f0!3m2!1i1512!2i311!4f13.1!7i20!10b1!12m16!1m1!18b1!2m3!5m1!6e2!20e3!10b1!12b1!13b1!16b1!17m1!3e1!20m3!5e2!6b1!14b1!19m4!2m3!1i360!2i120!4i8!20m57!2m2!1i203!2i100!3m2!2i4!5b1!6m6!1m2!1i86!2i86!1m2!1i408!2i240!7m42!1m3!1e1!2b0!3e3!1m3!1e2!2b1!3e2!1m3!1e2!2b0!3e3!1m3!1e8!2b0!3e3!1m3!1e10!2b0!3e3!1m3!1e10!2b1!3e2!1m3!1e9!2b1!3e2!1m3!1e10!2b0!3e3!1m3!1e10!2b1!3e2!1m3!1e10!2b0!3e4!2b1!4b1!9b0!22m3!1s_cGaZcm_BJeVvr0Pmr-9-As!7e81!17s_cGaZcm_BJeVvr0Pmr-9-As%3A60!23m3!1e116!4b1!10b1!24m94!1m29!13m9!2b1!3b1!4b1!6i1!8b1!9b1!14b1!20b1!25b1!18m18!3b1!4b1!5b1!6b1!9b1!12b1!13b1!14b1!15b1!17b1!20b1!21b1!22b0!25b1!27m1!1b0!28b0!31b0!10m1!8e3!11m1!3e1!14m1!3b1!17b1!20m2!1e3!1e6!24b1!25b1!26b1!29b1!30m1!2b1!36b1!39m3!2m2!2i1!3i1!43b1!52b1!54m1!1b1!55b1!56m2!1b1!3b1!65m5!3m4!1m3!1m2!1i224!2i298!71b1!72m17!1m5!1b1!2b1!3b1!5b1!7b1!4b1!8m8!1m6!4m1!1e1!4m1!1e3!4m1!1e4!3sother_user_reviews!9b1!89b1!103b1!113b1!114m3!1b1!2m1!1b1!117b1!122m1!1b1!26m4!2m3!1i80!2i92!4i8!34m18!2b1!3b1!4b1!6b1!8m6!1b1!3b1!4b1!5b1!6b1!7b1!9b1!12b1!14b1!20b1!23b1!25b1!26b1!37m1!1e81!47m0!49m7!3b1!6m2!1b1!2b1!7m2!1e3!2b1!61b1!67m2!7b1!10b1!69i675`,
        },
      });
      let responseData: string = response.data;
      responseData = responseData.split("'\n")[1];
      let data = JSON.parse(responseData);
      data = data[0];
      data = data[1];

      return data
        .map((item: any) => {
          item = item[item.length - 1];
          return {
            address: htmlToText(item[0][0])
              ?.replace(/\n/g, ' ')
              .replace(/\t/g, ' '),
            latitude: (item[11] || [])[2],
            longitude: (item[11] || [])[3],
          };
        })
        .filter((item: any) => item.latitude);
    } catch (e) {
      console.log(`raw err`, e);
      this.setGmapBlockedAt(Date.now());
      const err = 'Google place API blocked';
      console.log(`err`, err);
      throw new Error(err);
    }
  }

  public static async searchPlace(
    query: string,
    latitude: number,
    longitude: number,
  ): Promise<IPlaceDetail[]> {
    const now = Date.now();
    const isGmapBlocked = now - this.blockedAt < 30 * 60 * 1000;
    const isCcmapBlocked = now - this.cocCocBlockedAt < 30 * 60 * 1000;
    const isBlocked = isGmapBlocked && isCcmapBlocked;

    if (isBlocked)
      return this.searchPlaceFromServer(query, latitude, longitude);

    try {
      if (isGmapBlocked) {
        const result = this.searchPlaceByCocCoc(query, latitude, longitude);
        if (!_.isEmpty(result)) return result;
      }

      return this.searchPlaceByGoogleMap(query, latitude, longitude);
    } catch (e) {
      console.log(e);
      this.setGmapBlockedAt(Date.now());
      console.log('Google place API blocked');
      return this.searchPlaceFromServer(query, latitude, longitude);
    }
  }

  static async searchPlaceFromServer(
    query: string,
    latitude: number,
    longitude: number,
  ): Promise<IPlaceDetail[]> {
    return [];
    // const { response, error } = await PlaceRepo.search({
    //   query,
    //   lat: latitude,
    //   lng: longitude,
    // });
    // return response?.data?.data || [];
  }

  public static async searchPlaceByCocCoc(
    query: string,
    latitude: number,
    longitude: number,
  ): Promise<IPlaceDetail[]> {
    try {
      const response = await axios.get(
        'https://map.coccoc.com/map/search.json',
        {
          params: {
            query,
            suggestions: true,
            borders: `${latitude || 21.022198}%2C${
              longitude || 105.8199194
            }%2C${(latitude || 21.022198) + 0.01}%2C${
              (longitude || 105.8199194) + 0.01
            }`,
          },
        },
      );
      const responseData = response.data.result;
      const data = responseData?.poi;
      // console.log(`data`, data);
      if (_.isEmpty(data)) return data;
      return data
        .map((item: any) => {
          const addr = [
            htmlToText(item.address)?.replace(/\n/g, ' ').replace(/\t/g, ' '),
          ];
          if (item.title) addr.unshift(htmlToText(item.title));
          return {
            address: addr.join(', '),
            latitude: item.gps?.latitude,
            longitude: item.gps?.longitude,
          };
        })
        .filter((item: any) => item.latitude);
    } catch (e) {
      console.log(`search place by CocCoc err`, e);
      this.blockedAt = Date.now();
      throw e;
    }
  }

  public static async location2String(
    latitude: number,
    longitude: number,
  ): Promise<string> {
    if (Date.now() - this.blockedAt < 30 * 60 * 1000) {
      return this.officialLocation2String(latitude, longitude);
    }
    try {
      const response = await axios.get(
        'https://www.google.com/maps/preview/reveal',
        {
          params: {
            gl: 'vn',
            pb: `!2d105.790908225761!3d20.999411527909917!3m2!2d${longitude}!3d${latitude}!4m7!4m1!2i5600!7e140!9savI!17sav!24m1!2e1!5m9!1e1!1e2!1e5!1e11!1e4!2m3!1i335!2i120!4i8!6m11!2b1!4b1!5m1!6b1!17b1!20m2!1e3!1e1!24b1!29b1!89b1`,
          },
          timeout: 1000,
        },
      );
      let responseData: string = response.data;
      responseData = responseData.split("'\n")[1];
      const data = JSON.parse(responseData);
      console.log(`location to string data`, data);
      return data[0].join(', ');
    } catch (e) {
      console.log(e);
      this.setCocCocBlockedAt(Date.now());
      console.log('Google place API blocked');
      return this.officialLocation2String(latitude, longitude);
    }
  }

  public static async officialLocation2String(
    latitude: number,
    longitude: number,
  ): Promise<string> {
    try {
      console.log(
        `official location to string request`,
        `latitude: ${latitude}, longitude: ${longitude}`,
      );
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/geocode/json',
        {
          params: {
            latlng: `${latitude},${longitude}`,
            key: Config.GOOGLE_MAPS_API_KEY,
          },
          timeout: 1000
        },
      );
      const responseData = response.data;
      console.log(`official location to string data`, responseData);
      return responseData.results[0].formatted_address;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public static getCity = async (latitude: number, longitude: number) => {
    // const city = await geocoder.reverse(latitude, longitude);
    // return city?.admin1;
  };

  public static async getLatLongByAddress(address: string) {
    if (Date.now() - this.blockedAt < 30 * 60 * 1000) {
      return this.getOfficialLatLongByAddress(address);
    }
    try {
      const response = await axios.get('https://www.google.com/search', {
        params: {
          tbm: 'map',
          hl: 'vi',
          q: address,
          oq: address,
          pb: '!10b1!12e5!24m52!1m16!13m7!2b1!3b1!4b1!6i1!8b1!9b1!20b1!18m7!3b1!4b1!5b1!6b1!9b1!13b1!14b0!2b1!5m5!2b1!3b1!5b1!6b1!7b1!10m1!8e3!14m1!3b1!17b1!20m2!1e3!1e6!24b1!25b1!26b1!29b1!30m1!2b1!36b1!43b1!52b1!55b1!56m2!1b1!3b1!65m5!3m4!1m3!1m2!1i224!2i298!89b1!26m4!2m3!1i80!2i92!4i8!30m28!1m6!1m2!1i0!2i0!2m2!1i458!2i1188!1m6!1m2!1i1532!2i0!2m2!1i1582!2i1188!1m6!1m2!1i0!2i0!2m2!1i1582!2i20!1m6!1m2!1i0!2i1168!2m2!1i1582!1e81',
        },
        responseType: 'text',
      });
      let responseData: string = response.data;
      responseData = responseData.split("'\n")[1];
      const data = JSON.parse(responseData);
      let addressData;
      let latitude = data[1][0][2];
      let longitude = data[1][0][1];
      try {
        const addressResults = data[0][1];
        for (const addressResult of addressResults) {
          if (addressResult && addressResult[14]) {
            addressData = addressResult[14][18];
            if (addressResult[14][9]) {
              latitude = addressResult[14][9][2];
              longitude = addressResult[14][9][3];
            }
            break;
          }
        }
      } catch (e) {
        console.log(e);
      }
      return {
        latitude,
        longitude,
        address: addressData?.replace(/\n/g, ' ').replace(/\t/g, ' '),
      };
    } catch (e) {
      console.log('data', e);
      this.setGmapBlockedAt(Date.now());
      console.log('Google place API blocked');
      return this.getOfficialLatLongByAddress(address);
    }
  }

  public static async getOfficialLatLongByAddress(address: string) {
    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/geocode/json',
        {
          params: {
            address,
            key: process.env.GOOGLE_PLACE_KEY,
          },
        },
      );
      const responseData = response.data;
      const result = responseData.results[0];
      return {
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        address: result.formatted_address,
      };
    } catch (e) {
      console.log('get official lat long by address err', e);
      throw e;
    }
  }

  private static setGmapBlockedAt(timestamp: number) {
    if (timestamp <= this.blockedAt) return;
    this.blockedAt = timestamp;
    mmkv.set(GMAP_BLOCKED_AT, this.blockedAt);
  }

  private static setCocCocBlockedAt(timestamp: number) {
    if (timestamp <= this.cocCocBlockedAt) return;
    this.cocCocBlockedAt = timestamp;
    mmkv.set(COCCOC_BLOCKED_AT, this.cocCocBlockedAt);
  }
}
