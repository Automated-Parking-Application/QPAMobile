import axios from '../helpers/axiosInstance';

export default file => onSuccess => onError => {
  console.log(file);
  const data = new FormData();
  data.append('file', {
    name: file.filename,
    mime: file.mime,
    uri:
      Platform.OS === 'ios'
        ? file.sourceURL?.replace('file://', '')
        : file.sourceURL,
  });

  console.log('data', data);

  axios
    .post('/resource/upload', data, {
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(async data => {
      console.log(data);
      onSuccess(data.data);
    })
    .catch(error => {
      onError(error);
      console.log('error', error);
    });
};
