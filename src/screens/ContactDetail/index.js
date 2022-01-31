import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState, useRef} from 'react';
import {ActivityIndicator, Alert, TouchableOpacity, View} from 'react-native';
import colors from '../../assets/theme/colors';
import Icon from '../../components/common/Icon';
import ContactDetailsComponent from '../../components/ContactDetailsComponent';
import {PARKING_SPACE_LIST} from '../../constants/routeNames';
import deleteContact from '../../context/actions/contacts/deleteContact';
import editContact from '../../context/actions/contacts/editContact';
import uploadImage from '../../helpers/uploadImage';
import {useDispatch, useSelector} from 'react-redux';

const ContactDetails = () => {
  const dispatch = useDispatch();
  const {params: {item = {}} = {}} = useRoute();
  // const {
  //   contactsDispatch,
  //   contactsState: {
  //     deleteContact: {loading},
  //   },
  // } = useContext(GlobalContext);

  const {loading} = useSelector(
    state => state.parkingSpaces.deleteParkingSpace,
  );
  const {setOptions, navigate} = useNavigation();
  const sheetRef = useRef(null);
  const [localFile, setLocalFile] = useState(null);
  const [updatingImage, setUpdatingImage] = useState(false);
  const [uploadSucceeded, setUploadSucceeded] = useState(false);

  useEffect(() => {
    if (item) {
      setOptions({
        title: item.name,
        headerRight: () => {
          return (
            <View style={{flexDirection: 'row', paddingRight: 10}}>
              <TouchableOpacity>
                <Icon
                  size={21}
                  color={colors.grey}
                  name={item.is_favorite ? 'star' : 'star-border'}
                  type="material"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Delete!',
                    'Are you sure you want to disable parking ' + item.name,
                    [
                      {
                        text: 'Cancel',
                        onPress: () => {},
                      },

                      {
                        text: 'OK',
                        onPress: () => {
                          dispatch(deleteContact(item.id))(() => {
                            navigate(PARKING_SPACE_LIST);
                          });
                        },
                      },
                    ],
                  );
                }}
                style={{paddingLeft: 10}}>
                {loading ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Icon
                    color={colors.grey}
                    size={21}
                    name="delete"
                    type="material"
                  />
                )}
              </TouchableOpacity>
            </View>
          );
        },
      });
    }
  }, [item, loading]);

  const closeSheet = () => {
    if (sheetRef.current) {
      sheetRef.current.close();
    }
  };
  const openSheet = () => {
    if (sheetRef.current) {
      sheetRef.current.open();
    }
  };

  const onFileSelected = image => {
    closeSheet();
    setLocalFile(image);
    setUpdatingImage(true);
    uploadImage(image)(url => {
      const {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        country_code: phoneCode,
        is_favorite: isFavorite,
      } = item;
      // editContact(
      //   {
      //     firstName,
      //     lastName,
      //     phoneNumber,
      //     isFavorite,
      //     phoneCode,
      //     contactPicture: url,
      //   },
      //   item.id,
      // )(contactsDispatch)((item) => {
      //   setUpdatingImage(false);
      //   setUploadSucceeded(true);
      //   // navigate(CONTACT_DETAIL, {item});
      // });
    })(err => {
      console.log('err :>> ', err);
      setUpdatingImage(false);
    });
  };

  return (
    <ContactDetailsComponent
      sheetRef={sheetRef}
      onFileSelected={onFileSelected}
      openSheet={openSheet}
      contact={item}
      localFile={localFile}
      uploadSucceeded={uploadSucceeded}
      updatingImage={updatingImage}
    />
  );
};

export default ContactDetails;
