import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {View, Text} from 'react-native';
import CustomButton from '../../components/common/CustomButton';
import CheckInComponent from '../../components/CheckInComponent';
import axios from '../../helpers/axiosInstance';
import colors from '../../assets/theme/colors';

const CheckInScreen = ({start, setStart, childRef}) => {
  const [count, setCount] = useState();
  const selectedParkingId = useSelector(
    state => state?.parkingSpaces?.selectedParkingSpace?.id,
  );
  const unavailableParkingSpace = !count || count === 0;

  useEffect(() => {
    axios
      .get(`/parking-space/${selectedParkingId}/qr/count/`)
      .then(res => {
        setCount(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, [selectedParkingId]);

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
        disabled={unavailableParkingSpace}
        onPress={() => {
          setStart(true);
        }}
        primary
        title="Check In"
      />
      {unavailableParkingSpace && (
        <Text
          style={{
            color: colors.danger,
            paddingTop: 10,
            fontSize: 12,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          This parking space does not have QR code left
        </Text>
      )}
    </View>
  ) : (
    <CheckInComponent setStart={setStart} ref={childRef} />
  );
};

export default CheckInScreen;