import axios from '../helpers/axiosInstance';
import {Platform} from 'react-native';

export default file => onSuccess => onError => {
  const data = new FormData();
  data.append('file', {
    name: file.filename,
    mime: file.mime,
    uri:
      Platform.OS === 'ios'
        ? file.sourceURL?.replace('file://', '')
        : file.sourceURL,
  });

  axios
    .post('/resource/upload', data, {
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(async res => {
      onSuccess(res.data);
    })
    .catch(error => {
      onError(error);
      console.log('error', error);
    });
};
