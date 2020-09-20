import { AsyncStorage } from "react-native";
import { applyMiddleware, compose, createStore } from "redux";
import { persistCombineReducers, persistStore } from "redux-persist";

export type Event = {
  id: number;
  title: string;
  date: number;
  endDate: number;
  description: string;
  maxParticipants: number;
  participants: Participant[];
};

export const ATTENDANCE_MAYBE = 1;
export const ATTENDANCE_YES = 2;
export const ATTENDANCE_NO = 0;
type ATTENDANCE_YES = 2;
type ATTENDANCE_MAYBE = 1;
type ATTENDANCE_NO = 0;

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
export type Participant = {
  eventId: number;
  name: string;
  attendance: ATTENDANCE_YES | ATTENDANCE_MAYBE | ATTENDANCE_NO;
};
export type Device = {
  loginToken: number;
  logged: boolean;
  events: Event[];
  user: User | null;
};

const initDevice = {
  loginToken: Math.round(Math.random() * Number.MAX_SAFE_INTEGER),
  logged: false,
  goals: [],
  events: [],
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

    case "ADD_EVENT": {
      return { ...state, events: [...state.events, action.value] };
    }

    case "UPDATE_EVENT": {
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.value.id ? action.value : event
        ),
      };
    }

    case "SET_USER": {
      return { ...state, user: action.value };
    }

    case "SET_EVENTS": {
      return { ...state, events: action.value };
    }
    case "DELETE_EVENT": {
      return {
        ...state,
        events: state.events.filter((a) => a.id !== action.value),
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
