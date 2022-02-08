import {
  REMOVE_PARKING_LOT_ATTENDANT_FAIL,
  REMOVE_PARKING_LOT_ATTENDANT_LOADING,
  REMOVE_PARKING_LOT_ATTENDANT_SUCCESS,
} from '../../../constants/actionTypes';
import axios from '../../../helpers/axiosInstance';

export default ({userId, parkingId}) =>
  dispatch =>
  onSuccess => {
    dispatch({
      type: REMOVE_PARKING_LOT_ATTENDANT_LOADING,
    });

    axios
      .delete(`/parking-space/${parkingId}/user/${userId}`)
      .then(() => {
        dispatch({
          type: REMOVE_PARKING_LOT_ATTENDANT_SUCCESS,
          payload: {
            userId,
            parkingId,
          },
        });
        onSuccess();
      })
      .catch(err => {
        dispatch({
          type: REMOVE_PARKING_LOT_ATTENDANT_FAIL,
          payload: err.response
            ? err.response.data
            : {error: 'Something went wrong, try again'},
        });
      });
  };
