import { createAction } from '@reduxjs/toolkit';
import {
  SIGN_OUT,
  UPDATE_USER_DATA,
  UPDATE_USER_TOKEN,
} from './actions.constant';

export const signOut = createAction(SIGN_OUT);

export const updateData = createAction(UPDATE_USER_DATA, (data?: unknown) => ({
  payload: data,
}));

export const updateToken = createAction(UPDATE_USER_TOKEN, (token: string) => ({
  payload: token,
}));
