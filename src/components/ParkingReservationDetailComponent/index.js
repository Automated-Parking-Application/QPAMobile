import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import moment from 'moment';
import CustomButton from '../../components/common/CustomButton';
import ImageComponent from './ImageComponent';
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
  RefreshControl,
} from 'react-native';
import {useSelector} from 'react-redux';
import axios from '../../helpers/axiosInstance';
import {ACTIVITY_DETAIL} from '../../constants/activityConstant';
import ProgressLoader from 'rn-progress-loader';
import ImageViewer from 'react-native-image-zoom-viewer';
import envs from '../../config/env';

const ParkingReservationDetailComponent = () => {
  const {goBack} = useNavigation();
  const {
    params: {parkingReservation, refreshFn},
  } = useRoute();
  const [res, setRes] = useState({});
  const [activity, setActivity] = useState([]);
  const selectedParkingId = useSelector(
    state => state?.parkingSpaces?.selectedParkingSpace?.id,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const alreadyCheckedOut =
    activity?.filter(item => item.type.toString() === '0').length > 0;

  const onRefresh = useCallback(() => {
    setIsLoading(true);
    axios
      .get(
        `/parking-space/${selectedParkingId}/parking-reservation/${parkingReservation.id}`,
      )
      .then(result => {
        setIsLoading(false);
        setRes(result.data.parkingReservation);
        setActivity(result.data.parkingReservationActivity);
      })
      .catch(err => {
        setIsLoading(false);
        Alert.alert(
          'Error!',
          err?.response?.data ||
            err?.response?.data?.message ||
            'Something went wrong!',
          [
            {
              text: 'Try Again',
              onPress: () => {},
            },
          ],
        );
        console.log(err);
      });
  }, [parkingReservation.id, selectedParkingId]);

  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  const customizedPhotos = useMemo(() => {
    return (
      res?.attachment && JSON.parse(res?.attachment)?.map(item => ({url: item}))
    );
  }, [res?.attachment]);

  const checkOut = useCallback(() => {
    setIsLoading(true);
    axios
      .post(`parking-space/${res?.parkingId}/parking-reservation/${res?.id}/check-out`, {
        externalId: res?.externalId
      })
      .then(result => {
        console.log(result)
        setIsLoading(false);
        Alert.alert('Successfull!', '', [
          {
            text: 'OK',
            onPress: () => {
              goBack();
              refreshFn && refreshFn();
            },
          },
        ]);
      })
      .catch(err => {
        setIsLoading(false);
        Alert.alert(
          'Error!',
          err?.response?.data ||
            err?.response?.data?.message ||
            'Something went wrong!',
          [
            {
              text: 'Try Again',
              onPress: () => {},
            },
          ],
        );
        console.log(err);
      });
  }, [goBack, refreshFn, res?.id, res?.parkingId]);

  const renderListPhotos = photos => {
    return photos?.map((photo, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => {
          setVisibleModal(true);
        }}>
        <ImageComponent
          style={{
            marginRight: 10,
            marginTop: 10,
            width: 100,
            height: 100,
            borderRadius: 10,
          }}
          src={photo}
        />
      </TouchableOpacity>
    ));
  };
  return (
    <>
      <ProgressLoader
        visible={isLoading}
        isModal={true}
        isHUD={true}
        hudColor={'#000000'}
        color={'#FFFFFF'}
      />
      <Modal visible={visibleModal} transparent={true}>
        <ImageViewer
          onCancel={() => {
            setVisibleModal(false);
          }}
          onDoubleClick={() => {
            setVisibleModal(false);
          }}
          enableSwipeDown
          imageUrls={customizedPhotos || []}
        />
      </Modal>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
        vertical
        contentContainerStyle={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 25,
          paddingHorizontal: 30,
        }}>
        <Image
          style={{height: 160, width: 160, resizeMode: 'cover'}}
          source={{
            uri: `${envs.BACKEND_URL}parking-space/qr-code/${res?.code?.id}`,
          }}
        />
        <ScrollView
          horizontal={true}
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: 15,
            marginBottom: 15,
          }}>
          {res?.attachment && renderListPhotos(JSON.parse(res?.attachment))}
        </ScrollView>
        <View style={{width: '100%', paddingTop: 20, flexDirection: 'row'}}>
          <Text style={{fontWeight: '700', fontSize: 16}}>Plate Number: </Text>
          <Text style={{fontSize: 16}}>{res?.vehicle?.plateNumber}</Text>
        </View>
        <View style={{width: '100%', paddingTop: 20, flexDirection: 'row'}}>
          <Text style={{fontWeight: '700', fontSize: 16}}>Vehicle Type: </Text>
          <Text style={{fontSize: 16}}>{res?.vehicle?.vehicleType}</Text>
        </View>

        {activity?.map((activityItem, index) => (
          <View
            key={index}
            style={{width: '100%', paddingTop: 20, flexDirection: 'row'}}>
            <Text style={{fontWeight: '700', fontSize: 16}}>
              {ACTIVITY_DETAIL[activityItem?.type]?.name}:{' '}
            </Text>
            <Text style={{fontSize: 16}}>
              {moment(activityItem?.createTime)?.format('LT')}{' '}
            </Text>
            <Text style={{fontWeight: '700', fontSize: 16}}>by </Text>
            <Text style={{fontSize: 16}}>{activityItem?.user?.fullName}</Text>
          </View>
        ))}
        {!alreadyCheckedOut && (
          <CustomButton
            style={{marginTop: 25}}
            disabled={isLoading}
            onPress={checkOut}
            loading={isLoading}
            primary
            title="Check Out"
          />
        )}
      </ScrollView>
    </>
  );
};
export default ParkingReservationDetailComponent;
