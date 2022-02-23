import React, {
  useState,
  useCallback,
  forwardRef,
  useRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import styles from './styles';
import Input from '../common/Input';
import DropDownPicker from 'react-native-dropdown-picker';
import colors from '../../assets/theme/colors';
import {useNavigation} from '@react-navigation/native';
import Icon from '../../components/common/Icon';
import CustomButton from '../../components/common/CustomButton';

// eslint-disable-next-line react/display-name
const CheckInComponent = forwardRef((props, ref) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState();
  const [localPhotos, setLocalPhotos] = useState([]);
  const actionSheetSelectPhotoRef = useRef(null);
  const actionSheetRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Xe Tay Ga', value: 'Xe Tay Ga'},
    {label: 'Xe Gắn Máy', value: 'Xe Gắn Máy'},
  ]);
  const [description, setDescription] = useState('');
  const [plateNumber, setPlateNumber] = useState('');

  useImperativeHandle(ref, () => ({
    resetCheckIn() {
      setValue(null);
      setDescription('');
      setPlateNumber('');
      setLocalPhotos([]);
    },
  }));

  const onSubmit = useCallback(() => {}, []);

  const onCancel = () => {
    // eslint-disable-next-line react/prop-types
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
        <Image style={styles.photo} source={{uri: photo.path}} />
      </TouchableOpacity>
    ));
  };
  const renderSelectPhotoControl = photos => {
    return (
      <View style={styles.photoList} horizontal={true}>
        {renderListPhotos(photos)}
        <TouchableOpacity onPress={onPressAddPhotoBtn}>
          <View style={[styles.addButton, styles.photo]}>
            <Text style={styles.addButtonText}>+</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  const onActionSelectPhotoDone = useCallback(
    index => {
      switch (index) {
        case 0:
          ImagePicker.openCamera({}).then(image => {
            setLocalPhotos([...localPhotos, image]);
          });
          break;
        case 1:
          ImagePicker.openPicker({
            multiple: true,
            maxFiles: 10,
            mediaType: 'photo',
          })
            .then(images => {
              setLocalPhotos([...localPhotos, ...images]);
            })
            .catch(error => {
              console.log(error);
            });
          break;
        default:
          break;
      }
    },
    [localPhotos],
  );

  const onActionDeleteDone = index => {
    if (index === 0) {
      const array = [...localPhotos];
      array.splice(selectedPhotoIndex, 1);
      setLocalPhotos(array);
    }
  };

  return (
    <SafeAreaView
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 15,
      }}>
      <Text
        style={{
          paddingTop: 20,
          width: '100%',
          fontWeight: '500',
          fontSize: 18,
        }}>
        Vehicle Image
      </Text>
      <ScrollView style={styles.scrollView}>
        {renderSelectPhotoControl(localPhotos)}
      </ScrollView>
      <Text
        style={{
          width: '100%',
          fontWeight: '500',
          fontSize: 18,
          paddingTop: 40,
        }}>
        Vehicle Information
      </Text>
      <View style={{width: '100%'}}>
        <Input
          // error={errors?.description?.[0]}
          onChangeText={value => {
            setPlateNumber(value);
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
      <View style={{width: '100%'}}>
        <Input
          multiline
          onChangeText={value => {
            setDescription(value);
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
            // disabled={isLoading}
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
    </SafeAreaView>
  );
});

export default CheckInComponent;
