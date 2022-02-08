import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  PARKING_SPACE_DETAIL,
  PARKING_SPACE_LIST,
  CREATE_PARKING_SPACE,
  LOGOUT,
  SETTINGS,
  PARKING_LOT_ATTENDANT_LIST
} from '../constants/routeNames';
import Contacts from '../screens/Contacts';
import ContactDetails from '../screens/ContactDetail';
import ParkingLotAttendants from '../screens/ParkingLotAttendants'
import CreateContact from '../screens/CreateContact';
import Settings from '../screens/Settings';
import Logout from '../screens/Logout';

const HomeNavigator = () => {
  const HomeStack = createStackNavigator();
  return (
    <HomeStack.Navigator initialRouteName={PARKING_SPACE_LIST}>
      <HomeStack.Screen name={PARKING_SPACE_LIST} component={Contacts} />
      <HomeStack.Screen name={PARKING_SPACE_DETAIL} component={ContactDetails} />
      <HomeStack.Screen name={PARKING_LOT_ATTENDANT_LIST} component={ParkingLotAttendants} />
      <HomeStack.Screen name={CREATE_PARKING_SPACE} component={CreateContact} />
      <HomeStack.Screen name={SETTINGS} component={Settings} />
      <HomeStack.Screen name={LOGOUT} component={Logout} />
    </HomeStack.Navigator>
  );
};
export default HomeNavigator;
