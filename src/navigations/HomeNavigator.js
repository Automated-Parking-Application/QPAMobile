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
  CHECKED_IN_PARKING_SPACE,
  PARKING_RESERVATION_DETAIL,
  UPDATE_PROFILE,
  PARKING_SPACE_REPORT,
  SEARCH_VEHICLE
} from '../constants/routeNames';
import ParkingSpaceList from '../screens/ParkingSpaceList';
import Contacts from '../screens/Contacts';
import ContactDetails from '../screens/ContactDetail';
import ParkingSpaceDetail from '../screens/ParkingSpaceDetail';
import ParkingLotAttendants from '../screens/ParkingLotAttendants';
import CreateContact from '../screens/CreateContact';
import Settings from '../screens/Settings';
import Logout from '../screens/Logout';
import AddParkingLotAttendant from '../screens/AddParkingLotAttendant';
import ParkingReservationDetail from '../screens/ParkingReservationDetail';
import RequestQR from '../screens/RequestQR';
import Tabs from './BottomTabs';
import UpdateProfile from '../screens/UpdateProfile';
import ParkingSpaceReport from '../screens/ParkingSpaceReport';
import SearchVehicle from "../screens/SearchVehicle";

const getCommon = Stack => {
  return [
    <Stack.Screen
      key="PARKING_SPACE_REPORT"
      name={PARKING_SPACE_REPORT}
      component={ParkingSpaceReport}
    />,
  ];
};

const HomeNavigator = () => {
  const isAdmin =
    useSelector(state => state.auth.data?.User?.roleByRoleId?.name) === 'ADMIN';
  const isParkingLotAttendant =
    useSelector(state => state.auth.data?.User?.roleByRoleId?.name) ===
    'PARKING_ATTENDANT';
  const hasCheckedInParkingSpace =
    typeof useSelector(
      state => state?.parkingSpaces?.selectedParkingSpace?.id,
    ) === 'number';

  const {address, fullName, avatar} =
    useSelector(state => state.auth.data?.User) || {};
  const isLackedProfile = !address && !fullName && !avatar;

  const HomeStack = createStackNavigator();

  const common = getCommon(HomeStack);
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
      {common}
    </HomeStack.Navigator>
  ) : (
    isParkingLotAttendant &&
      (isLackedProfile ? (
        <HomeStack.Navigator initialRouteName={UPDATE_PROFILE}>
          <HomeStack.Screen name={UPDATE_PROFILE} component={UpdateProfile} />
        </HomeStack.Navigator>
      ) : hasCheckedInParkingSpace ? (
        <HomeStack.Navigator initialRouteName={CHECKED_IN_PARKING_SPACE}>
          <HomeStack.Screen name={CHECKED_IN_PARKING_SPACE} component={Tabs} />
          <HomeStack.Screen
            name={PARKING_RESERVATION_DETAIL}
            component={ParkingReservationDetail}
          />
          <HomeStack.Screen name={SETTINGS} component={Settings} />
          <HomeStack.Screen name={LOGOUT} component={Logout} />
          <HomeStack.Screen name={SEARCH_VEHICLE} component={SearchVehicle} />
          {common}
        </HomeStack.Navigator>
      ) : (
        <HomeStack.Navigator initialRouteName={PARKING_SPACE_LIST}>
          <HomeStack.Screen
            name={PARKING_SPACE_LIST}
            component={ParkingSpaceList}
          />
          <HomeStack.Screen name={SETTINGS} component={Settings} />
          <HomeStack.Screen name={LOGOUT} component={Logout} />
          <HomeStack.Screen
            name={PARKING_SPACE_DETAIL}
            component={ParkingSpaceDetail}
          />
          {/* {common} */}
        </HomeStack.Navigator>
      ))
  );
};
export default HomeNavigator;
