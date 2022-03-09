import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import moment from 'moment';
import CustomButton from '../../components/common/CustomButton';
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import {useSelector} from 'react-redux';
import axios from '../../helpers/axiosInstance';
import {ACTIVITY_DETAIL} from '../../constants/activityConstant';
import ProgressLoader from 'rn-progress-loader';
import ImageViewer from 'react-native-image-zoom-viewer';
import envs from '../../config/env';

const ParkingReservationDetailComponent = () => {
  const {navigate} = useNavigation();
  const {
    params: {parkingReservation},
  } = useRoute();
  const [res, setRes] = useState({});
  const [activity, setActivity] = useState([]);
  const selectedParkingId = useSelector(
    state => state?.parkingSpaces?.selectedParkingSpace?.id,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);

  useEffect(() => {
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
        Alert.alert('Error!', 'Something went wrong!', [
          {
            text: 'Try Again',
            onPress: () => {},
          },
        ]);
        console.log(err);
      });
  }, [parkingReservation.id, selectedParkingId]);

  const customizedPhotos = useMemo(() => {
    return (
      res?.attachment && JSON.parse(res?.attachment)?.map(item => ({url: item}))
    );
  }, [res?.attachment]);

  const checkOut = useCallback(() => {
    setIsLoading(true);
    console.log(`/parking-space/${res?.parkingId}/parking-reservation/${res?.id}`)
    axios
      .delete(`parking-space/${res?.parkingId}/parking-reservation/${res?.id}`)
      .then(result => {
        setIsLoading(false);
        Alert.alert('Successfull!', '', [
          {
            text: 'OK',
            onPress: () => {},
          },
        ]);
      })
      .catch(err => {
        setIsLoading(false);
        Alert.alert('Error!', 'Something went wrong!', [
          {
            text: 'Try Again',
            onPress: () => {},
          },
        ]);
        console.log(err);
      });
  }, [res?.id, res?.parkingId]);

  const renderListPhotos = photos => {
    return photos?.map((photo, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => {
          setVisibleModal(true);
        }}>
        <Image
          style={{
            marginRight: 10,
            marginTop: 10,
            width: 100,
            height: 100,
            borderRadius: 10,
          }}
          source={{uri: photo}}
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

      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 25,
          paddingHorizontal: 20,
        }}>
        <Image
          style={{height: 200, width: 200, resizeMode: 'cover'}}
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
          <Text style={{fontWeight: '700', fontSize: 20}}>Plate Number: </Text>
          <Text style={{fontSize: 20}}>{res?.vehicle?.plateNumber}</Text>
        </View>
        <View style={{width: '100%', paddingTop: 20, flexDirection: 'row'}}>
          <Text style={{fontWeight: '700', fontSize: 20}}>Vehicle Type: </Text>
          <Text style={{fontSize: 20}}>{res?.vehicle?.vehicleType}</Text>
        </View>

        {activity?.map((activityItem, index) => (
          <View
            key={index}
            style={{width: '100%', paddingTop: 20, flexDirection: 'row'}}>
            <Text style={{fontWeight: '700', fontSize: 20}}>
              {ACTIVITY_DETAIL[activityItem?.type]?.name}:{' '}
            </Text>
            <Text style={{fontSize: 20}}>
              {moment(activityItem?.createTime)?.format('LT')}
            </Text>
          </View>
        ))}
        <CustomButton
          style={{marginTop: 25}}
          disabled={isLoading}
          onPress={checkOut}
          loading={isLoading}
          primary
          title="Check Out"
        />
      </View>
    </>
  );
};
export default ParkingReservationDetailComponent;
