import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import colors from '../../assets/theme/colors';
import {
  PARKING_SPACE_DETAIL,
  CREATE_PARKING_SPACE,
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
  const {image, name, address, description, startTime, endTime} = contact;

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
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon type="fa" name="users" color={colors.primary} size={27} />
            {/* <Icon
              type="materialCommunity"
              name="message-text"
              color={colors.primary}
              size={27}
              style={[styles.msgIcon]}
            /> */}
          </View>
        </View>
        {/* <CustomButton
          style={{alignSelf: 'flex-end', marginRight: 20, width: 200}}
          primary
          title="Edit Contact"
          onPress={() => {
            navigate(CREATE_PARKING_SPACE, {contact, editing: true});
          }}
        /> */}
      </View>

      <ImagePicker onFileSelected={onFileSelected} ref={sheetRef} />
    </ScrollView>
  );
};

export default ContactDetailsComponent;
