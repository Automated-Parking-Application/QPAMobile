import {
  GET_PARKING_LOT_ATTENDANTS_LOADING,
  GET_PARKING_LOT_ATTENDANTS_FAIL,
  GET_PARKING_LOT_ATTENDANTS_SUCCESS,
} from '../../constants/actionTypes';
import defaultState from '../initialStates/parkingLotAttendantsInitialState';

const parkingLotAttendants = (state = defaultState, {type, payload}) => {
  switch (type) {
    case GET_PARKING_LOT_ATTENDANTS_LOADING:
      return {
        ...state,
        parkingLotAttendants: {
          ...state.parkingLotAttendants,
          loading: true,
          error: null,
        },
      };

    case GET_PARKING_LOT_ATTENDANTS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: {
          [payload.parkingId]: payload.data,
        },
        error: null,
      };

    case GET_PARKING_LOT_ATTENDANTS_FAIL:
      return {
        ...state,
        parkingLotAttendants: {
          ...state.parkingLotAttendants,
          loading: false,
          error: payload,
        },
      };
    default:
      return state;
  }
};

export default parkingLotAttendants;
