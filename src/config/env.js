// import {DEV_BACKEND_URL, PROD_BACKEND_URL} from '@env';

const devEnvironmentVariables = {
  BACKEND_URL: 'http://localhost:8080/',
};

const prodEnvironmentVariables = {
  BACKEND_URL: 'https://truly-contacts.herokuapp.com/api/',
};

export default __DEV__ ? devEnvironmentVariables : prodEnvironmentVariables;
