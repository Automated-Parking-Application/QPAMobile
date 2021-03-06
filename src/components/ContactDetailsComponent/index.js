import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import Input from '../common/Input';

import axios from '../../helpers/axiosInstance';
import AppModal from '../common/AppModal';

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
import {useSelector} from 'react-redux';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [invalidate, setInvalidate] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const username = useSelector(state => state.auth.data?.User?.fullName);
  const {id, image, name, address, description, startTime, endTime} = contact;

  const refreshFn = useCallback(() => {
    axios
      .get(`/parking-space/${id}/qr/count/all`)
      .then(res => {
        setCount(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, [id]);

  useEffect(() => {
    refreshFn();
  }, [refreshFn]);

  const sendEmail = useCallback(() => {
    setLoading(true);
    axios
      .post(`/parking-space/${id}/qr-code/send-mail/`, {
        from: 'giangthse62424@fpt.edu.vn',
        to: email,
        parkingSpace: name,
        subject: 'QR Code',
        name: username || 'User',
      })
      .then(res => {
        setLoading(false);
        setModalVisible(false);
        setEmail('');
        Alert.alert('Successfull!', res.data || res.data?.message, [
          {
            text: 'OK',
            onPress: () => {},
          },
        ]);
      })
      .catch(err => {
        setLoading(false);
        Alert.alert('Something went wrong!', err.data || err.data?.message, [
          {
            text: 'OK',
            onPress: () => {},
          },
        ]);
      });
  }, [email, id, name, username]);

  return (
    <ScrollView style={styles.scrollView}>
      <AppModal
        modalVisible={modalVisible}
        modalFooter={<></>}
        closeOnTouchOutside={false}
        modalBody={
          <View>
            <Input
              error={invalidate && 'Wrong Format of Email'}
              style={{width: '100%'}}
              onChangeText={value => {
                setEmail(value);
                let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
                if (reg.test(value) === false) {
                  setInvalidate(true);
                } else {
                  setInvalidate(false);
                }
              }}
              value={email}
              label="Input Email:"
              placeholder="Enter Email"
            />
            <CustomButton
              disabled={email.length === 0 || invalidate || loading}
              onPress={sendEmail}
              loading={loading}
              primary
              title="Send"
            />
          </View>
        }
        title="Send QR Codes To Email"
        setModalVisible={setModalVisible}
      />
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
          <Text style={styles.description}>{description}</Text>
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
                  refreshFn,
                });
              }}
            />
          </View>
          {count > 0 && (
            <View>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                }}>
                <Icon
                  type="material"
                  style={{
                    alignItems: 'center',
                    paddingLeft: 20,
                    color: colors.primary,
                  }}
                  size={27}
                  name="ios-share"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <ImagePicker onFileSelected={onFileSelected} ref={sheetRef} />
    </ScrollView>
  );
};

export default ContactDetailsComponent;
