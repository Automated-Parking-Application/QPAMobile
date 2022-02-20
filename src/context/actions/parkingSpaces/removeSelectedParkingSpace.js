import {REMOVE_SELECTED_PARKING_SPACE} from '../../../constants/actionTypes';

export default () =>
  dispatch => {
    dispatch({
      type: REMOVE_SELECTED_PARKING_SPACE,
    });
  };
