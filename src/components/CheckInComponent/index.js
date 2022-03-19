import React, {
  useState,
  useCallback,
  forwardRef,
  useRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import envs from '../../config/env';
import QRCodeScanner from 'react-native-qrcode-scanner';
import ProgressLoader from 'rn-progress-loader';
import axios from '../../helpers/axiosInstance';

import {PARKING_RESERVATION_DETAIL} from '../../constants/routeNames';
import checkIn from '../../context/actions/parkingSpaces/checkIn';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import ActionSheet from 'react-native-actionsheet';
import styles from './styles';
import Input from '../common/Input';
import DropDownPicker from 'react-native-dropdown-picker';
import colors from '../../assets/theme/colors';
import {useNavigation} from '@react-navigation/native';
import CustomButton from '../../components/common/CustomButton';
import uploadMultipleImages from '../../helpers/uploadMultipleImages';
import {useSelector} from 'react-redux';
import {useHeaderHeight} from '@react-navigation/stack';
const deviceWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('window').height;

// eslint-disable-next-line react/display-name
const CheckInComponent = forwardRef((props, ref) => {
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState();
  const [localPhotos, setLocalPhotos] = useState([]);
  const actionSheetSelectPhotoRef = useRef(null);
  const actionSheetRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [scan, setScan] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Xe Tay Ga', value: 'Xe Tay Ga'},
    {label: 'Xe Gắn Máy', value: 'Xe Gắn Máy'},
  ]);
  const [description, setDescription] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [qrCode, setQRCode] = useState({});
  const [uploading, setIsUploading] = useState(false);
  const [submitting, setIsSubmitting] = useState(false);
  const scanner = useRef(null);
  const [errors, setErrors] = useState({});
  const selectedParkingId = useSelector(
    state => state?.parkingSpaces?.selectedParkingSpace?.id,
  );

  useImperativeHandle(ref, () => ({
    resetCheckIn() {
      setValue('');
      setDescription('');
      setPlateNumber('');
      setLocalPhotos([]);
      setQRCode({});
    },
  }));

  const onSubmit = useCallback(() => {
    setErrors(prev => {
      return {
        ...prev,
        photos: localPhotos.length === 0,
        plateNumber: plateNumber.trim() === '' ? 'Please add plate number' : '',
        vehicleType: !value,
      };
    });

    if (localPhotos.length > 0 && plateNumber.trim() !== '' && value) {
      setIsUploading(true);
      uploadMultipleImages(localPhotos)(res => {
        setIsUploading(false);
        setIsSubmitting(true);
        checkIn({
          id: selectedParkingId,
          plateNumber,
          attachment: JSON.stringify(res),
          vehicleType: value,
          // eslint-disable-next-line no-extra-boolean-cast
          codeId: !!qrCode ? qrCode.id : ""
        })(item => {
          setIsSubmitting(false);
          props.setStart(false);
          navigation.navigate(PARKING_RESERVATION_DETAIL, {
            parkingReservation: item.data,
          });
        })(err => {
          setIsSubmitting(false);
          console.log(err);
        });
      })(err => {
        console.log('err :>> ', err);
        setIsUploading(false);
      });
    }
  }, [localPhotos, navigation, plateNumber, props, qrCode, selectedParkingId, value]);

  const onCancel = () => {
    props.setStart(false);
  };

  const onPressAddPhotoBtn = () => {
    actionSheetSelectPhotoRef.current.show();
  };

  const showActionSheet = index => {
    setSelectedPhotoIndex(index);
    actionSheetRef.current.show();
  };

  const renderListPhotos = photos => {
    return photos.map((photo, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => {
          showActionSheet(index);
        }}>
        <Image style={styles.photo} source={{uri: photo.path || photo.uri}} />
      </TouchableOpacity>
    ));
  };

  const renderSelectPhotoControl = photos => {
    return (
      <ScrollView horizontal={true} style={styles.photoList}>
        {renderListPhotos(photos)}
        <TouchableOpacity onPress={onPressAddPhotoBtn}>
          <View style={[styles.addButton, styles.photo]}>
            <Text style={styles.addButtonText}>+</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const onQRRead = useCallback(
    e => {
      const data = JSON.parse(e.data);
      if (data.parking.toString() !== selectedParkingId.toString()) {
        setScan(false);
        Alert.alert('Error!', "This QR doesn't belong to this Parking Space!", [
          {
            text: 'Try Again',
            onPress: () => {
              setScan(true);
            },
          },
        ]);
      } else {
        axios
          .post(
            `/parking-space/${selectedParkingId}/parking-reservation/qr-code`,
            {
              externalId: JSON.parse(e.data).parkingReservation,
            },
          )
          .then(res => {
            if (res.data.message) {
              setScan(false);
              Alert.alert('Error!', res.data.message, [
                {
                  text: 'Try Again',
                  onPress: () => {
                    setScan(true);
                  },
                },
              ]);
            } else {
              setScan(false);
              setQRCode(res.data);
            }
          })
          .catch(() => {
            Alert.alert('Error!', 'Something went wrong', [
              {
                text: 'Try Again',
                onPress: () => {
                  setScan(true);
                },
              },
            ]);
            setScan(false);
          });
      }
    },
    [selectedParkingId],
  );

  const onActionSelectPhotoDone = useCallback(
    index => {
      switch (index) {
        case 0:
          launchCamera(
            {
              storageOptions: {
                skipBackup: true,
                path: 'images',
              },
            },
            res => {
              console.log('Response = ', res);
              if (res.didCancel) {
                console.log('User cancelled image picker');
              } else if (res.error) {
                console.log(res.error);
              } else if (res.customButton) {
                console.log('User tapped custom button: ', res.customButton);
              } else {
                setLocalPhotos([...localPhotos, ...res.assets]);
              }
            },
          );
          break;
        case 1:
          launchImageLibrary(
            {
              title: 'Select Image',
              customButtons: [
                {
                  name: 'customOptionKey',
                  title: 'Choose file from Custom Option',
                },
              ],
              selectionLimit: 10,
              storageOptions: {
                skipBackup: true,
                path: 'images',
              },
            },
            res => {
              if (res.didCancel) {
                console.log('User cancelled image picker');
              } else if (res.error) {
                console.log('ImagePicker Error: ', res.error);
              } else if (res.customButton) {
                console.log('User tapped custom button: ', res.customButton);
                // alert(res.customButton);
              } else {
                setLocalPhotos([...localPhotos, ...res.assets]);
              }
            },
          );
          break;
        default:
          break;
      }
    },
    [localPhotos],
  );

  const isEmptyQr = React.useMemo(() => {
    return (
      qrCode &&
      Object.keys(qrCode).length === 0 &&
      Object.getPrototypeOf(qrCode) === Object.prototype
    );
  }, [qrCode]);

  const onActionDeleteDone = index => {
    if (index === 0) {
      const array = [...localPhotos];
      array.splice(selectedPhotoIndex, 1);
      setLocalPhotos(array);
    }
  };

  return (
    <TouchableOpacity onPress={() => setOpen(false)} activeOpacity={1}>
      <View style={{height: windowHeight - 115 - headerHeight}}>
        <ProgressLoader
          visible={uploading || submitting}
          isModal={true}
          isHUD={true}
          hudColor={'#000000'}
          color={'#FFFFFF'}
        />
        <Modal
          presentationStyle="pageSheet"
          visible={scan}
          statusBarTranslucent={true}
          animationType="fade"
          transparent={false}
          onRequestClose={() => setScan(false)}>
          {scan && (
            <QRCodeScanner
              reactivate={false}
              showMarker={true}
              ref={node => {
                scanner.current = node;
              }}
              onRead={onQRRead}
              topContent={
                <Text style={styles.centerText}>Scan to Checkin</Text>
              }
              bottomContent={
                <View>
                  <TouchableOpacity
                    style={styles.buttonTouchable}
                    onPress={() => {
                      setScan(false);
                    }}>
                    <Text style={styles.buttonTextStyle}>Stop Scan</Text>
                  </TouchableOpacity>
                </View>
              }
            />
          )}
        </Modal>
        <ScrollView
          style={{
            display: 'flex',
            overflow: 'scroll',
            height: '100%',
            marginHorizontal: 15,
          }}>
          <View style={{alignItems: 'center', paddingTop: 20}}>
            {isEmptyQr ? (
              <TouchableOpacity
                onPress={() => {
                  setScan(true);
                }}
                style={{
                  fontSize: 21,
                  backgroundColor: colors.primary,
                  marginTop: 10,
                  width: deviceWidth - 62,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 44,
                }}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                  Scan QR
                </Text>
              </TouchableOpacity>
            ) : (
              <Image
                style={{height: 160, width: 160, resizeMode: 'cover'}}
                source={{
                  uri: `${envs.BACKEND_URL}parking-space/qr-code/${qrCode?.id}`,
                }}
              />
            )}
          </View>
          <Text
            style={{
              justifyContent: 'center',
              paddingTop: 20,
              width: '100%',
              fontWeight: '500',
              fontSize: 18,
            }}>
            Vehicle Image
          </Text>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            {renderSelectPhotoControl(localPhotos)}
          </View>
          <Text
            style={{
              width: '100%',
              color: colors.danger,
              paddingTop: 4,
              fontSize: 12,
              opacity: errors.photos ? 1 : 0,
            }}>
            Please add at least 1 photo
          </Text>

          <Text
            style={{
              width: '100%',
              fontWeight: '500',
              fontSize: 18,
              paddingTop: 20,
            }}>
            Vehicle Information
          </Text>
          <View style={{width: '100%'}}>
            <Input
              error={errors.plateNumber}
              onChangeText={txt => {
                setPlateNumber(txt);
              }}
              value={plateNumber}
              label="Plate Number*"
              placeholder="Enter Plate Number"
            />
          </View>
          <Text
            style={{
              width: '100%',
              marginBottom: 5,
            }}>
            Vehicle Information*
          </Text>
          <DropDownPicker
            listMode="SCROLLVIEW"
            searchable
            closeOnBackPressed
            style={{
              backgroundColor: 'transparent',
              borderRadius: 4,
              borderWidth: 1,
              borderColor: colors.grey,
              paddingHorizontal: 5,
              height: 42,
            }}
            textStyle={{
              fontSize: 14,
            }}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            placeholder="Select vehicle type"
            placeholderStyle={{color: colors.grey}}
            setValue={setValue}
            setItems={setItems}
          />
          <Text
            style={{
              width: '100%',
              color: colors.danger,
              paddingTop: 4,
              fontSize: 12,
              opacity: errors.vehicleType ? 1 : 0,
            }}>
            Please pick type of vehicle
          </Text>
          <View style={{width: '100%'}}>
            <Input
              multiline
              onChangeText={txt => {
                setDescription(txt);
              }}
              value={description}
              label="Description"
              placeholder="Enter Description"
            />
          </View>
          <View
            style={{
              paddingTop: 10,
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <View style={{width: '40%'}}>
              <CustomButton
                disabled={uploading}
                onPress={onSubmit}
                // loading={isLoading}
                primary
                title="Submit"
              />
            </View>
            <View style={{width: '40%'}}>
              <CustomButton danger onPress={onCancel} title="Cancel" />
            </View>
          </View>

          <ActionSheet
            ref={actionSheetRef}
            title={'Confirm delete photo'}
            options={['Confirm', 'Cancel']}
            cancelButtonIndex={1}
            destructiveButtonIndex={0}
            onPress={index => {
              onActionDeleteDone(index);
            }}
          />
          <ActionSheet
            ref={actionSheetSelectPhotoRef}
            title={'Select photo'}
            options={['Take Photo...', 'Choose from Library...', 'Cancel']}
            cancelButtonIndex={2}
            destructiveButtonIndex={1}
            onPress={index => {
              onActionSelectPhotoDone(index);
            }}
          />
        </ScrollView>
      </View>
    </TouchableOpacity>
  );
});

export default CheckInComponent;
