import { AsyncStorage } from "react-native";
import { applyMiddleware, compose, createStore } from "redux";
import { persistCombineReducers, persistStore } from "redux-persist";

export type Entry = {
  id: number;
  title: string;
  description: string;
  maxParticipants: number;
};

export type User = {
  activated: boolean;
  level: number;
  email: string;
  name: string;
  username: string;
  image: string;
  thumbnail: string;
  bio: string;
  pushtoken: string;
};
export type Device = {
  loginToken: number;
  logged: boolean;
  entries: Entry[];
  user: User | null;
};

const initDevice = {
  loginToken: "token" + Math.round(Math.random() * Number.MAX_SAFE_INTEGER),
  logged: false,
  goals: [],
  entries: [],
  user: null,
};

const deviceReducer = (
  state: Device = initDevice,
  action: { type: string; value: any }
) => {
  switch (action.type) {
    case "PURGE": {
      return initDevice;
    }

    case "ADD_ENTRY": {
      return { ...state, entries: [...state.entries, action.value] };
    }

    case "UPDATE_ENTRY": {
      return {
        ...state,
        entries: state.entries.map((entry) =>
          entry.id === action.value.id ? action.value : entry
        ),
      };
    }

    case "SET_USER": {
      return { ...state, user: action.value };
    }

    case "SET_ENTRIES": {
      return { ...state, entries: action.value };
    }
    case "DELETE_ENTRY": {
      return {
        ...state,
        entries: state.entries.filter((a) => a.id !== action.value),
      };
    }

    case "SET_LOGIN_TOKEN": {
      return { ...state, loginToken: action.value };
    }

    case "SET_LOGGED": {
      return { ...state, logged: action.value };
    }
    default:
      return state;
  }
};

const config = {
  key: "v1",
  storage: AsyncStorage,
  whitelist: ["device"],
};

const reducers = {
  device: deviceReducer,
};

const rootReducer = persistCombineReducers(config, reducers);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware()));
const persistor = persistStore(store);

export { persistor, store };
