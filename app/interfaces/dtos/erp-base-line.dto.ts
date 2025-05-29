import { LineActionDto } from './line-action.type';

export type ErpBaseLineDto<T> = {
  [key in LineActionDto]?: key extends 'remove'
    ? number[]
    : key extends 'update'
    ? Record<string, T>
    : T[];
};
