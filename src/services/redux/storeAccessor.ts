// services/redux/storeAccessor.ts
import type { Store } from "@reduxjs/toolkit";
import type { RootState } from "./store";

let _store: Store<RootState> | null = null;

export const setStore = (store: Store<RootState>) => {
  _store = store;
};

export const getStore = (): Store<RootState> => {
  if (!_store) {
    throw new Error("Store has not been initialized yet. Make sure to call setStore first.");
  }
  return _store;
};