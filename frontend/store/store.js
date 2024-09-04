import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./authSlice";
import userReducer from "./userSlice";

const authPersistConfig = {
    key: 'auth',
    storage,
};

const userPersistConfig = {
    key: 'user',
    storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        user: persistedUserReducer
    }
});

export const persistor = persistStore(store);

export default store;
