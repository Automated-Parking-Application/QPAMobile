import axios from '../helpers/axiosInstance';
import {Platform} from 'react-native';

export default files => onSuccess => onError => {
  try {
    const data = new FormData();
    files.forEach(file => {
      data.append('files', {
        name: file.fileName,
        mime: file.type,
        type: file.type,
        uri:
          Platform.OS === 'ios' ? file.uri?.replace('file://', '') : file.uri,
      });
    });

    axios
      .post('/resource/upload/batch', data, {
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
      });
  } catch (error) {
    console.log('error >>', error);
  }
};
