import {
  CREATE_PARKING_SPACE_FAIL,
  CREATE_PARKING_SPACE_LOADING,
  CREATE_PARKING_SPACE_SUCCESS,
  DELETE_PARKING_SPACE_LOADING,
  DELETE_PARKING_SPACE_SUCCESS,
  GET_PARKING_SPACES_FAIL,
  GET_PARKING_SPACES_LOADING,
  GET_PARKING_SPACES_SUCCESS,
  EDIT_PARKING_SPACE_LOADING,
  EDIT_PARKING_SPACE_SUCCESS,
  EDIT_PARKING_SPACE_FAIL,
  GET_PARKING_LOT_ATTENDANTS_LOADING,
  GET_PARKING_LOT_ATTENDANTS_ERROR,
  GET_PARKING_LOT_ATTENDANTS_SUCCESS
} from '../../constants/actionTypes';
import defaultState from '../initialStates/parkingSpacesInitialState';

const parkingSpaces = (state = defaultState, {type, payload}) => {
  switch (type) {
    case EDIT_PARKING_SPACE_LOADING: {
      return {
        ...state,
        createParkingSpace: {
          ...state.createParkingSpace,
          loading: true,
          error: null,
        },
      };
    }

    case EDIT_PARKING_SPACE_SUCCESS: {
      return {
        ...state,
        createParkingSpace: {
          ...state.createParkingSpace,
          loading: false,
          error: null,
        },

        getParkingSpaces: {
          ...state.getParkingSpaces,
          loading: false,
          data: state.getParkingSpaces.data.map(item => {
            if (item.id === payload.id) {
              return payload;
            } else {
              return item;
            }
          }),
          error: null,
        },
      };
    }

    case EDIT_PARKING_SPACE_FAIL: {
      return {
        ...state,
        createParkingSpace: {
          ...state.createParkingSpace,
          loading: false,
          error: null,
        },
      };
    }

    case DELETE_PARKING_SPACE_LOADING: {
      return {
        ...state,
        deleteParkingSpace: {
          ...state.deleteParkingSpace,
          loading: true,
          error: null,
        },
      };
    }

    case DELETE_PARKING_SPACE_SUCCESS: {
      return {
        ...state,
        deleteParkingSpace: {
          ...state.deleteParkingSpace,
          loading: false,
          error: null,
        },

        getParkingSpaces: {
          ...state.getParkingSpaces,
          loading: false,
          data: state.getParkingSpaces.data.filter(item => item.id !== payload),
          error: null,
        },
      };
    }

    // case CREATE_PARKING_SPACE_FAIL:
    //   return {
    //     ...state,
    //     createParkingSpace: {
    //       ...state.createParkingSpace,
    //       loading: false,
    //       error: null,
    //     },
    //   };
    case CREATE_PARKING_SPACE_LOADING:
      return {
        ...state,
        createParkingSpace: {
          ...state.createParkingSpace,
          loading: true,
          error: null,
        },
      };
    case CREATE_PARKING_SPACE_SUCCESS:
      return {
        ...state,
        createParkingSpace: {
          ...state.createParkingSpace,
          loading: false,
          error: null,
          data: payload,
        },

        getParkingSpaces: {
          ...state.getParkingSpaces,
          loading: false,
          data: [payload, ...state.getParkingSpaces.data],
          error: null,
        },
      };

    case CREATE_PARKING_SPACE_FAIL:
      return {
        ...state,
        createParkingSpace: {
          ...state.createParkingSpace,
          loading: false,
          error: payload,
        },
      };

    case GET_PARKING_SPACES_LOADING:
      return {
        ...state,
        getParkingSpaces: {
          ...state.getParkingSpaces,
          loading: true,
          error: null,
        },
      };

    case GET_PARKING_SPACES_SUCCESS:
      return {
        ...state,
        getParkingSpaces: {
          ...state.getParkingSpaces,
          loading: false,
          data: payload,
          error: null,
        },
      };

    case GET_PARKING_SPACES_FAIL:
      return {
        ...state,
        getParkingSpaces: {
          ...state.getParkingSpaces,
          loading: false,
          error: payload,
        },
      };


    default:
      return state;
  }
};

export default parkingSpaces;
