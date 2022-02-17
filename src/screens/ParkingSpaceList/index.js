import React from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Text, TouchableOpacity} from 'react-native';
import Icon from '../../components/common/Icon';
import ParkingSpaceListComponent from "../../components/ParkingSpaceListComponent"
const ParkingSpaceList = () => {
  const {setOptions, toggleDrawer} = useNavigation();
  React.useEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            toggleDrawer();
          }}>
          <Icon type="material" style={{padding: 10}} size={25} name="menu" />
        </TouchableOpacity>
      ),
    });
  }, []);
  return (<ParkingSpaceListComponent />)
}

export default ParkingSpaceList;
