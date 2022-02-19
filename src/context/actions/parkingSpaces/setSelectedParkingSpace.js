import {SET_SELECTED_PARKING_SPACE} from '../../../constants/actionTypes';

export default ({parkingSpace}) =>
  dispatch => {
    dispatch({
      type: SET_SELECTED_PARKING_SPACE,
      payload: parkingSpace,
    });
  };
