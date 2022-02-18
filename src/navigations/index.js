import React, {useEffect, useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator} from 'react-native';
import {navigationRef} from './SideMenu/RootNavigator';
import SplashScreen from 'react-native-splash-screen';
import Tabs from "./BottomTabs"
const AppNavContainer = () => {
  const isLoggedIn = useSelector(state => {
    return state.auth.isLoggedIn;
  });
  const [isAuthenticated, setIsAuthenticated] = React.useState(isLoggedIn);
  const [authLoaded, setAuthLoaded] = React.useState(false);

  const getUser = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        setAuthLoaded(true);

        setIsAuthenticated(true);
      } else {
        setAuthLoaded(true);

        setIsAuthenticated(false);
      }
    } catch (error) {}
  };
  useEffect(() => {
    getUser();
  }, [isLoggedIn]);

  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <>
      {authLoaded ? (
        <NavigationContainer ref={navigationRef}>
          {isLoggedIn && isAuthenticated ? (
            <DrawerNavigator />
          ) : (
            <AuthNavigator />
          )}
        </NavigationContainer>
      ) : (
        <ActivityIndicator />
      )}
    </>
  );
};

export default AppNavContainer;
