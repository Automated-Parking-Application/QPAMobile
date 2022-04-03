import React from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import colors from '../../../assets/theme/colors';
import Icon from '../../common/Icon';
import styles from './styles';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

// eslint-disable-next-line react/display-name
const ImagePicker = React.forwardRef(({onFileSelected}, ref) => {
  const options = [
    {
      name: 'Take from camera',
      icon: <Icon color={colors.grey} size={21} name="camera" />,
      onPress: () => {
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
              onFileSelected(res.assets[0]);
              console.log(res.assets)
            }
          },
        );
      },
    },
    {
      name: 'Choose from Gallery',
      icon: <Icon name="image" color={colors.grey} size={21} />,
      onPress: () => {
        launchImageLibrary(
          {
            title: 'Select Image',
            customButtons: [
              {
                name: 'customOptionKey',
                title: 'Choose file from Custom Option',
              },
            ],
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
            } else {
              onFileSelected(res.assets[0]);
              console.log(res.assets[0])

            }
          },
        );
      },
    },
  ];
  return (
    <RBSheet
      ref={ref}
      height={190}
      openDuration={250}
      dragFromTopOnly
      closeOnDragDown
      customStyles={{
        container: {
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        },
      }}>
      <View style={styles.optionsWrapper}>
        {options.map(({name, onPress, icon}) => (
          <TouchableOpacity
            onPress={onPress}
            style={styles.pickerOption}
            key={name}>
            {icon}
            <Text style={styles.text}>{name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </RBSheet>
  );
});

export default ImagePicker;
