import React, {useEffect, useRef, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import CreateContactComponent from '../../components/CreateContactComponent';
import createParkingSpace from '../../context/actions/parkingSpaces/createParkingSpace';
import editParkingSpace from '../../context/actions/parkingSpaces/editParkingSpace';
import moment from 'moment';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  PARKING_SPACE_DETAIL,
  PARKING_SPACE_LIST,
} from '../../constants/routeNames';
import uploadImage from '../../helpers/uploadImage';

const CreateContact = () => {
  const dispatch = useDispatch();
  const {loading, error} = useSelector(
    state => state.parkingSpaces.createParkingSpace,
  );

  const sheetRef = useRef(null);
  const [form, setForm] = useState({
    startTime: moment(),
    endTime: moment(),
  });
  const [errors, setErrors] = useState({});

  const [uploading, setIsUploading] = useState(false);
  const {navigate, setOptions} = useNavigation();
  const {params} = useRoute();

  const [localFile, setLocalFile] = useState(null);

  useEffect(() => {
    if (params?.contact) {
      setOptions({title: 'Update Parking Space'});
      const {
        name,
        image,
        address,
        description,
        startTime,
        endTime,
        postingTime,
      } = params?.contact || {};

      setForm(prev => {
        return {
          startTime: startTime || prev.startTime,
          endTime: endTime || prev.endTime,
          name,
          image,
          address,
          description,
          postingTime,
        };
      });

      if (params?.contact?.image) {
        setLocalFile(params?.contact.image);
      }
    }
  }, [params?.contact, setOptions]);

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
      if (localFile?.fileSize) {
        setIsUploading(true);
        uploadImage(localFile)(url => {
          setIsUploading(false);
          dispatch(
            editParkingSpace(
              {...form, image: url, status: params?.contact.status},
              params?.contact.id,
            ),
          )(item => {
            navigate(PARKING_SPACE_DETAIL, {item});
          });
        })(err => {
          console.log('err :>> ', err);
          setIsUploading(false);
        });
      } else {
        dispatch(
          editParkingSpace(
            {...form, status: params?.contact.status},
            params?.contact.id,
          ),
        )(item => {
          navigate(PARKING_SPACE_DETAIL, {item});
        });
      }
    } else {
      if (localFile?.fileSize) {
        setIsUploading(true);
        uploadImage(localFile)(url => {
          setIsUploading(false);
          dispatch(createParkingSpace({...form, image: url}))(() => {
            navigate(PARKING_SPACE_LIST);
          });
        })((err) => {
          console.log(err);
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
