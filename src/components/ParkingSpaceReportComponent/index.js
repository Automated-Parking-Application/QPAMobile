import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {
  Dimensions,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  LogBox,
  RefreshControl,
} from 'react-native';
import {useSelector} from 'react-redux';

import axios from '../../helpers/axiosInstance';
import moment from 'moment';
import styles from './styles';
import Icon from '../common/Icon';
import {useNavigation, useRoute} from '@react-navigation/native';
import CustomButton from '../../components/common/CustomButton';

import {LineChart} from 'react-native-chart-kit';
import colors from '../../assets/theme/colors';
import {PARKING_RESERVATION_DETAIL} from '../../constants/routeNames';

LogBox.ignoreAllLogs();
const TIME_PERIOD = 3;
const ParkingSpaceReportComponent = () => {
  const [parkingRes, setParkingRes] = useState([]);
  const [backlog, setBacklog] = useState([]);
  const [archive, setArchive] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {navigate, goBack} = useNavigation();
  const {params} = useRoute();
  // const isAdmin =
  //   useSelector(state => state.auth.data?.User?.roleByRoleId?.name) === 'ADMIN';
  const isParkingLotAttendant =
    useSelector(state => state.auth.data?.User?.roleByRoleId?.name) ===
    'PARKING_ATTENDANT';

  const selectedParkingId = useSelector(
    state => state?.parkingSpaces?.selectedParkingSpace?.id,
  );

  const refreshFn = useCallback(() => {
    if (!selectedParkingId && !params?.id) {
      return;
    }
    setIsLoading(true);
    axios
      .get(
        `/parking-space/${selectedParkingId || params?.id}/parking-reservation`,
      )
      .then(res => {
        setIsLoading(false);
        setParkingRes(res.data);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
    setIsLoading(true);

    axios
      .get(
        `/parking-space/${
          selectedParkingId || params?.id
        }/parking-reservation/backlog`,
      )
      .then(res => {
        setIsLoading(false);
        setBacklog(res.data);
      })
      .catch(err => {
        console.log(err.response);
        setIsLoading(false);
      });

    axios
      .get(
        `/parking-space/${
          selectedParkingId || params?.id
        }/parking-reservation/archive`,
      )
      .then(res => {
        setIsLoading(false);
        setArchive(res.data);
        console.log(res.data);
      })
      .catch(err => {
        console.log(err.response);
        setIsLoading(false);
      });
  }, [params?.id, selectedParkingId]);
  useEffect(() => {
    refreshFn();
  }, [refreshFn]);

  const workingTime = useMemo(() => {
    if (Object.values(parkingRes).length > 0) {
      const firstTime = new Date(Object.values(parkingRes)[0].createTime);
      const {startTime, endTime} =
        Object.values(parkingRes)[0].parkingReservationEntity.parking_space;

      const tempS = new Date(startTime).setMonth(firstTime.getMonth());
      const formattedStartTime = new Date(tempS).setDate(firstTime.getDate());

      const tempE = new Date(endTime).setMonth(firstTime.getMonth());
      const formattedEndTime = new Date(tempE).setDate(firstTime.getDate());

      let result = [];
      let s = new Date(formattedStartTime);

      while (s < formattedEndTime) {
        let e = moment(s).add(TIME_PERIOD, 'hours');
        result.push({
          start: moment(s).format('HH:mm'),
          end: e.isSameOrBefore(moment(formattedEndTime))
            ? e.format('HH:mm')
            : moment(formattedEndTime).format('HH:mm'),
          data: parkingRes.filter(p =>
            moment(new Date(p.createTime)).isBetween(
              moment(s),
              e.isSameOrBefore(moment(formattedEndTime))
                ? e
                : moment(formattedEndTime),
            ),
          ),
        });
        s = moment(s).add(TIME_PERIOD, 'hours');
      }

      return result;
    }
  }, [parkingRes]);

  const renderItem = ({item, parkingReservation}) => {
    const {id, plateNumber, vehicleType} = item;

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        key={id}
        onPress={() => {
          isParkingLotAttendant &&
            navigate(PARKING_RESERVATION_DETAIL, {
              parkingReservation,
              refreshFn,
            });
        }}>
        <View style={styles.item}>
          <View style={{paddingLeft: 20}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.name, {color: colors.black}]}>
                {plateNumber}
              </Text>
            </View>
            <Text style={styles.phoneNumber}>{vehicleType}</Text>
          </View>
        </View>
        {isParkingLotAttendant && (
          <Icon name="right" type="ant" size={18} color={colors.grey} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refreshFn} />
      }
      nestedScrollEnabled
      style={{
        // paddingVertical: 30,
        paddingHorizontal: 20,
        marginBottom: 10,
        backgroundColor: colors.white,
      }}>
      <Text style={{paddingVertical: 10, fontSize: 16, fontWeight: '700'}}>
        Total Check-in Number Chart in Day: {parkingRes.length}
      </Text>
      <ScrollView horizontal>
        {workingTime?.length > 0 && (
          <LineChart
            data={{
              labels: workingTime.map(i => i.start + '-' + i.end) || [
                0, 0, 0, 0, 0, 0,
              ],
              datasets: [
                {
                  data: workingTime.map(i => i.data.length),
                },
              ] || [0, 0, 0, 0, 0, 0],
            }}
            width={Dimensions.get('window').width * 2}
            height={220}
            fromZero
            yAxisLabel={''}
            chartConfig={{
              backgroundColor: '#1cc910',
              backgroundGradientFrom: '#eff3ff',
              backgroundGradientTo: '#efefef',
              decimalPlaces: 0,
              color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        )}
      </ScrollView>
      <Text style={{paddingVertical: 10, fontSize: 16, fontWeight: '700'}}>
        Number of Backlog Vehicle: {backlog.length}
      </Text>
      {backlog.length > 0 && <Text>Contains:</Text>}
      {backlog.length > 0 && (
        <Text style={{paddingVertical: 8}}>
          *Note: All backlog vehicle will be archived at the end of working hour
        </Text>
      )}
      {backlog.length > 0 && (
        <View
          style={{
            borderColor: 'black',
            borderStyle: 'solid',
            borderWidth: 0.5,
            borderRadius: 10,
          }}>
          <ScrollView nestedScrollEnabled style={{maxHeight: 300}}>
            {backlog.map(item =>
              renderItem({item: item.vehicle, parkingReservation: item}),
            )}
          </ScrollView>
        </View>
      )}

      <Text style={{paddingVertical: 10, fontSize: 16, fontWeight: '700'}}>
        Number of Archive Vehicle: {archive.length}
      </Text>
      {archive.length > 0 && <Text>Contains:</Text>}
      {archive.length > 0 && (
        <View
          style={{
            borderColor: 'black',
            borderStyle: 'solid',
            borderWidth: 0.5,
            borderRadius: 10,
          }}>
          <ScrollView nestedScrollEnabled style={{maxHeight: 300}}>
            {archive.map(item =>
              renderItem({item: item.vehicle, parkingReservation: item}),
            )}
          </ScrollView>
        </View>
      )}
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <CustomButton
          style={{
            width: '40%',
            alignItems: 'center',
            flexDirection: 'row',
            display: 'flex',
          }}
          onPress={() => {
            goBack();
          }}
          primary
          title="Back"
        />
      </View>
    </ScrollView>
  );
};

export default ParkingSpaceReportComponent;
