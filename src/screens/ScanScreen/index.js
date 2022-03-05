import React, {useState, useRef} from 'react';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import axios from '../../helpers/axiosInstance';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {useHeaderHeight} from '@react-navigation/stack';
import {PARKING_RESERVATION_DETAIL} from '../../constants/routeNames';
const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;
const windowHeight = Dimensions.get('window').height;
const styles = {
  textTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    padding: 16,
    color: 'white',
  },
  textTitle1: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    padding: 16,
    color: 'black',
  },
  scanCardView: {
    width: deviceWidth - 32,
    height: deviceHeight / 2,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    backgroundColor: 'white',
  },
  buttonScan: {
    width: 42,
  },
  descText: {
    padding: 16,
    textAlign: 'justify',
    fontSize: 16,
  },

  highlight: {
    fontWeight: '700',
  },

  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 16,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonTouchable: {
    fontSize: 21,
    backgroundColor: '#ff0066',
    marginTop: 10,
    width: deviceWidth - 62,
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
  },
  buttonTextStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
};
const ScanScreen = () => {
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const [scan, setScan] = useState(false);
  const [scanResult, setScanResult] = useState(false);
  const scanner = useRef(null);
  const selectedParkingId = useSelector(
    state => state?.parkingSpaces?.selectedParkingSpace?.id,
  );
  const onSuccess = e => {
    axios
      .get(`/parking-space/${selectedParkingId}/parking-reservation`, {
        code: e.data,
      })
      .then(item => {
        navigation.navigate(PARKING_RESERVATION_DETAIL, {
          parkingReservation: item.data,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <View
      style={{
        height: windowHeight - 115 - headerHeight,
        justifyContent: 'center',
        paddingBottom: 10,
      }}>
      <ScrollView
        style={{
          display: 'flex',
          overflow: 'scroll',
          height: '100%',
        }}>
        {!scan && !scanResult && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: windowHeight - 115 - headerHeight,
              display: 'flex',
              flex: 1,
            }}>
            <TouchableOpacity
              onPress={() => {
                setScan(true);
              }}
              style={styles.buttonTouchable}>
              <Text style={styles.buttonTextStyle}>Click to Scan !</Text>
            </TouchableOpacity>
          </View>
        )}

        {scan && (
          <QRCodeScanner
            reactivate={true}
            showMarker={true}
            ref={node => {
              scanner.current = node;
            }}
            onRead={onSuccess}
            topContent={
              <Text style={styles.centerText}>
                Scan the parking reservation QR
              </Text>
            }
            bottomContent={
              <View>
                <TouchableOpacity
                  style={styles.buttonTouchable}
                  onPress={() => {
                    setScan(false);
                  }}>
                  <Text style={styles.buttonTextStyle}>Stop Scan</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </ScrollView>
    </View>
  );
};

export default ScanScreen;
