import {useDispatch} from 'react-redux';
import moment from 'moment';
import React, {useMemo} from 'react';
import {View, Text, Image, ScrollView} from 'react-native';

import colors from '../../assets/theme/colors';
import Icon from '../common/Icon';
import CustomButton from '../common/CustomButton';
import styles from './styles';
import ImageComponent from './ImageComponent';
import {DEFAULT_IMAGE_URI} from '../../constants/general';
import setSelectedParkingSpace from '../../context/actions/parkingSpaces/setSelectedParkingSpace';

const ParkingSpaceDetailComponent = ({contact}) => {
  const dispatch = useDispatch();
  const {id, image, name, address, description, startTime, endTime} = contact;

  const isInWorkingHour = useMemo(() => {
    const currentTime = new Date();
    const beginningTime = new Date(
      new Date(startTime).setDate(currentTime.getDate()),
    ).setMonth(currentTime.getMonth());
    const endingTime = new Date(
      new Date(endTime).setDate(currentTime.getDate()),
    ).setMonth(currentTime.getMonth());
    return moment().isBetween(
      moment(beginningTime),
      moment(endingTime),
    );
  }, [endTime, startTime]);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <ImageComponent src={image || DEFAULT_IMAGE_URI} />
        <View style={styles.content}>
          <Text style={styles.names}>{name}</Text>
          <Text style={styles.address}>{address}</Text>
          <Text style={styles.address}>{description}</Text>
        </View>

        <View style={styles.hrLine} />

        <View style={styles.middleCallOptions}>
          <Icon
            type="material"
            name="access-time"
            color={colors.grey}
            size={27}
          />
          <View style={styles.phoneMobile}>
            <Text>
              {moment(startTime).format('LT')} - {moment(endTime).format('LT')}
            </Text>
          </View>
        </View>
        <View style={styles.middleCallOptions}>
          <Icon
            style={{alignItems: 'center'}}
            name={'account-arrow-right'}
            type="materialCommunity"
            color={colors.grey}
            size={27}
          />
          <View style={styles.phoneMobile}>
            <CustomButton
              onPress={() => {
                dispatch(setSelectedParkingSpace({parkingSpace: contact}));
              }}
              disabled={!isInWorkingHour}
              primary
              title={
                'Go to Parking Space' +
                (!isInWorkingHour ? ' (Out of Working)' : '')
              }
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ParkingSpaceDetailComponent;
