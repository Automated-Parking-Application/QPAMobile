import React, {useState, useEffect, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {ScrollView, Text, RefreshControl} from 'react-native';
import CustomButton from '../../components/common/CustomButton';
import CheckInComponent from '../../components/CheckInComponent';
import axios from '../../helpers/axiosInstance';
import colors from '../../assets/theme/colors';
import ProgressLoader from 'rn-progress-loader';

const CheckInScreen = ({start, setStart, childRef}) => {
  const [count, setCount] = useState();
  const selectedParkingId = useSelector(
    state => state?.parkingSpaces?.selectedParkingSpace?.id,
  );
  const unavailableParkingSpace = !count || count === 0;
  const [loading, setLoading] = useState(false);

  const requestCall = useCallback(() => {
    setLoading(true);
    axios
      .get(`/parking-space/${selectedParkingId}/qr/count/`)
      .then(res => {
        setCount(res.data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });
  }, [selectedParkingId]);

  useEffect(() => {
    requestCall();
  }, [requestCall, selectedParkingId]);

  return !start ? (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={requestCall} />
      }
      contentContainerStyle={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80%',
        width: '100%',
      }}>
      <ProgressLoader
        visible={loading}
        isModal={true}
        isHUD={true}
        hudColor={'#000000'}
        color={'#FFFFFF'}
      />
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
    </ScrollView>
  ) : (
    <CheckInComponent setStart={setStart} ref={childRef} />
  );
};

export default CheckInScreen;
