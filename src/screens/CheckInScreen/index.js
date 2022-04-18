import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';
import {ScrollView, Text, RefreshControl} from 'react-native';
import CustomButton from '../../components/common/CustomButton';
import CheckInComponent from '../../components/CheckInComponent';
import axios from '../../helpers/axiosInstance';
import colors from '../../assets/theme/colors';
import ProgressLoader from 'rn-progress-loader';
import updateParkingSpaceDetail from '../../context/actions/parkingSpaces/updateParkingSpaceDetail';

const CheckInScreen = ({start, setStart, childRef}) => {
  const dispatch = useDispatch();
  const [count, setCount] = useState();
  const selectedParkingId = useSelector(
    state => state?.parkingSpaces?.selectedParkingSpace?.id,
  );
  const {startTime, endTime} =
    useSelector(state => state?.parkingSpaces?.selectedParkingSpace) || {};
  const unavailableParkingSpace = !count || count === 0;
  const isInWorkingHour = useMemo(() => {
    if (!startTime || !endTime) {
      return;
    }
    const currentTime = new Date();
    const beginningTime = new Date(
      new Date(startTime).setDate(currentTime.getDate()),
    ).setMonth(currentTime.getMonth());
    const endingTime = new Date(
      new Date(endTime).setDate(currentTime.getDate()),
    ).setMonth(currentTime.getMonth());
    console.log(moment().isBetween(moment(beginningTime), moment(endingTime)))
    return moment().isBetween(moment(beginningTime), moment(endingTime));
  }, [endTime, startTime]);
  const [loading, setLoading] = useState(false);

  const requestCall = useCallback(() => {
    setLoading(true);

    axios
      .get(`/parking-space/${selectedParkingId}`)
      .then(res => {
        dispatch(updateParkingSpaceDetail({parkingSpace: res.data}));
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });
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
  }, [dispatch, selectedParkingId]);

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
        disabled={unavailableParkingSpace || !isInWorkingHour}
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
      {!isInWorkingHour && (
        <Text
          style={{
            color: colors.danger,
            paddingTop: 10,
            fontSize: 12,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          Out of Working Hour
        </Text>
      )}
    </ScrollView>
  ) : (
    <CheckInComponent setStart={setStart} ref={childRef} />
  );
};

export default CheckInScreen;
