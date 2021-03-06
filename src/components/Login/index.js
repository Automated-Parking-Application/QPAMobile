import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Image, Text, View, KeyboardAvoidingView} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Container from '../../components/common/Container';
import CustomButton from '../../components/common/CustomButton';
import Input from '../../components/common/Input';
import {REGISTER} from '../../constants/routeNames';
import Message from '../common/Message';
import styles from './styles';

const LoginComponent = ({
  error,
  errors,
  form,
  justSignedUp,
  onChange,
  loading,
  onSubmit,
}) => {
  const {navigate} = useNavigation();
  const [isSecureEntry, setIsSecureEntry] = useState(true);
  return (
    <Container>
      <KeyboardAvoidingView behavior="position">
        <Image
          height={70}
          width={70}
          source={require('../../assets/images/logo.png')}
          style={styles.logoImage}
        />

        <View>
          <Text style={styles.title}>Welcome to QPA</Text>
          <Text style={styles.subTitle}>Please login here</Text>

          <View style={styles.form}>
            {justSignedUp && (
              <Message
                onDismiss={() => {}}
                success
                message="Account created successfully"
              />
            )}
            {error && !error.error && (
              <Message
                onDismiss={() => {}}
                danger
                message="invalid credentials"
              />
            )}
            {error?.error && (
              <Message danger onDismiss message={error?.error} />
            )}

            <Input
              label="Phone Number"
              iconPosition="right"
              placeholder="Enter Phone Number"
              value={form.phoneNumber || null}
              error={errors.phoneNumber || error?.phoneNumber?.[0]}
              onChangeText={value => {
                onChange({name: 'phoneNumber', value});
              }}
            />

            <Input
              label="Password"
              placeholder="Enter Password"
              secureTextEntry={isSecureEntry}
              icon={
                <TouchableOpacity
                  onPress={() => {
                    setIsSecureEntry(prev => !prev);
                  }}>
                  <Text>{isSecureEntry ? 'Show' : 'Hide'}</Text>
                </TouchableOpacity>
              }
              iconPosition="right"
              error={errors.password || error?.password?.[0]}
              onChangeText={value => {
                onChange({name: 'password', value});
              }}
            />

            <CustomButton
              disabled={loading}
              onPress={onSubmit}
              loading={loading}
              primary
              title="Submit"
            />

            <View style={styles.createSection}>
              <Text style={styles.infoText}>Need a new account?</Text>
              <TouchableOpacity
                onPress={() => {
                  navigate(REGISTER);
                }}>
                <Text style={styles.linkBtn}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default LoginComponent;
