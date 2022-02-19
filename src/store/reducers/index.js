import {persistCombineReducers} from 'redux-persist';
import {createWhitelistFilter} from 'redux-persist-transform-filter';
import storage from '@react-native-async-storage/async-storage';
import parkingSpaces from './parkingSpaces';
import parkingLotAttendants from './parkingLotAttendants';
import auth from './auth';

import authInitialState from '../initialStates/authState';

const config = {
  key: 'root',
  storage,
  // whitelist: ['auth', 'parkingSpaces', 'parkingLotAttendants'],
  // transforms: [
  //   createWhitelistFilter('auth', ['auth']),
  //   createWhitelistFilter('parkingSpaces', ['parkingSpaces']),
  //   createWhitelistFilter('parkingLotAttendants', ['parkingLotAttendants']),
  // ],
};

const appReducer = persistCombineReducers(config, {
  auth,
  parkingSpaces,
  parkingLotAttendants,
});

export default reducers = (state, action) => {
  if (action.type === 'RESET_STORE') {
    const {_persist} = state;
    state = {
      _persist,
      auth: {
        ...authInitialState,
      },
    };
  }
  return appReducer(state, action);
};
