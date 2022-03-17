import React, {useState} from 'react';
import {View, Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import {Input as FakeInput} from 'react-native-elements';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MapView, {
  MarkerAnimated,
  AnimatedRegion,
  PROVIDER_GOOGLE,
  Marker,
  Animated,
} from 'react-native-maps';
import CustomButton from '../../components/common/CustomButton';
import {useHeaderHeight} from '@react-navigation/stack';
import Icon from '../../components/common/Icon';
import Geocoder from 'react-native-geocoding';
Geocoder.init('AIzaSyAIVTs-I42wAvZWBRX90M-2T9ar3XzQWwM');
const {width, height} = Dimensions.get('screen');

const AddressPicker = ({setModalVisible, onChangeText}) => {
  const headerHeight = useHeaderHeight();
  const mapRef = React.useRef(null);
  const ref = React.useRef();

  const [marker, setMarker] = useState({
    latitude: 10.8414899,
    longitude: 106.8078577,
    latitudeDelta: 0.003,
    longitudeDelta: 0.003,
  });
  const [pos, setPos] = useState('');

  return (
    <>
      <MapView.Animated
        onLongPress={e => {
          setMarker(e.nativeEvent.coordinate);
          Geocoder.from(e.nativeEvent.coordinate).then(json => {
            const addressComponent = json.results[0].formatted_address;
            console.log(json.results);
            setPos(addressComponent);
            ref.current?.setAddressText(addressComponent);
          });
        }}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.mapStyle}
        initialRegion={{
          latitude: 10.8414899,
          longitude: 106.8078577,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        }}
        region={new AnimatedRegion(marker)}
        mapType="standard">
        <MarkerAnimated
          draggable
          coordinate={new AnimatedRegion(marker)}
          onDragEnd={e => {
            setMarker(e.nativeEvent.coordinate);
            Geocoder.from(e.nativeEvent.coordinate).then(json => {
              const addressComponent = json.results[0].formatted_address;
              console.log(json.results);
              setPos(addressComponent);
              ref.current?.setAddressText(addressComponent);
            });
          }}
        />
      </MapView.Animated>
      <View
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          padding: 5,
          alignItems: 'flex-start',
          // paddingHorizontal: 10,
          // backgroundColor: 'white',
        }}>
        <View
          style={{
            backgroundColor: '#D6CFC7',
            width: 40,
            height: 40,
            borderRadius: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
            }}>
            <Icon
              type="material"
              style={{paddingLeft: 10}}
              size={25}
              name="arrow-back-ios"
            />
          </TouchableOpacity>
        </View>

        <GooglePlacesAutocomplete
          ref={ref}
          placeholder="Search"
          styles={{
            textInput: {
              borderRadius: 10,
              color: '#000',
              borderColor: '#666',
              backgroundColor: '#FFF',
              borderWidth: 1,
              height: 30,
              padding: 0,
              fontSize: 18,
            },
            textInputContainer: {
              flexDirection: 'row',
              height: 50,
            },
            poweredContainer: {
              justifyContent: 'flex-end',
              alignItems: 'center',
              borderBottomRightRadius: 5,
              borderBottomLeftRadius: 5,
              borderColor: '#c8c7cc',
              borderTopWidth: 0.5,
            },
            powered: {},
            listView: {},
            row: {
              backgroundColor: '#FFFFFF',
              padding: 13,
              height: 44,
              flexDirection: 'row',
            },
            separator: {
              height: 0.5,
              backgroundColor: '#c8c7cc',
            },
            description: {},
            loader: {
              flexDirection: 'row',
              justifyContent: 'flex-end',
              height: 20,
            },
          }}
          fetchDetails
          textInputProps={{
            InputComp: FakeInput,
            errorStyle: {color: 'red'},
          }}
          onPress={(data, details = null) => {
            // setModalVisible(false);
            setMarker({
              latitude: details?.geometry?.location.lat,
              longitude: details?.geometry?.location.lng,
            });
            setPos(data.description);
          }}
          onFail={error => console.log(error)}
          query={{
            key: 'AIzaSyAIVTs-I42wAvZWBRX90M-2T9ar3XzQWwM',
            language: 'vi',
          }}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          top: height - headerHeight - 100,
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          paddingHorizontal: 10,
          // backgroundColor: 'white',
        }}>
        <CustomButton
          style={{
            borderRadius: 30,
            width: (width / 3) * 2,
          }}
          // disabled={uploading}
          onPress={() => {
            onChangeText({name: 'address', value: pos});
            setModalVisible(false);
          }}
          // loading={isLoading}
          primary
          title="Pick"
        />
      </View>
    </>
    // </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width,
    height,
  },
});
export default AddressPicker;
