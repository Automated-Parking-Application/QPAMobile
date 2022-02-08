import {
  GET_PARKING_LOT_ATTENDANTS_LOADING,
  GET_PARKING_LOT_ATTENDANTS_FAIL,
  GET_PARKING_LOT_ATTENDANTS_SUCCESS,
  REMOVE_PARKING_LOT_ATTENDANT_FAIL,
  REMOVE_PARKING_LOT_ATTENDANT_LOADING,
  REMOVE_PARKING_LOT_ATTENDANT_SUCCESS,
} from '../../constants/actionTypes';
import defaultState from '../initialStates/parkingLotAttendantsInitialState';

const parkingLotAttendants = (state = defaultState, {type, payload}) => {
  switch (type) {
    case GET_PARKING_LOT_ATTENDANTS_LOADING:
    case REMOVE_PARKING_LOT_ATTENDANT_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_PARKING_LOT_ATTENDANTS_FAIL:
    case REMOVE_PARKING_LOT_ATTENDANT_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
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

    case REMOVE_PARKING_LOT_ATTENDANT_SUCCESS:
      const {userId, parkingId} = payload;
      return {
        ...state,
        loading: false,
        data: {
          [parkingId]: state.data[parkingId].filter(
            user => user.user.id !== userId,
          ),
        },
        error: null,
      };

    default:
      return state;
  }
};

export default parkingLotAttendants;
