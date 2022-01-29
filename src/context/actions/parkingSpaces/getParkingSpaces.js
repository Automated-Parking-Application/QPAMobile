import {
  GET_PARKING_SPACES_FAIL,
  GET_PARKING_SPACES_LOADING,
  GET_PARKING_SPACES_SUCCESS,
} from '../../../constants/actionTypes';
import axios from '../../../helpers/axiosInstance';

export default () => (dispatch) => {
  dispatch({
    type: GET_PARKING_SPACES_LOADING,
  });

  axios
    .get('/parking-space/')
    .then((res) => {
      dispatch({
        type: GET_PARKING_SPACES_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_PARKING_SPACES_FAIL,
        payload: err.response
          ? err.response.data
          : {error: 'Something went wrong, try again'},
      });
    });
};
