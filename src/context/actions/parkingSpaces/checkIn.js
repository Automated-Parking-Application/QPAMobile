import axios from '../../../helpers/axiosInstance';

export default ({id, plateNumber, attachment, vehicleType, codeId, externalId}) =>
  onSuccess =>
  onError => {
    const requestPayload = {
      plateNumber,
      attachment,
      vehicleType,
      codeId,
      externalId
    };

    axios
      .post(`/parking-space/${id}/check-in`, requestPayload)
      .then(res => {
        onSuccess(res);
      })
      .catch(err => {
        console.log(err);
        onError(
          err.response
            ? err.response.data
            : {error: 'Something went wrong, try again'},
        );
      });
  };
