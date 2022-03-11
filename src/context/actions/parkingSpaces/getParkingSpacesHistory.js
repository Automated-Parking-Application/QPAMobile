import {
  GET_PARKING_SPACES_HISTORY_FAIL,
  GET_PARKING_SPACES_HISTORY_SUCCESS,
  GET_PARKING_SPACES_HISTORY_LOADING,
} from '../../../constants/actionTypes';
import axios from '../../../helpers/axiosInstance';

export default (id) => (dispatch) => {
  dispatch({
    type: GET_PARKING_SPACES_HISTORY_LOADING,
  });

  axios
    .get(`/parking-space/${id}/history`)
    .then((res) => {
      dispatch({
        type: GET_PARKING_SPACES_HISTORY_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_PARKING_SPACES_HISTORY_FAIL,
        payload: err.response
          ? err.response.data
          : {error: 'Something went wrong, try again'},
      });
    });
};
