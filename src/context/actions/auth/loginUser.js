import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LOGIN_FAIL,
  LOGIN_LOADING,
  LOGIN_SUCCESS,
} from '../../../constants/actionTypes';
import axiosInstance from '../../../helpers/axiosInstance';

export default ({password, phoneNumber}) =>
  dispatch => {
    dispatch({
      type: LOGIN_LOADING,
    });
    axiosInstance
      .post('user/login', {
        password,
        phoneNumber,
      })
      .then(res => {
        console.log('autho', res.data.Authorization);
        console.log('autho', res.data.User);

        AsyncStorage.setItem('token', res.data.Authorization);
        AsyncStorage.setItem('user', JSON.stringify(res.data.User));
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data,
        });
      })
      .catch(err => {
        console.log(err);
        dispatch({
          type: LOGIN_FAIL,
          payload: err.response
            ? err.response.data
            : {error: 'Something went wrong, try agin'},
        });
      });
  };
