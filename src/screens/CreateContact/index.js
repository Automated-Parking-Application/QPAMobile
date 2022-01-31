import React, {useContext, useEffect, useRef, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import CreateContactComponent from '../../components/CreateContactComponent';
import createContact from '../../context/actions/contacts/createContact';
import createParkingSpace from '../../context/actions/parkingSpaces/createParkingSpace';
import {GlobalContext} from '../../context/Provider';
import {useNavigation, useRoute} from '@react-navigation/native';
import {CONTACT_DETAIL, PARKING_SPACE_LIST} from '../../constants/routeNames';
import uploadImage from '../../helpers/uploadImage';
import countryCodes from '../../utils/countryCodes';
import editContact from '../../context/actions/contacts/editContact';

const CreateContact = () => {
  // const {
  //   contactsDispatch,
  //   contactsState: {
  //     createContact: {loading, error},
  //   },
  //   parkingSpacesDispatch,
  // } = useContext(GlobalContext);

  const {loading, error} = useSelector(
    state => state.parkingSpaces.createParkingSpace,
  );
  const dispatch = useDispatch();

  const sheetRef = useRef(null);
  const [form, setForm] = useState({
    startTime: new Date(),
    endTime: new Date(),
  });
  const [errors, setErrors] = useState({});

  const [uploading, setIsUploading] = useState(false);
  const {navigate, setOptions} = useNavigation();
  const {params} = useRoute();

  const [localFile, setLocalFile] = useState(null);

  useEffect(() => {
    if (params?.contact) {
      setOptions({title: 'Update contact'});
      const {
        first_name: firstName,
        phone_number: phoneNumber,
        last_name: lastName,
        is_favorite: isFavorite,
        country_code: countryCode,
      } = params?.contact || {};

      setForm(prev => {
        return {
          ...prev,
          firstName,
          isFavorite,
          phoneNumber,
          lastName,
          phoneCode: countryCode,
        };
      });

      const country = countryCodes.find(item => {
        return item.value.replace('+', '') === countryCode;
      });

      if (country) {
        setForm(prev => {
          return {
            ...prev,
            countryCode: country.key.toUpperCase(),
          };
        });
      }

      if (params?.contact?.contact_picture) {
        setLocalFile(params?.contact.contact_picture);
      }
    }
  }, []);

  const onChangeText = ({name, value}) => {
    setForm({...form, [name]: value});
  };

  const onSubmit = () => {
    if (!form.name) {
      setErrors(prev => {
        return {...prev, name: 'Please add name of parking space'};
      });
    }
    if (!form.address) {
      setErrors(prev => {
        return {...prev, address: 'Please add address of parking space'};
      });
    }
    if (Date.parse(form.startTime) >= Date.parse(form.endTime)) {
      setErrors(prev => {
        return {...prev, time: 'Start Time should be smaller than End Time'};
      });
    }
    if (params?.contact) {
      if (localFile?.size) {
        setIsUploading(true);
        uploadImage(localFile)(url => {
          setIsUploading(false);
          editContact(
            {...form, contactPicture: url},
            params?.contact.id,
          )(contactsDispatch)(item => {
            navigate(CONTACT_DETAIL, {item});
          });
        })(err => {
          console.log('err :>> ', err);
          setIsUploading(false);
        });
      } else {
        editContact(form, params?.contact.id)(contactsDispatch)(item => {
          navigate(CONTACT_DETAIL, {item});
        });
      }
    } else {
      if (localFile?.size) {
        setIsUploading(true);
        uploadImage(localFile)(url => {
          setIsUploading(false);
          dispatch(createParkingSpace({...form, image: url}))(() => {
            navigate(PARKING_SPACE_LIST);
          });
        })(err => {
          setIsUploading(false);
        });
      } else {
        dispatch(createParkingSpace(form))(() => {
          navigate(PARKING_SPACE_LIST);
        });
      }
    }
  };

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
  const toggleValueChange = () => {
    setForm({...form, isFavorite: !form.isFavorite});
  };

  const onFileSelected = image => {
    closeSheet();
    setLocalFile(image);
  };
  return (
    <CreateContactComponent
      errors={errors}
      onSubmit={onSubmit}
      onChangeText={onChangeText}
      form={form}
      setForm={setForm}
      loading={loading || uploading}
      toggleValueChange={toggleValueChange}
      error={error}
      sheetRef={sheetRef}
      closeSheet={closeSheet}
      openSheet={openSheet}
      onFileSelected={onFileSelected}
      localFile={localFile}
    />
  );
};

export default CreateContact;
