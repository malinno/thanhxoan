import { MMKV } from 'react-native-mmkv';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';

const storage = new MMKV({
  id: 'zustand',
});

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: name => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: name => {
    return storage.delete(name);
  },
};

export default zustandStorage;
