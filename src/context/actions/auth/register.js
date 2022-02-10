import {
  REGISTER_FAIL,
  REGISTER_LOADING,
  REGISTER_SUCCESS,
  CLEAR_AUTH_STATE,
} from '../../../constants/actionTypes';
import axiosInstance from '../../../helpers/axiosInstance';

export const clearAuthState = () => (dispatch) => {
  dispatch({
    type: CLEAR_AUTH_STATE,
  });
};

export default ({
  email,
  address,
  password,
  phoneNumber,
  firstName: first_name,
  lastName: last_name,
}) => (dispatch) => (onSuccess) => {
  dispatch({
    type: REGISTER_LOADING,
  });
  axiosInstance
    .post('user/register', {
      email,
      address,
      password,
      phoneNumber,
      first_name,
      last_name,
    })
    .then((res) => {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });

      onSuccess(res.data);
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response
          ? err.response.data
          : {error: 'Something went wrong, try agin'},
      });
    });
};
