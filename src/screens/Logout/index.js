import React, {useContext, useEffect} from 'react';
import {ActivityIndicator} from 'react-native';
import logoutUser from '../../context/actions/auth/logoutUser';
import { useDispatch } from "react-redux";
import {LOGIN} from '../../constants/routeNames';

const Logout = ({navigation}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logoutUser());
    navigation.navigate(LOGIN);
  }, []);

  return <ActivityIndicator />;
};

export default Logout;
