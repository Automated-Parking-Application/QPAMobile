import {
  CREATE_PARKING_SPACE_FAIL,
  CREATE_PARKING_SPACE_SUCCESS,
  CREATE_PARKING_SPACE_LOADING,
} from '../../../constants/actionTypes';
import axios from '../../../helpers/axiosInstance';

export default form => dispatch => onSuccess => {
  const requestPayload = {
    image: form.image || '',
    name: form.name || '',
    address: form.address || '',
    description: form.description || '',
    startTime: form.startTime || '',
    endTime: form.endTime || '',
    postingTime: form.postingTime || '',
  };

  dispatch({
    type: CREATE_PARKING_SPACE_LOADING,
  });

  axios
    .post('/parking-space/create', requestPayload)
    .then(res => {
      dispatch({
        type: CREATE_PARKING_SPACE_SUCCESS,
        payload: res.data,
      });

      onSuccess();
    })
    .catch(err => {
      dispatch({
        type: CREATE_PARKING_SPACE_FAIL,
        payload: err.response
          ? err.response.data
          : {error: 'Something went wrong, try again'},
      });
    });
};
