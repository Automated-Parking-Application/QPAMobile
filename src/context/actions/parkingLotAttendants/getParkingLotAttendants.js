import {
  GET_PARKING_LOT_ATTENDANTS_FAIL,
  GET_PARKING_LOT_ATTENDANTS_LOADING,
  GET_PARKING_LOT_ATTENDANTS_SUCCESS,
} from '../../../constants/actionTypes';
import axios from '../../../helpers/axiosInstance';

export default id => dispatch => {
  dispatch({
    type: GET_PARKING_LOT_ATTENDANTS_LOADING,
  });

  axios
    .get(`/parking-space/${id}/user`)
    .then(res => {
      console.log(res);
      dispatch({
        type: GET_PARKING_LOT_ATTENDANTS_SUCCESS,
        payload: {
          parkingId: id,
          data: res.data
        },
      });
    })
    .catch(err => {
      dispatch({
        type: GET_PARKING_LOT_ATTENDANTS_FAIL,
        payload: err.response
          ? err.response.data
          : { error: 'Something went wrong, try again' },
      });
    });
};
