import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import CustomButton from '../../components/common/CustomButton';
import CheckInComponent from '../../components/CheckInComponent';

const CheckInScreen = () => {
  const [start, setStart] = useState(false);
  return !start ? (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: '80%',
        width: '100%',
      }}>
      <CustomButton
        style={{
          width: 120,
        }}
        onPress={() => {
          setStart(true);
        }}
        primary
        title="Check In"
      />
    </View>
  ) : (
    <CheckInComponent />
  );
};

export default CheckInScreen;
