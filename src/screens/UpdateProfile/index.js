import React, {useState, useCallback, useRef} from 'react';
import Container from '../../components/common/Container';
import {Text, View, TouchableOpacity, Image, KeyboardAvoidingView} from 'react-native';
import styles from './styles';
import {useSelector, useDispatch} from 'react-redux';
import Message from '../../components/common/Message';
import Input from '../../components/common/Input';
import CustomButton from '../../components/common/CustomButton';
import colors from '../../assets/theme/colors';
import ImagePicker from '../../components/common/ImagePicker';
import uploadImage from '../../helpers/uploadImage';
import updateProfile from '../../context/actions/auth/updateProfile';
const UpdateProfile = () => {
  const [errors, setErrors] = useState({});
  const sheetRef = useRef(null);
  const [localFile, setLocalFile] = useState(null);
  const [updatingImage, setUpdatingImage] = useState(false);

  const [uploading, setIsUploading] = useState(false);
  const [uploadSucceeded, setUploadSucceeded] = useState(false);
  const dispatch = useDispatch();
  const {error, loading, data} = useSelector(state => state.auth);
  const {address, fullName, avatar} =
    useSelector(state => state.auth.data?.User) || {};
  const [form, setForm] = useState({fullName, address, avatar});
  const onSubmit = useCallback(() => {
    if (!form.fullName) {
      setErrors(prev => {
        return {...prev, name: 'Please add your name'};
      });
    }
    if (!form.address) {
      setErrors(prev => {
        return {...prev, address: 'Please add your address'};
      });
    }

    if (localFile?.fileSize) {
      setIsUploading(true);
      uploadImage(localFile)(url => {
        setIsUploading(false);
        dispatch(updateProfile({...form, avatar: url}))(() => {});
      })(err => {
        setIsUploading(false);
      });
    } else {
      dispatch(updateProfile(form))(() => {});
    }
  }, [dispatch, form, localFile]);

  const onChange = ({name, value}) => {
    setForm({...form, [name]: value});
  };
  const onFileSelected = image => {
    closeSheet();
    setLocalFile(image);
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
  return (
    <KeyboardAvoidingView behavior="position">
      <View style={styles.form}>
        {!uploadSucceeded && (
          <View style={{alignItems: 'center', paddingVertical: 20}}>
            <Image
              width={150}
              height={150}
              source={{
                uri:
                  localFile?.path ||
                  avatar ||
                  'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png',
              }}
              style={styles.imageView}
            />

            <TouchableOpacity
              onPress={() => {
                openSheet();
              }}>
              <Text style={{color: colors.primary}}>
                {' '}
                {updatingImage
                  ? 'updating...'
                  : avatar
                  ? 'Update picture'
                  : 'Add picture'}{' '}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {error?.error && (
          <Message retry danger retryFn={onSubmit} message={error?.error} />
        )}

        <Input
          label="Full Name"
          iconPosition="right"
          placeholder="Enter Full Name"
          value={form.fullName}
          onChangeText={value => {
            onChange({name: 'fullName', value});
          }}
          error={errors.fullName || error?.full_name?.[0]}
        />
        <Input
          label="Address"
          iconPosition="right"
          placeholder="Enter Address"
          value={form.address}
          error={errors.address || error?.address?.[0]}
          onChangeText={value => {
            onChange({name: 'address', value});
          }}
        />

        <CustomButton
          loading={loading}
          onPress={onSubmit}
          disabled={loading}
          primary
          title="Submit"
        />
      </View>
      <ImagePicker onFileSelected={onFileSelected} ref={sheetRef} />
    </KeyboardAvoidingView>
  );
};

export default UpdateProfile;
