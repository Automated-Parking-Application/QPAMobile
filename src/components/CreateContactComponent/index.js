import React, {useState, useMemo} from 'react';
import moment from 'moment';
import {
  View,
  Text,
  Switch,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Input as FakeInput } from 'react-native-elements';

import Container from '../common/Container';
import CustomButton from '../common/CustomButton';
import Input from '../common/Input';
import Message from '../common/Message';
import styles from './styles';
import CountryPicker from 'react-native-country-picker-modal';
import {DEFAULT_IMAGE_URI} from '../../constants/general';
import colors from '../../assets/theme/colors';
import ImagePicker from '../common/ImagePicker';
import DatePicker from 'react-native-date-picker';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Modal from 'react-native-modalbox';

const CreateContactComponent = ({
  loading,
  error,
  onChangeText,
  setForm,
  errors,
  onSubmit,
  toggleValueChange,
  form,
  sheetRef,
  openSheet,
  localFile,
  onFileSelected,
}) => {
  const [openStartModal, setOpenStartModal] = useState(false);
  const [openEndModal, setOpenEndModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const {width, height} = Dimensions.get('window');

  const isValidateForm = useMemo(() => {
    return (
      form.name &&
      form.address &&
      Date.parse(form.startTime) < Date.parse(form.endTime)
    );
  }, [form]);

  return (
    <View style={styles.container}>
      <Modal
        entry="bottom"
        backdropPressToClose={true}
        isOpen={modalVisible}
        style={{
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          height,
          width,
          backgroundColor: 'transparent',
        }}
        onClosed={() => setModalVisible(false)}>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width,
            height: 500,
            borderTopLeftRadius: 20,
            justifyContent: 'center',
            padding: 20,
            alignItems: 'center',
            borderTopRightRadius: 20,
            backgroundColor: 'white',
            fontSize: 22,
          }}>
          <GooglePlacesAutocomplete
            placeholder="Search"
            textInputProps={{
              InputComp: FakeInput,
              errorStyle: { color: 'red' },
            }}
            onPress={(data, details = null) => {
              setModalVisible(false)
              onChangeText({name: 'address', value: data.description});
            }}
            onFail={error => console.log(error)}
            query={{
              key: 'AIzaSyADX9pr4gKB-cLS3lxtMU2JsskKlwnbbM4',
              language: 'vi',
            }}
          />
        </View>
      </Modal>
      <Container>
        <Image
          width={150}
          height={150}
          source={{
            uri:
              localFile?.path ||
              localFile ||
              'https://bppl.kkp.go.id/uploads/publikasi/karya_tulis_ilmiah/default.jpg',
          }}
          style={styles.imageView}
        />
        <TouchableOpacity onPress={openSheet}>
          <Text style={styles.chooseText}>Add picture</Text>
        </TouchableOpacity>
        <Input
          onChangeText={value => {
            onChangeText({name: 'name', value: value});
          }}
          label="Name"
          value={form.name || ''}
          placeholder="Enter Name"
          error={errors?.name}
        />
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}>
          <Input
            disabled
            pointerEvents="none"
            error={errors?.address}
            onChangeText={value => {
              onChangeText({name: 'address', value: value});
            }}
            value={form.address || ''}
            label="Address"
            placeholder="Enter Address"
          />
        </TouchableOpacity>

        <Input
          multiline={true}
          numberOfLines={4}
          error={errors?.description?.[0]}
          onChangeText={value => {
            onChangeText({name: 'description', value: value});
          }}
          value={form.description || ''}
          label="Description"
          placeholder="Enter Description"
        />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <Text style={styles.chooseText}>Start Time</Text>
          <Text>{moment(form.startTime).format('LT')}</Text>
          <CustomButton
            style={styles.pickButton}
            secondary
            title="Pick Start Time"
            onPress={() => setOpenStartModal(true)}
          />
          <DatePicker
            modal
            open={openStartModal}
            mode="time"
            date={new Date(form.startTime)}
            onConfirm={date => {
              setOpenStartModal(false);
              onChangeText({name: 'startTime', value: date});
            }}
            onCancel={() => {
              setOpenStartModal(false);
            }}
          />
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <Text style={styles.chooseText}>End Time</Text>
          <Text>{moment(form.endTime).format('LT')}</Text>
          <CustomButton
            secondary
            style={styles.pickButton}
            title="Pick End Time"
            onPress={() => setOpenEndModal(true)}
          />
          <DatePicker
            modal
            open={openEndModal}
            mode="time"
            date={new Date(form.endTime)}
            onConfirm={date => {
              setOpenEndModal(false);
              onChangeText({name: 'endTime', value: date});
            }}
            onCancel={() => {
              setOpenEndModal(false);
            }}
          />
        </View>
        {errors?.time && (
          <Text style={{color: colors.danger, paddingTop: 4, fontSize: 12}}>
            {errors.time}
          </Text>
        )}
        <Input
          error={errors?.postingTime?.[0]}
          keyboardType="number-pad"
          onChangeText={value => {
            onChangeText({
              name: 'postingTime',
              value: value.replace(/[^0-9]/g, ''),
            });
          }}
          value={form.postingTime || ''}
          label="Posting Time (hours)"
          placeholder="Enter Posting Time"
        />
        <CustomButton
          loading={loading}
          disabled={loading || !isValidateForm}
          onPress={onSubmit}
          primary
          title="Submit"
        />
      </Container>

      <ImagePicker onFileSelected={onFileSelected} ref={sheetRef} />
    </View>
  );
};

export default CreateContactComponent;
