import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState, useRef} from 'react';
import {ActivityIndicator, Alert, TouchableOpacity, View} from 'react-native';
import colors from '../../assets/theme/colors';
import Icon from '../../components/common/Icon';
import ContactDetailsComponent from '../../components/ContactDetailsComponent';
import {
  PARKING_SPACE_LIST,
  CREATE_PARKING_SPACE,
  PARKING_SPACE_DETAIL
} from '../../constants/routeNames';
import editParkingSpace from '../../context/actions/parkingSpaces/editParkingSpace';
import deleteParkingSpace from '../../context/actions/parkingSpaces/deleteParkingSpace';
import uploadImage from '../../helpers/uploadImage';
import {useDispatch, useSelector} from 'react-redux';

const ContactDetails = () => {
  const dispatch = useDispatch();
  const {params: {item = {}} = {}} = useRoute();

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
                  name="edit"
                  onPress={() => {
                    navigate(CREATE_PARKING_SPACE, {
                      contact: item,
                      editing: true,
                    });
                  }}
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
                          dispatch(deleteParkingSpace(item.id))(() => {
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
  }, [dispatch, item, loading, navigate, setOptions]);

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
        name,
        address,
        description,
        startTime,
        endTime,
        postingTime,
        status,
      } = item;

      dispatch(
        editParkingSpace(
          {
            name,
            address,
            description,
            startTime,
            endTime,
            postingTime,
            status,
            image: url,
          },
          item.id,
        )
      )(parking => {
        setUpdatingImage(false);
        setUploadSucceeded(true);
        navigate(PARKING_SPACE_DETAIL, {item: parking});
      });
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
