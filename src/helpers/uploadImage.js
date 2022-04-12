import axios from '../helpers/axiosInstance';
import {Platform} from 'react-native';

export default file => onSuccess => onError => {
  const data = new FormData();
  data.append('file', {
    name: file.fileName,
    mime: file.type,
    type: file.type,
    uri: Platform.OS === 'ios' ? file.uri?.replace('file://', '') : file.uri,
  });

  axios
    .post('/resource/upload', data, {
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(async res => {
      console.log('res', res);
      onSuccess(res.data);
    })
    .catch(error => {
      onError(error);
      console.log('error', error);
    });
};
