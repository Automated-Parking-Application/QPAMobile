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

import CustomButton from '../../components/common/CustomButton';
import axios from '../../helpers/axiosInstance';
import moment from 'moment';
import styles from './styles';
import Icon from '../common/Icon';
import {useNavigation} from '@react-navigation/native';

import {LineChart} from 'react-native-chart-kit';
import colors from '../../assets/theme/colors';
import {PARKING_RESERVATION_DETAIL} from '../../constants/routeNames';

LogBox.ignoreAllLogs();
const TIME_PERIOD = 3;
const ParkingSpaceReportComponent = () => {
  const [parkingRes, setParkingRes] = useState([]);
  const [backlog, setBacklog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {navigate} = useNavigation();
  const isAdmin =
    useSelector(state => state.auth.data?.User?.roleByRoleId?.name) === 'ADMIN';
  const isParkingLotAttendant =
    useSelector(state => state.auth.data?.User?.roleByRoleId?.name) ===
    'PARKING_ATTENDANT';

  const refreshFn = useCallback(() => {
    setIsLoading(true);
    axios
      .get(`/parking-space/1/parking-reservation`)
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
      .get(`/parking-space/1/parking-reservation/backlog`)
      .then(res => {
        setIsLoading(false);
        setBacklog(res.data);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);
  useEffect(() => {
    refreshFn();
  }, [refreshFn]);

  const onSubmit = () => {};

  const workingTime = useMemo(() => {
    if (Object.values(parkingRes).length > 0) {
      const firstTime = new Date(Object.values(parkingRes)[0].createTime);
      const {startTime, endTime} =
        Object.values(parkingRes)[0].parkingReservationEntity.parking_space;

      const formattedStartTime = new Date(startTime).setDate(
        firstTime.getDate(),
      );
      const formattedEndTime = new Date(endTime).setDate(firstTime.getDate());

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
              <Text style={styles.name}>{name}</Text>
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
      style={{
        paddingVertical: 30,
        paddingHorizontal: 20,
        marginBottom: 20,
        backgroundColor: colors.white,
      }}>
      <Text style={{paddingVertical: 10, fontSize: 16, fontWeight: '700'}}>
        Check-in Number Chart in Day
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
      {backlog.map(item =>
        renderItem({item: item.vehicle, parkingReservation: item}),
      )}
      {isParkingLotAttendant && (
        <View style={{width: '100%', paddingLeft: 15, paddingRight: 15}}>
          <CustomButton
            disabled={isLoading}
            onPress={onSubmit}
            loading={isLoading}
            primary
            title="Archive All"
          />
        </View>
      )}
    </ScrollView>
  );
};

export default ParkingSpaceReportComponent;
