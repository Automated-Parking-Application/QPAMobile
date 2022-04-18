import {useNavigation} from '@react-navigation/native';
import React, {useRef, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native';
import {s} from 'react-native-size-matters';
import colors from '../../assets/theme/colors';
import {
  PARKING_SPACE_DETAIL,
  CREATE_PARKING_SPACE,
} from '../../constants/routeNames';
import Icon from '../common/Icon';
import Message from '../common/Message';
import styles from './styles';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {useDispatch} from 'react-redux';
import getParkingSpaces from '../../context/actions/parkingSpaces/getParkingSpaces';

const ContactsComponent = ({sortBy, data, loading, setModalVisible}) => {
  const {navigate} = useNavigation();
  const dispatch = useDispatch();

  const swipeableItemRefs = useRef([]);

  const toggleSwipeable = key => {
    swipeableItemRefs.current.forEach((ref, i) => {
      if (ref.id !== key) {
        swipeableItemRefs.current?.[i]?.swipeable?.close();
      }
    });
  };

  const ListEmptyComponent = () => {
    return (
      <View style={{paddingVertical: 100, paddingHorizontal: 100}}>
        <Message info message="No Parking Space to show" />
      </View>
    );
  };

  const onRefresh = useCallback(async () => {
    dispatch(getParkingSpaces());
  }, [dispatch]);

  const renderItem = ({item}) => {
    const {name, address, description, image} = item;

    const renderLeftActions = (progress, dragX) => {
      return (
        <View style={[{flexDirection: 'row', paddingRight: 5}]}>
          <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
            <Icon
              name="chat"
              type="material"
              size={s(22)}
              color={colors.white}
            />
            <Text style={styles.actionText} numberOfLines={1}>
              Chat
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
            <Icon
              name={'heart-outline'}
              type="materialCommunity"
              size={22}
              color={colors.white}
            />
            <Text numberOfLines={1} style={styles.actionText}>
              Favorite
            </Text>
          </TouchableOpacity>
        </View>
      );
    };
    const {id} = item;
    return (
      // <Swipeable
      //   ref={ref =>
      //     swipeableItemRefs.current.push({
      //       id,
      //       swipeable: ref,
      //     })
      //   }
      //   onSwipeableWillOpen={() => toggleSwipeable(id)}
      //   renderLeftActions={(progress, dragX) =>
      //     renderLeftActions(progress, dragX, item)
      //   }
      //   renderRightActions={(progress, dragX) =>
      //     renderLeftActions(progress, dragX, item)
      //   }>
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => {
            navigate(PARKING_SPACE_DETAIL, {item});
          }}>
          <View style={styles.item}>
            {image ? (
              <Image style={{width: 60, height: 60}} source={{uri: image}} />
            ) : (
              <View
                style={{
                  width: 60,
                  height: 60,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.grey,
                }}>
                <Text style={[styles.name, {color: colors.white}]}>{name}</Text>
                <Text style={[styles.name, {color: colors.white}]}>
                  {address}
                </Text>
              </View>
            )}

            <View style={{paddingLeft: 20}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.name}>{name}</Text>
                {/* <Text style={styles.name}> {address}</Text> */}
              </View>
              <Text style={styles.phoneNumber}>{address}</Text>
            </View>
          </View>
          {/* <Icon name="right" type="ant" size={18} color={colors.grey} /> */}
        </TouchableOpacity>
      // </Swipeable>
    );
  };
  return (
    <>
      <View style={{backgroundColor: colors.white, flex: 1}}>
        {loading && (
          <View style={{paddingVertical: 100, paddingHorizontal: 100}}>
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        )}

        {!loading && (
          <View style={[{paddingVertical: 20}]}>
            <FlatList
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={onRefresh} />
              }
              renderItem={renderItem}
              data={
                sortBy
                  ? data.sort((a, b) => {
                      if (sortBy === 'First Name') {
                        if (b.first_name > a.first_name) {
                          return -1;
                        } else {
                          return 1;
                        }
                      }
                      if (sortBy === 'Last Name') {
                        if (b.last_name > a.last_name) {
                          return -1;
                        } else {
                          return 1;
                        }
                      }
                    })
                  : data
              }
              ItemSeparatorComponent={() => (
                <View
                  style={{height: 0.5, backgroundColor: colors.grey}}></View>
              )}
              keyExtractor={item => String(item.id)}
              ListEmptyComponent={ListEmptyComponent}
              ListFooterComponent={<View style={{height: 150}}></View>}
            />
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.floatingActionButton}
        onPress={() => {
          navigate(CREATE_PARKING_SPACE);
        }}>
        <Icon name="plus" size={21} color={colors.white} />
      </TouchableOpacity>
    </>
  );
};

export default ContactsComponent;
