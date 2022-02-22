import React, {Fragment, useRef, useState, useCallback} from 'react';
import {
  View,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Header,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import styles from './styles';

const CheckInComponent = () => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState();
  const [localPhotos, setLocalPhotos] = useState([]);
  const actionSheetSelectPhotoRef = useRef(null);
  const actionSheetRef = useRef(null);
  const [logs, setLogs] = useState();

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
      <View style={styles.sectionContainer}>
        <ScrollView style={styles.photoList} horizontal={true}>
          {renderListPhotos(photos)}
          <TouchableOpacity onPress={onPressAddPhotoBtn}>
            <View style={[styles.addButton, styles.photo]}>
              <Text style={styles.addButtonText}>+</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };
  const onDoUploadPress = () => {
    if (localPhotos && localPhotos.length > 0) {
      let formData = new FormData();
      localPhotos.forEach(image => {
        const file = {
          uri: image.path,
          name:
            image.filename ||
            Math.floor(Math.random() * Math.floor(999999999)) + '.jpg',
          type: image.mime || 'image/jpeg',
        };
        formData.append('files', file);
      });

      axios
        .post('https://api.tradingproedu.com/api/v1/fileupload', formData)
        .then(response => {
          // this.setState({logs: JSON.stringify(response.data)});
          setLogs(JSON.stringify(response.data));
        })
        .catch(error => {
          alert(JSON.stringify(error));
        });
    } else {
      alert('No photo selected');
    }
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
              alert(JSON.stringify(error));
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
    <View style={{display: 'flex', alignItems: 'center', width: '100%'}}>
      <Text style={{paddingTop: 20, fontWeight: '500', fontSize: 18}}>
        Please upload photos of vehicle
      </Text>
      <View>
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <View style={styles.body}>
              {renderSelectPhotoControl(localPhotos)}
            </View>
          </ScrollView>
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
      </View>
    </View>
  );
};

export default CheckInComponent;
