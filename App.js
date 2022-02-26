/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import 'react-native-gesture-handler';
import AppNavContainer from './src/navigations';
import GlobalProvider from './src/context/Provider';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import ZocialIcon from 'react-native-vector-icons/Zocial';
import OcticonIcon from 'react-native-vector-icons/Octicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FAIcon5 from 'react-native-vector-icons/FontAwesome5';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { store, persistor } from './src/store';


ZocialIcon.loadFont();
OcticonIcon.loadFont();
MaterialIcon.loadFont();
MaterialCommunityIcon.loadFont();
FoundationIcon.loadFont();
EvilIcon.loadFont();
EntypoIcon.loadFont();
ZocialIcon.loadFont();
FAIcon.loadFont();
SimpleLineIcon.loadFont();
Feather.loadFont();
AntDesign.loadFont();
Fontisto.loadFont();
Ionicon.loadFont();
const App = () => {

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AppNavContainer />
      </PersistGate>
    </Provider>
  );
};

export default App;
