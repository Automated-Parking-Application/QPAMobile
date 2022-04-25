import React, {useState, useCallback} from 'react';
import {
  Image,
  View,
  Text,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import getParkingLotAttendants from '../../context/actions/parkingLotAttendants/getParkingLotAttendants';
import {useNavigation, useRoute} from '@react-navigation/native';
import {PARKING_LOT_ATTENDANT_LIST} from '../../constants/routeNames';
import CustomButton from '../../components/common/CustomButton';
import Input from '../common/Input';
import axios from '../../helpers/axiosInstance';
import {useDispatch} from 'react-redux';

const AddParkingLotAttendantComponent = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const {
    params: {parkingId},
  } = useRoute();
  const dispatch = useDispatch();

  const onSubmit = useCallback(() => {
    if (isNaN(phoneNumber)) {
      setErrors('Wrong format for phone number');
    } else if (!phoneNumber || phoneNumber.trim().length === 0) {
      setErrors('Please input phone number');
    } else {
      setErrors('');
      setIsLoading(true);
      axios
        .post(`/parking-space/${parkingId}/user`, {
          phoneNumber: phoneNumber.split(/\s/g).join(''),
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
    }
  }, [phoneNumber, parkingId, navigation, dispatch]);
  return (
    <KeyboardAvoidingView
      behavior="position"
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <ScrollView>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            height={200}
            width={200}
            source={require('../../assets/images/parking-attendant.jpg')}
            style={{
              alignItems: 'center',
              width: 300,
              height: 300,
            }}
          />
        </View>

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
            error={errors}
            style={{width: '100%'}}
            onChangeText={value => {
              setErrors('');
              setPhoneNumber(value);
            }}
            value={phoneNumber}
            label="Phone Number (+84)"
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddParkingLotAttendantComponent;
