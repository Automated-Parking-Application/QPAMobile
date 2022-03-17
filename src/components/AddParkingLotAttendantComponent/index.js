import React, {useState, useCallback} from 'react';
import {Image, View, Text, Alert} from 'react-native';
import getParkingLotAttendants from '../../context/actions/parkingLotAttendants/getParkingLotAttendants';
import {useNavigation, useRoute} from '@react-navigation/native';
import {PARKING_LOT_ATTENDANT_LIST} from '../../constants/routeNames';
import CustomButton from '../../components/common/CustomButton';
import Input from '../common/Input';
import axios from '../../helpers/axiosInstance';
import {useDispatch} from 'react-redux';

const AddParkingLotAttendantComponent = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const {
    params: {parkingId},
  } = useRoute();
  const dispatch = useDispatch();

  const onSubmit = useCallback(() => {
    setIsLoading(true);
    axios
      .post(`/parking-space/${parkingId}/user`, {
        phoneNumber,
      })
      .then(() => {
        Alert.alert('Successfull!', '', [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate(PARKING_LOT_ATTENDANT_LIST);
              dispatch(getParkingLotAttendants(parkingId));
            },
          },
        ]);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        Alert.alert('Error!', 'Something went wrong!', [
          {
            text: 'Try Again',
            onPress: () => {},
          },
        ]);
        setIsLoading(false);
      });
  }, [phoneNumber, parkingId, navigation, dispatch]);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
      }}>
      <Image
        height={200}
        width={200}
        source={require('../../assets/images/parking-attendant.jpg')}
        style={{
          width: 300,
          height: 300,
        }}
      />

      <Text
        style={{
          fontSize: 20,
          fontWeight: '500',
          paddingLeft: 15,
          paddingRight: 15,
        }}>
        Please add phone number of parking lot attendant
      </Text>

      <View style={{width: '100%', paddingLeft: 15, paddingRight: 15}}>
        <Input
          style={{width: '100%'}}
          onChangeText={value => {
            setPhoneNumber(value);
          }}
          value={phoneNumber}
          label="Phone Number"
          placeholder="Enter Phone Number"
        />
      </View>
      <View style={{width: '100%', paddingLeft: 15, paddingRight: 15}}>
        <CustomButton
          disabled={isLoading}
          onPress={onSubmit}
          loading={isLoading}
          primary
          title="Add"
        />
      </View>
    </View>
  );
};

export default AddParkingLotAttendantComponent;
