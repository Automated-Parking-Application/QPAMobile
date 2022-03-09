import {
  UPDATE_PROFILE_LOADING,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
} from '../../../constants/actionTypes';
import axios from '../../../helpers/axiosInstance';

export default form => dispatch => onSuccess => {
  dispatch({
    type: UPDATE_PROFILE_LOADING,
  });

  axios
    .post('parking-space/profile', form)
    .then(res => {
      dispatch({
        type: UPDATE_PROFILE_SUCCESS,
        payload: res.data,
      });
      console.log(res)

      onSuccess();
    })
    .catch(err => {
      console.log(err)

      dispatch({
        type: UPDATE_PROFILE_FAIL,
        payload: err.response
          ? err.response.data
          : {error: 'Something went wrong, try again'},
      });
    });
};
