import {UPDATE_PARKING_SPACES_DETAIL} from '../../../constants/actionTypes';

export default ({parkingSpace}) =>
  dispatch => {
    dispatch({
      type: UPDATE_PARKING_SPACES_DETAIL,
      payload: parkingSpace,
    });
  };
