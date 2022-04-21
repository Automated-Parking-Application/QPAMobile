import {
  DELETE_PARKING_SPACE_FAIL,
  DELETE_PARKING_SPACE_LOADING,
  DELETE_PARKING_SPACE_SUCCESS,
} from '../../../constants/actionTypes';
import axios from '../../../helpers/axiosInstance';

export default id => dispatch => onSuccess => onError => {
  dispatch({
    type: DELETE_PARKING_SPACE_LOADING,
  });

  axios
    .delete(`/parking-space/${id}`)
    .then(() => {
      dispatch({
        type: DELETE_PARKING_SPACE_SUCCESS,
        payload: id,
      });
      onSuccess();
    })
    .catch(err => {
      dispatch({
        type: DELETE_PARKING_SPACE_FAIL,
        payload: err.response
          ? err.response.data
          : {error: 'Something went wrong, try again'},
      });
      onError(err.response ? err.response.data : 'Something went wrong');
    });
};
