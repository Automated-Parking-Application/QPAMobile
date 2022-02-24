import axios from '../helpers/axiosInstance';
import { Platform } from 'react-native';

export default files => onSuccess => onError => {
  const data = new FormData();
  files.forEach(file => {
    data.append('files', {
      name: file.filename,
      mime: file.mime,
      uri:
        Platform.OS === 'ios'
          ? file.sourceURL?.replace('file://', '')
          : file.sourceURL,
    });
  });

  axios
    .post('/resource/upload/batch', data, {
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(async data => {
      onSuccess(data.data);
      console.log(data.data);
    })
    .catch(error => {
      onError(error);
      console.log('error', error);
    });
};
