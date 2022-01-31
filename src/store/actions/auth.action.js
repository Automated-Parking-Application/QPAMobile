import * as ActionTypes from './ActionTypes';
import { signIn } from '@/services';
import Alert from '@/utils/alert';
import { Constants } from '@/commons';

export const login = (email = '', password = '') => dispatch => {
  dispatch({ type: ActionTypes.LOGIN });

  return signIn(email, password)
    .then(res => dispatch({ type: ActionTypes.LOGIN_SUCCESS, auth: res }))
    .catch(message => {
      Alert.error(Constants.AlertFailed, message || 'Login Fail');
      dispatch({ type: ActionTypes.LOGIN_FAILED });
    });
};

export const logout = () => dispatch => {
  dispatch({ type: ActionTypes.LOGOUT });
};
