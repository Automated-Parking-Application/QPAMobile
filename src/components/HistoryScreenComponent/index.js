import React, {useEffect, useCallback} from 'react';
import {
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Text,
  RefreshControl,
} from 'react-native';
import {PARKING_RESERVATION_DETAIL} from '../../constants/routeNames';

import getParkingSpacesHistory from '../../context/actions/parkingSpaces/getParkingSpacesHistory';
import moment from 'moment';
import {useSelector, useDispatch} from 'react-redux';
import colors from '../../assets/theme/colors';
import Message from '../common/Message';
import Icon from '../common/Icon';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';

const HistoryScreenComponent = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const selectedParkingId = useSelector(
    state => state?.parkingSpaces?.selectedParkingSpace?.id,
  );
  const {data, loading} =
    useSelector(state => state.parkingSpaces.history) || {};

  useEffect(() => {
    dispatch(getParkingSpacesHistory(selectedParkingId));
  }, [dispatch, selectedParkingId]);

  const ListEmptyComponent = () => {
    return (
      <View style={{paddingVertical: 100, paddingHorizontal: 100}}>
        <Message info message="No Activity to show" />
      </View>
    );
  };

  const onRefresh = useCallback(async () => {
    await dispatch(getParkingSpacesHistory(selectedParkingId));
  }, [dispatch, selectedParkingId]);

  const renderItem = ({item}) => {
    const {
      id,
      user: {fullName, phoneNumber},
      parkingReservationEntity: {
        vehicle: {plateNumber},
      },
      type,
      createTime,
    } = item;

    return (
      <TouchableOpacity
        key={id}
        style={styles.itemContainer}
        onPress={() => {
          navigation.navigate(PARKING_RESERVATION_DETAIL, {
            parkingReservation: item.parkingReservationEntity,
            refreshFn: null,
          });
        }}>
        <View style={styles.item}>
          <Icon
            size={20}
            type="feather"
            color={type === '0' ? '#D0312D' : type === '1' ? '#0033CC' : "#FFD700"}
            name={type === '0' ? 'log-out' : type === '1' ? 'log-in' : 'clock'}
          />
          <View style={{paddingLeft: 20}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.name}>{plateNumber}</Text>
            </View>
            <Text style={{fontSize: 10}}>by {fullName || phoneNumber}</Text>
            <Text style={styles.phoneNumber}>
              {moment(createTime).format('LLLL')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <>
      <View
        style={{
          backgroundColor: colors.white,
          flex: 1,
        }}>
        {loading && (
          <View style={{paddingVertical: 100, paddingHorizontal: 100}}>
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        )}

        {!loading && (
          <View style={[{paddingVertical: 0}]}>
            <FlatList
              renderItem={renderItem}
              data={data}
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={onRefresh} />
              }
              ItemSeparatorComponent={() => (
                <View
                  style={{height: 0.5, backgroundColor: colors.grey}}></View>
              )}
              keyExtractor={item =>
                String(
                  item.id.userId + item.id.parkingReservationId + item.id.type,
                )
              }
              ListEmptyComponent={ListEmptyComponent}
              ListFooterComponent={<View style={{height: 150}}></View>}
            />
          </View>
        )}
      </View>
    </>
  );
};

export default HistoryScreenComponent;
