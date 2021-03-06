import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

import CustomButton from '../../components/common/CustomButton';
import Input from '../../components/common/Input';
import axios from '../../helpers/axiosInstance';

const RequestQR = () => {
  const [count, setCount] = useState();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState();
  const navigation = useNavigation();
  const {
    params: {parkingId, refreshFn},
  } = useRoute();
  const onSubmit = useCallback(() => {
    if (isNaN(count)) {
      setError('Invalid Input');
    } else {
      setError('');
      setIsLoading(true);
      axios
        .post(`/parking-space/${parkingId}/qr`, {
          number: parseInt(count),
        })
        .then(() => {
          Alert.alert('Successfull!', '', [
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
                refreshFn && refreshFn();
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
  }, [count, navigation, parkingId, refreshFn]);
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
            justifyContent: 'center',
          }}>
          <Image
            height={200}
            width={200}
            source={require('../../assets/images/ticket.png')}
            style={{
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
          Please add number of qr code you want to request more
        </Text>
        <Text
          style={{
            fontSize: 15,
            fontWeight: '400',
            textAlign: 'left',
            paddingTop: 15,
            paddingLeft: 15,
            paddingRight: 15,
          }}>
          *Your current plan is Basic, you can only request maximum 40 codes
        </Text>

        <View style={{width: '100%', paddingLeft: 15, paddingRight: 15}}>
          <Input
            style={{width: '100%'}}
            error={error}
            onChangeText={value => {
              setError('');
              setCount(value);
            }}
            value={count}
            label="Number to request more"
            placeholder="Enter Number"
          />
        </View>
        <View style={{width: '100%', paddingLeft: 15, paddingRight: 15}}>
          <CustomButton
            disabled={isLoading}
            onPress={onSubmit}
            loading={isLoading}
            primary
            title="Request more"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RequestQR;
