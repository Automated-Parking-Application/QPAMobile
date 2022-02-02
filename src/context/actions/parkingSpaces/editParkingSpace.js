import {
  EDIT_PARKING_SPACE_FAIL,
  EDIT_PARKING_SPACE_SUCCESS,
  EDIT_PARKING_SPACE_LOADING,
} from '../../../constants/actionTypes';
import axios from '../../../helpers/axiosInstance';
import moment from 'moment';

export default (form, id) => dispatch => onSuccess => {
  dispatch({
    type: EDIT_PARKING_SPACE_LOADING,
  });

  console.log(form);

  axios
    .put(`/parking-space/${id}`, {
      ...form,
      startTime: moment(form.startTime || '').valueOf(),
      endTime: moment(form.endTime || '').valueOf(),
    })
    .then(res => {
      dispatch({
        type: EDIT_PARKING_SPACE_SUCCESS,
        payload: res.data,
      });

      onSuccess(res.data);
    })
    .catch(err => {
      console.log('err', err);
      dispatch({
        type: EDIT_PARKING_SPACE_FAIL,
        payload: err.response
          ? err.response.data
          : {error: 'Something went wrong, try again'},
      });
    });
};
