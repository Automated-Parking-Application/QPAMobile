import {useRoute} from '@react-navigation/native';
import React from 'react';
import ParkingSpaceDetailComponent from '../../components/ParkingSpaceDetailComponent';

const ParkingSpaceDetail = () => {
  const {params: {item = {}} = {}} = useRoute();
  return <ParkingSpaceDetailComponent contact={item} />;
};

export default ParkingSpaceDetail;
