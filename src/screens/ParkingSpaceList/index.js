import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';
import getParkingSpaces from '../../context/actions/parkingSpaces/getParkingSpaces';
import {useSelector, useDispatch} from 'react-redux';
import Icon from '../../components/common/Icon';
import ParkingSpaceListComponent from '../../components/ParkingSpaceListComponent';
const ParkingSpaceList = () => {
  const dispatch = useDispatch();
  const {setOptions, toggleDrawer} = useNavigation();
  const {data, loading, error} =
    useSelector(state => state.parkingSpaces.getParkingSpaces) || {};

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

  useEffect(() => {
    dispatch(getParkingSpaces());
  }, [dispatch]);
  return <ParkingSpaceListComponent data={data} loading={loading} />;
};

export default ParkingSpaceList;
