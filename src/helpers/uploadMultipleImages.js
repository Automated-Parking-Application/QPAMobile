import axios from '../helpers/axiosInstance';
import {Platform} from 'react-native';

export default files => onSuccess => onError => {
  try {
    const data = new FormData();
    files.forEach(file => {
      data.append('files', {
        name: file.filename || new Date().getTime(),
        filename: new Date().getTime(),
        type: file.mime,
        mime: file.mime,
        data: file.data,
        uri:
          (Platform.OS === 'ios'
            ? file.sourceURL?.replace('file://', '')
            : file.sourceURL) || file.path,
      });
    });

    console.log(data);

    // onError(null)

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
