import React from 'react';
import {useSelector} from 'react-redux';
import {createStackNavigator} from '@react-navigation/stack';
import {
  PARKING_SPACE_DETAIL,
  PARKING_SPACE_LIST,
  CREATE_PARKING_SPACE,
  LOGOUT,
  SETTINGS,
  PARKING_LOT_ATTENDANT_LIST,
  ADD_PARKING_LOT_ATTENDANT,
  REQUEST_QR_CODE,
} from '../constants/routeNames';
import ParkingSpaceList from '../screens/ParkingSpaceList';
import Contacts from '../screens/Contacts';
import ContactDetails from '../screens/ContactDetail';
import ParkingLotAttendants from '../screens/ParkingLotAttendants';
import CreateContact from '../screens/CreateContact';
import Settings from '../screens/Settings';
import Logout from '../screens/Logout';
import AddParkingLotAttendant from '../screens/AddParkingLotAttendant';
import RequestQR from '../screens/RequestQR';

const HomeNavigator = () => {
  const isAdmin =
    useSelector(state => state.auth.data?.User?.roleByRoleId?.name) === 'ADMIN';
  const isParkingLotAttendant =
    useSelector(state => state.auth.data?.User?.roleByRoleId?.name) ===
    'PARKING_ATTENDANT';

  const HomeStack = createStackNavigator();
  return isAdmin ? (
    <HomeStack.Navigator initialRouteName={PARKING_SPACE_LIST}>
      <HomeStack.Screen name={PARKING_SPACE_LIST} component={Contacts} />
      <HomeStack.Screen
        name={PARKING_SPACE_DETAIL}
        component={ContactDetails}
      />
      <HomeStack.Screen
        name={PARKING_LOT_ATTENDANT_LIST}
        component={ParkingLotAttendants}
      />
      <HomeStack.Screen
        name={ADD_PARKING_LOT_ATTENDANT}
        component={AddParkingLotAttendant}
      />
      <HomeStack.Screen name={REQUEST_QR_CODE} component={RequestQR} />
      <HomeStack.Screen name={CREATE_PARKING_SPACE} component={CreateContact} />
      <HomeStack.Screen name={SETTINGS} component={Settings} />
      <HomeStack.Screen name={LOGOUT} component={Logout} />
    </HomeStack.Navigator>
  ) : (
    isParkingLotAttendant && (
      <HomeStack.Navigator initialRouteName={PARKING_SPACE_LIST}>
        <HomeStack.Screen
          name={PARKING_SPACE_LIST}
          component={ParkingSpaceList}
        />
        <HomeStack.Screen name={SETTINGS} component={Settings} />
        <HomeStack.Screen name={LOGOUT} component={Logout} />
      </HomeStack.Navigator>
    )
  );
};
export default HomeNavigator;
