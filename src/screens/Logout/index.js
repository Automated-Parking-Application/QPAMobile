import React, {useContext, useEffect} from 'react';
import {ActivityIndicator} from 'react-native';
import logoutUser from '../../context/actions/auth/logoutUser';
import {GlobalContext} from '../../context/Provider';
import {LOGIN} from '../../constants/routeNames';

const Logout = ({navigation}) => {
  const {authDispatch} = useContext(GlobalContext);

  useEffect(() => {
    logoutUser()(authDispatch);
    navigation.navigate(LOGIN);
  }, []);

  return <ActivityIndicator />;
};

export default Logout;
