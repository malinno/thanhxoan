import { configureStore } from '@reduxjs/toolkit';
import { Middleware, Reducer } from 'redux';
import {
  PERSIST,
  PersistConfig,
  persistCombineReducers,
  persistStore,
} from 'redux-persist';
import storage from '../storages/redux-storage';
import userReducer from './reducers/user.reducer';

const doCreateStore = (
  reducer: Reducer,
  preloadedState: Record<string, any>,
) => {
  const middleware: Middleware[] = [];

  const store = configureStore({
    reducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [PERSIST],
        },
      }),
    // .concat(middleware)
    preloadedState,
  });
  return store;
};

const configStore = (
  initialState: Record<string, any>,
  onRehydrationCompleted: () => void,
) => {
  const config: PersistConfig<any> = {
    key: 'root',
    storage,
    blacklist: ['user']
  };
  const reducer = persistCombineReducers(config, {
    user: userReducer,
  });
  const store = doCreateStore(reducer, initialState);
  const persistor = persistStore(store, null, onRehydrationCompleted);
  return { store, persistor };
};

const updateStore = async () => {};

export const { store, persistor } = configStore({}, () => updateStore());
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
