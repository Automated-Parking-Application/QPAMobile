import React, {useState} from 'react';
import {View, Text, Switch, Image, TouchableOpacity} from 'react-native';
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

  return (
    <View style={styles.container}>
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
          <Text style={styles.chooseText}>Upload image of Parking Space</Text>
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
        <Input
          error={errors?.address}
          onChangeText={value => {
            onChangeText({name: 'address', value: value});
          }}
          value={form.address || ''}
          label="Address"
          placeholder="Enter Address"
        />
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
          <Text>
            {form.startTime.getHours()}:{form.startTime.getMinutes()}
          </Text>
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
            date={form.startTime}
            onConfirm={date => {
              setOpenStartModal(false);
              onChangeText({name: 'startTime', value: date});
              console.log(date);
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
          <Text>
            {form.endTime.getHours()}:{form.endTime.getMinutes()}
          </Text>
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
            date={form.endTime}
            onConfirm={date => {
              setOpenEndModal(false);
              onChangeText({name: 'endTime', value: date});
              console.log(date);
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
        {/* <Input
          icon={
            <CountryPicker
              withFilter
              withFlag
              countryCode={form.countryCode || undefined}
              withCountryNameButton={false}
              withCallingCode
              withCallingCodeButton
              withEmoji
              onSelect={v => {
                const phoneCode = v.callingCode[0];
                const cCode = v.cca2;
                setForm({...form, phoneCode, countryCode: cCode});
              }}
            />
          }
          style={{paddingLeft: 10}}
          iconPosition="left"
          value={form.phoneNumber || ''}
          error={errors?.phone_number?.[0]}
          onChangeText={value => {
            onChangeText({name: 'phoneNumber', value: value});
          }}
          label="Phone Number"
          placeholder="Enter phone number"
        /> */}
        {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 10,
          }}>
          <Text style={{fontSize: 17}}>Add to favorites</Text>

          <Switch
            trackColor={{false: 'blue', true: colors.primary}}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleValueChange}
            value={form.isFavorite}
          />
        </View> */}
        <CustomButton
          loading={loading}
          disabled={loading}
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
