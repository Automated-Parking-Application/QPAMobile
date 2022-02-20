import React, {useEffect} from 'react';
import ProgressLoader from 'rn-progress-loader';
import {
  View,
  Text,
  FlatList,
  Alert,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import colors from '../../assets/theme/colors';
import Message from '../common/Message';
import Icon from '../common/Icon';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import getParkingLotAttendants from '../../context/actions/parkingLotAttendants/getParkingLotAttendants';
import removeParkingLotAttendant from '../../context/actions/parkingLotAttendants/removeParkingLotAttendant';
import {getAllParkingLotAttendantData} from '../../store/selectors/parkingLotAttendants';
import {ADD_PARKING_LOT_ATTENDANT} from '../../constants/routeNames';
import styles from './styles';
const ITEM_SIZE = 70 + 20 * 3;
const DEFAULT_AVATAR =
  'https://media.istockphoto.com/photos/businessman-silhouette-as-avatar-or-default-profile-picture-picture-id476085198?k=20&m=476085198&s=612x612&w=0&h=8J3VgOZab_OiYoIuZfiMIvucFYB8vWYlKnSjKuKeYQM=';
const ParkingLotAttendantsComponent = () => {
  const {
    params: {parkingId},
  } = useRoute();
  const parkingLotAttendants = useSelector(
    getAllParkingLotAttendantData(parkingId),
  );
  const {error, loading} = useSelector(state => state.parkingLotAttendants);
  const dispatch = useDispatch();
  const {navigate} = useNavigation();

  const scrollY = React.useRef(new Animated.Value(0)).current;

  const ListEmptyComponent = () => {
    return (
      <View
        style={{
          paddingVertical: 100,
          paddingHorizontal: 80,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Icon
          type="fa"
          name="users"
          size={80}
          style={{paddingBottom: 20}}
          color="grey"
        />
        <Message info message="No Parking Lot Attendants" />
      </View>
    );
  };
  useEffect(() => {
    dispatch(getParkingLotAttendants(parkingId));
  }, [parkingId]);

  const personRemoveClick =
    ({user, parkingId}) =>
    () => {
      Alert.alert(
        'Remove!',
        `Are you sure you want to remove ${
          user.fullName || 'this person'
        } from this parking space?`,
        [
          {
            text: 'Cancel',
            onPress: () => {},
          },
          {
            text: 'OK',
            onPress: () => {
              dispatch(removeParkingLotAttendant({userId: user.id, parkingId}))(
                () => {},
              );
            },
          },
        ],
      );
    };

  return (
    <>
      <ProgressLoader
        visible={loading}
        isModal={true}
        isHUD={true}
        hudColor={'#000000'}
        color={'#FFFFFF'}
      />
      <View style={styles.scrollView}>
        <Animated.FlatList
          data={parkingLotAttendants}
          ListEmptyComponent={ListEmptyComponent}
          keyExtractor={item => item.id}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {useNativeDriver: true},
          )}
          contentContainerStyle={styles.flatList}
          renderItem={({item, index}) => {
            const inputRange = [
              -1,
              0,
              ITEM_SIZE * index,
              ITEM_SIZE * (index + 2),
            ];

            const opacityInputRange = [
              -1,
              0,
              ITEM_SIZE * index,
              ITEM_SIZE * (index + 1),
            ];

            const scale = scrollY.interpolate({
              inputRange,
              outputRange: [1, 1, 1, 0],
            });

            const opacity = scrollY.interpolate({
              inputRange: opacityInputRange,
              outputRange: [1, 1, 1, 0],
            });
            return (
              <Animated.View
                style={{...styles.flatListItem, opacity, transform: [{scale}]}}>
                <Image
                  source={{uri: item.avatar || DEFAULT_AVATAR}}
                  style={styles.avatar}
                />
                <View>
                  <Text style={styles.name}>{item.fullName}</Text>
                  <Text style={styles.phoneNumber}>{item.phoneNumber}</Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    flex: 1,
                  }}>
                  <Icon
                    onPress={personRemoveClick({user: item, parkingId})}
                    style={{flex: 1}}
                    size={20}
                    name="person-remove"
                    type="material"></Icon>
                </View>
              </Animated.View>
            );
          }}
        />
      </View>
      <TouchableOpacity
        style={styles.floatingActionButton}
        onPress={() => {
          navigate(ADD_PARKING_LOT_ATTENDANT, {
            parkingId,
          });
        }}>
        <Icon name="plus" size={21} color={colors.white} />
      </TouchableOpacity>
    </>
  );
};

export default ParkingLotAttendantsComponent;
