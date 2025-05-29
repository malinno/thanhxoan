import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import { signOut, updateData, updateToken } from '../actions/user.action';

const initialState = {};

const userReducer = createReducer(initialState, builder =>
  builder
    .addCase(updateData, (state, action) => {
      return {
        ...state,
        data: action.payload,
      };
    })
    .addCase(updateToken, (state, action) => {
      return {
        ...state,
        token: action.payload,
      };
    })
    .addCase(signOut, (state, action) => {
      return initialState;
    }),
);

export default userReducer;
