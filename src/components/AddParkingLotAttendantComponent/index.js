import React, {useState, useMemo, useCallback} from 'react';
<<<<<<< HEAD
import {useContext} from 'react';
=======
>>>>>>> master
import moment from 'moment';
import {
  Container,
  Image,
  View,
  Text,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {ADD_PARKING_LOT_ATTENDANTS_SUCCESS} from '../../constants/actionTypes';
import getParkingLotAttendants from '../../context/actions/parkingLotAttendants/getParkingLotAttendants';
import {useNavigation, useRoute} from '@react-navigation/native';
import {PARKING_LOT_ATTENDANT_LIST} from '../../constants/routeNames';
<<<<<<< HEAD
import {useFocusEffect} from '@react-navigation/native';
=======
>>>>>>> master
import CustomButton from '../../components/common/CustomButton';
import Input from '../common/Input';
import axios from '../../helpers/axiosInstance';
import {useSelector, useDispatch} from 'react-redux';
<<<<<<< HEAD
import Message from '../common/Message';

const AddParkingLotAttendantComponent = () => {
  const [form, setForm] = useState({});
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const {error, loading, data} = useSelector(state => state.auth);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (data || error) {
          // clearAuthState()(authDispatch);
          dispatch(clearAuthState());
        }
      };
    }, [data, error]),
  );
=======

const AddParkingLotAttendantComponent = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
>>>>>>> master
  const {
    params: {parkingId},
  } = useRoute();
  const dispatch = useDispatch();
<<<<<<< HEAD
  const onChange = ({name, value}) => {
    setForm({...form, [name]: value});
    if (value !== '') {
      if (name === 'phoneNumber') {
        if (isNaN(value)) {
          setErrors(prev => {
            return {...prev, [name]: 'Number only'};
          });
        } else {
          setErrors(prev => {
            return {...prev, [name]: null};
          });
        }
      }
      else {
          setErrors(prev => {
            return {...prev, [name]: null};
          });
        }
      } else {
        setErrors(prev => {
          return {...prev, [name]: 'This field is required'};
        });
      }
    };
=======

>>>>>>> master
  const onSubmit = useCallback(() => {
    setIsLoading(true);
    console.log(phoneNumber);
    axios
      .post(`/parking-space/${parkingId}/user`, {
        phoneNumber,
      })
      .then(res => {
<<<<<<< HEAD
        Alert.alert('Successfull!', "", [
=======
        Alert.alert('Successfull!', "",[
>>>>>>> master
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
<<<<<<< HEAD
        Alert.alert('Error!', 'Something went wrong!', [
          {
            text: 'Try Again',
            onPress: () => {},
          },
        ]);
        setIsLoading(false);
      });
    if (!form.phoneNumber) {
      setErrors(prev => {
        return {...prev, userName: 'Please add a phone number'};
      });
    }
=======
        Alert.alert(
          'Error!',
          'Something went wrong!',
          [
            {
              text: 'Try Again',
              onPress: () => {},
            },
          ],
        );
        setIsLoading(false);
      });
>>>>>>> master
  }, [phoneNumber, parkingId]);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
      }}>
<<<<<<< HEAD
        {error?.error && (
            <Message retry danger retryFn={onSubmit} message={error?.error} />
          )}
=======
>>>>>>> master
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
<<<<<<< HEAD
            onChange({name: 'phoneNumber', value});
          }}
          error={errors.phoneNumber || error?.phoneNumber?.[0]}
=======
            setPhoneNumber(value);
          }}
>>>>>>> master
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
