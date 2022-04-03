/* eslint-disable no-unused-vars */
import React, {useState, useCallback, useMemo} from 'react';
import {Image, View, Text, Alert} from 'react-native';
import getParkingLotAttendants from '../../context/actions/parkingLotAttendants/getParkingLotAttendants';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SETTINGS} from '../../constants/routeNames';
import CustomButton from '../../components/common/CustomButton';
import Input from '../../components/common/Input';
import {useSelector, useDispatch} from 'react-redux';
import axios from '../../helpers/axiosInstance';

const UpdatePassword = () => {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [password, setPassword] = useState('');
  const {error, loading, data} = useSelector(state => state.auth);
  const [form, setForm] = useState({});
  const navigation = useNavigation();
  const [isSecureEntry, setIsSecureEntry] = useState(true);
  const [isSecureEntry2, setIsSecureEntry2] = useState(true);

  const dispatch = useDispatch();
  const onSubmit = useCallback(() => {
    setIsLoading(true);
    axios
      .post('user/changePassword', {password, newPassword})
      .then(res => {
        Alert.alert('Successfull!', '', [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
        setIsLoading(false);
      })
      .catch(err => {
        Alert.alert('Error!', 'Something went wrong!', [
          {
            text: 'Try Again',
            onPress: () => {},
          },
        ]);
        setIsLoading(false);
      });
    if (!password) {
      setErrors(prev => {
        return {...prev, password: 'Please input your old password'};
      });
    }
    if (!newPassword) {
      setErrors(prev => {
        return {...prev, newPassword: 'Please add your new password'};
      });
    }
  }, [newPassword, password]);
  const onChange = ({name, value}) => {
    setForm({...form, [name]: value});
    if (value !== '') {
      switch (name) {
        case 'password': {
          if (value.length < 6) {
            setErrors(prev => {
              return {...prev, [name]: 'This field needs min 6 characters'};
            });
          } else {
            setErrors(prev => {
              return {...prev, [name]: null};
            });
          }
          break;
        }
        case 'newPassword': {
          if (value.length < 6 || value == password) {
            setErrors(prev => {
              return {...prev, [name]: 'Password is duplicate or not meet required length'};
            });
          } else {
            setErrors(prev => {
              return {...prev, [name]: null};
            });
          }
          break;
        }
        default: {
          setErrors(prev => {
            return {...prev, [name]: null};
          });
        }
      }
    } else {
      setErrors(prev => {
        return {...prev, [name]: 'This field is required'};
      });
    }
  };
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
        width={300}
        source={require('../../assets/images/updatePass.png')}
        style={{
          width: 400,
          height: 200,
        }}
      />

      <Text
        style={{
          fontSize: 20,
          fontWeight: '500',
          paddingLeft: 15,
          paddingRight: 15,
        }}>
        Change Password
      </Text>

      <View style={{width: '100%', paddingLeft: 15, paddingRight: 15}}>
        {/* {error && !error.error && (
            <Message
              onDismiss={() => {}}
              danger
              message="invalid credentials"
            />
          )}
          {error?.error && <Message danger onDismiss message={error?.error} />} */}
        <Input
          label="Old Password"
          iconPosition="right"
          placeholder="Enter Old Password"
          secureTextEntry={isSecureEntry}
          icon={
            <TouchableOpacity
              onPress={() => {
                setIsSecureEntry(prev => !prev);
              }}>
              <Text>{isSecureEntry ? 'Show' : 'Hide'}</Text>
            </TouchableOpacity>
          }
          value={password}
          onChangeText={value => {
            onChange({name: 'password', value});
            setPassword(value);
          }}
          error={errors.password || error?.password?.[0]}
        />
        <Input
          label="New Password"
          iconPosition="right"
          placeholder="Enter New Password"
          secureTextEntry={isSecureEntry2}
          icon={
            <TouchableOpacity
              onPress={() => {
                setIsSecureEntry2(prev => !prev);
              }}>
              <Text>{isSecureEntry2 ? 'Show' : 'Hide'}</Text>
            </TouchableOpacity>
          }
          value={newPassword}
          error={errors.newPassword || error?.newPassword?.[0]}
          onChangeText={value => {
            onChange({name: 'newPassword', value});
            setNewPassword(value);
          }}
        />
      </View>
      <View style={{width: '100%', paddingLeft: 15, paddingRight: 15}}>
        <CustomButton
          disabled={isLoading}
          onPress={onSubmit}
          loading={isLoading}
          primary
          title="Apply"
        />
      </View>
    </View>
  );
};

export default UpdatePassword;
