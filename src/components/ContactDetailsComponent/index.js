import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import axios from '../../helpers/axiosInstance';

import colors from '../../assets/theme/colors';
import {
  PARKING_LOT_ATTENDANT_LIST,
  REQUEST_QR_CODE,
} from '../../constants/routeNames';
import Icon from '../common/Icon';
import CustomButton from '../common/CustomButton';
import styles from './styles';
import ImageComponent from './ImageComponent';
import {DEFAULT_IMAGE_URI} from '../../constants/general';
import ImagePicker from '../common/ImagePicker';

const ContactDetailsComponent = ({
  contact,
  openSheet,
  sheetRef,
  onFileSelected,
  updatingImage,
  localFile,
  uploadSucceeded,
}) => {
  const {navigate} = useNavigation();
  const [count, setCount] = useState();
  const {id, image, name, address, description, startTime, endTime} = contact;
  useEffect(() => {
    axios
      .get(`/parking-space/${id}/qr/count/`)
      .then(res => {
        setCount(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, [id]);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {(image || uploadSucceeded) && (
          <ImageComponent src={image || localFile?.path} />
        )}

        {!image && !uploadSucceeded && (
          <View style={{alignItems: 'center', paddingVertical: 20}}>
            <Image
              width={150}
              height={150}
              source={{uri: localFile?.path || DEFAULT_IMAGE_URI}}
              style={styles.imageView}
            />

            <TouchableOpacity
              onPress={() => {
                openSheet();
              }}>
              <Text style={{color: colors.primary}}>
                {' '}
                {updatingImage ? 'updating...' : 'Add picture'}{' '}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.content}>
          <Text style={styles.names}>{name}</Text>
          <Text style={styles.address}>{address}</Text>
          <Text style={styles.address}>{description}</Text>
        </View>

        <View style={styles.hrLine} />

        {/* <View style={styles.topCallOptions}>
          <TouchableOpacity style={styles.topCallOption}>
            <Icon
              type="ionicon"
              name="call-outline"
              color={colors.primary}
              size={27}
            />
            <Text style={styles.middleText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.topCallOption}>
            <Icon
              type="materialCommunity"
              name="message-text"
              color={colors.primary}
              size={27}
            />
            <Text style={styles.middleText}>Text</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.topCallOption}>
            <Icon
              type="materialCommunity"
              name="video"
              color={colors.primary}
              size={27}
            />
            <Text style={styles.middleText}>Video</Text>
          </TouchableOpacity>
        </View> */}

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

          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon
              type="fa"
              name="users"
              color={colors.primary}
              size={27}
              onPress={() => {
                navigate(PARKING_LOT_ATTENDANT_LIST, {
                  parkingId: contact.id,
                });
              }}
            />
          </View>
        </View>
        <View style={styles.middleCallOptions}>
          <Icon
            style={{alignItems: 'center'}}
            type="material"
            name="qr-code"
            color={colors.grey}
            size={27}
          />
          <View style={styles.phoneMobile}>
            <Text>{count} codes</Text>
          </View>
          <View>
            <CustomButton
              primary
              title="Request More"
              onPress={() => {
                navigate(REQUEST_QR_CODE, {
                  parkingId: contact.id,
                });
              }}
            />
          </View>
        </View>
      </View>

      <ImagePicker onFileSelected={onFileSelected} ref={sheetRef} />
    </ScrollView>
  );
};

export default ContactDetailsComponent;
