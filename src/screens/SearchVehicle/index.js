import React from 'react';
import {View, Text, Dimensions, TouchableOpacity, Alert} from 'react-native';
import Input from '../../components/common/Input';
import CustomButton from '../../components/common/CustomButton';
const {width} = Dimensions.get('screen');
import styles from './styles';
import colors from '../../assets/theme/colors';
import Icon from '../../components/common/Icon';
import axios from '../../helpers/axiosInstance';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {PARKING_RESERVATION_DETAIL} from '../../constants/routeNames';

const SearchVehicle = () => {
  const [searchText, setSearchText] = React.useState();
  const [error, setError] = React.useState('');
  const [result, setResult] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const {navigate} = useNavigation();

  const selectedParkingId = useSelector(
    state => state?.parkingSpaces?.selectedParkingSpace?.id,
  );
  const onSubmit = async () => {
    if (searchText?.trim().length === 0 || !searchText) {
      setError('Please enter plate number');
    } else {
      setIsLoading(true);
      axios
        .get(
          `/parking-space/${selectedParkingId}/parking-reservation/search/${searchText.replaceAll(
            /\s/g,
            '',
          )}`,
        )
        .then(res => {
          console.log(res);
          setResult(res.data);
          setIsLoading(false);
        })
        .catch(err => {
          setResult(null);
          Alert.alert(
            'Error!',
            err?.response?.data || 'Something went wrong!',
            [
              {
                text: 'Try Again',
                onPress: () => {},
              },
            ],
          );
          setIsLoading(false);
        });
    }
  };
  const renderHeader = () => (
    <View
      style={{
        paddingHorizontal: 10,
      }}>
      <Input
        autoCapitalize="characters"
        autoCorrect={false}
        error={error}
        onChangeText={setSearchText}
        status="info"
        placeholder="Search Plate Number"
        textStyle={{color: '#000'}}
      />
    </View>
  );
  return (
    <View>
      <Text
        style={{
          fontSize: 28,
          display: 'flex',
          textAlign: 'center',
          paddingTop: 20,
        }}>
        Lost QR?
      </Text>
      {renderHeader()}
      <View
        style={{
          width: width,
          borderRadius: 100 / 2,
          alignItems: 'center',
        }}>
        <CustomButton
          // disabled={uploading}
          onPress={onSubmit}
          loading={isLoading}
          primary
          title="Search"
        />
      </View>
      {result && typeof result === 'object' && (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => {
            navigate(PARKING_RESERVATION_DETAIL, {
              parkingReservation: result,
              refreshFn: null,
            });
          }}>
          <View style={styles.item}>
            <View style={{paddingLeft: 20}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.name, {color: colors.black}]}>
                  {result.vehicle.plateNumber}
                </Text>
              </View>
              <Text style={styles.phoneNumber}>
                {result.vehicle.vehicleType}
              </Text>
            </View>
          </View>
          <Icon name="right" type="ant" size={18} color={colors.grey} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchVehicle;
