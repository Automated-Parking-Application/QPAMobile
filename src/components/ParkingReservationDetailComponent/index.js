import React, {useState, useEffect, useMemo} from 'react';
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
} from 'react-native';
import {useSelector} from 'react-redux';
import QRCode from 'react-native-qrcode-svg';
import axios from '../../helpers/axiosInstance';
import {ACTIVITY_DETAIL} from '../../constants/activityConstant';
import {CHECKED_IN_PARKING_SPACE} from '../../constants/routeNames';
import ProgressLoader from 'rn-progress-loader';
import ImageViewer from 'react-native-image-zoom-viewer';

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
      .then(res => {
        setIsLoading(false);
        setRes(res.data.parkingReservation);
        setActivity(res.data.parkingReservationActivity);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  }, [parkingReservation.id, selectedParkingId]);

  const customizedPhotos = useMemo(() => {
    return (
      res?.attachment && JSON.parse(res?.attachment)?.map(item => ({url: item}))
    );
  }, [res?.attachment]);

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
      {/* <ProgressLoader
        visible={isLoading}
        isModal={true}
        isHUD={true}
        hudColor={'#000000'}
        color={'#FFFFFF'}
      /> */}
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
        <QRCode
          style={{justifyContent: 'center', alignItems: 'center'}}
          value={res?.code?.code}
          size={200}
          color="black"
          backgroundColor="white"
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
              {ACTIVITY_DETAIL[activityItem.type]?.name}:{' '}
            </Text>
            <Text style={{fontSize: 20}}>
              {moment(activityItem?.createTime)?.format('LT')}
            </Text>
          </View>
        ))}
        {/* <CustomButton
          style={{marginTop: 25}}
          disabled={isLoading}
          onPress={() => {
            navigate(CHECKED_IN_PARKING_SPACE);
          }}
          loading={isLoading}
          primary
          title="Back to main"
        /> */}
      </View>
    </>
  );
};
export default ParkingReservationDetailComponent;
