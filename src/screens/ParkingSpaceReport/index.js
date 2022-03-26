import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';
import Icon from '../../components/common/Icon';
import ParkingSpaceReportComponent from '../../components/ParkingSpaceReportComponent';

const ParkingSpaceReport = () => {
  const {setOptions, toggleDrawer} = useNavigation();

  useEffect(() => {
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
  }, [setOptions, toggleDrawer]);
  return <ParkingSpaceReportComponent></ParkingSpaceReportComponent>;
};

export default ParkingSpaceReport;
