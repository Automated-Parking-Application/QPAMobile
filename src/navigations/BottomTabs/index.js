import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ScanScreen from '../../screens/ScanScreen';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import React, {useState, useRef} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Icon from '../../components/common/Icon';
import {CHECK_IN, PARKING_SPACE_REPORT} from '../../constants/routeNames';
import CheckInScreen from '../../screens/CheckInScreen';
import HistoryScreen from '../../screens/HistoryScreen';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  const {setOptions, toggleDrawer, navigate} = useNavigation();
  const {selectedParkingSpace} = useSelector(state => state.parkingSpaces);
  const [start, setStart] = useState(false);
  const childRef = useRef();
  const selectedParkingId = useSelector(
    state => state?.parkingSpaces?.selectedParkingSpace?.id,
  );

  const requestUserPermission = React.useCallback(async () => {
    {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        // getFcmToken();
      }

      try {
        let checkToken = await AsyncStorage.getItem('fcmToken');
        console.log(checkToken);
        if (!checkToken) {
          try {
            const fcmToken = await messaging().getToken();
            if (fcmToken) {
              await AsyncStorage.setItem('fcmToken', fcmToken);
            }
          } catch (error) {
            console.log('error in fcmToken', error);
            alert(error?.message);
          }
        }
      } catch (error) {
        console.log('error in fcmToken', error);
        alert(error?.message);
      }

      try {
        messaging().onNotificationOpenedApp(async remoteMessage => {
          console.log(
            'Notification caused app to open from background state:',
            remoteMessage.notification,
          );
          navigate(PARKING_SPACE_REPORT);
        });

        // Check whether an initial notification is available
        messaging()
          .getInitialNotification()
          .then(async remoteMessage => {
            if (remoteMessage) {
              try {
                console.log(
                  'Notification caused app to open from quit state:',
                  remoteMessage.notification,
                );
                navigate(PARKING_SPACE_REPORT);
              } catch (error) {
                console.log(error);
              }
            }
          })
          .catch(error => console.log(error));

        messaging().onMessage(remoteMessage => {
          notifee.displayNotification({
            title: remoteMessage.notification.title,
            body: remoteMessage.notification.body,
          });
        });

        messaging().setBackgroundMessageHandler(async remoteMessage => {
          navigate(PARKING_SPACE_REPORT);
          console.log('Message received in the background!', remoteMessage);
        });
      } catch (error) {
        console.log('error', error);
      }
    }
  }, [navigate]);

  React.useEffect(() => {
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.PRESS:
          navigate(PARKING_SPACE_REPORT);
          console.log('User pressed notification', detail.notification);
          break;
      }
    });
  }, [navigate]);

  React.useEffect(() => {
    if (selectedParkingId) {
      requestUserPermission();
      messaging()
        .subscribeToTopic(selectedParkingId.toString())
        .then(() => {
          console.log(`Topic: ${selectedParkingId} Subcribed`);
        });
    }

    // return () => {
    //   if (selectedParkingId) {
    //     messaging()
    //       .unsubscribeFromTopic(selectedParkingId.toString())
    //       .then(() => {
    //         console.log(`Topic: ${selectedParkingId} Unsubcribed`);
    //       });
    //   }
    // };
  }, [requestUserPermission, selectedParkingId]);

  React.useEffect(() => {
    setOptions({
      title: selectedParkingSpace?.name,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            toggleDrawer();
          }}>
          <Icon type="material" style={{padding: 10}} size={25} name="menu" />
        </TouchableOpacity>
      ),
      headerRight: () =>
        start ? (
          <TouchableOpacity
            onPress={() => {
              childRef.current.resetCheckIn();
            }}>
            <Icon
              type="materialCommunity"
              style={{padding: 10}}
              size={25}
              name="rotate-left"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              navigate(PARKING_SPACE_REPORT);
            }}>
            <Icon
              type="ionicon"
              style={{padding: 10}}
              size={25}
              name="bar-chart-outline"
            />
          </TouchableOpacity>
        ),
    });
  }, [
    childRef,
    navigate,
    selectedParkingSpace?.name,
    setOptions,
    start,
    toggleDrawer,
  ]);

  const CustomTabBarButton = ({children, onPress}) => (
    <TouchableOpacity
      style={{
        top: -20,
        justifyContent: 'center',
        alignItems: 'center',
        ...style.shadow,
      }}
      onPress={onPress}>
      <View
        style={{
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundColor: '#273E4F',
        }}>
        {children}
      </View>
    </TouchableOpacity>
  );

  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        style: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: '#5F95BF',
          borderRadius: 15,
          height: 90,
          ...style.shadow,
        },
      }}>
      <Tab.Screen
        name={CHECK_IN}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
              <Icon
                name={'car-brake-parking'}
                type="materialCommunity"
                size={22}
                color={focused ? '#bc5c68' : '#fff'}
              />
              <Text style={{color: focused ? '#bc5c68' : '#fff'}}>Park In</Text>
            </View>
          ),
        }}>
        {props => (
          <CheckInScreen
            {...props}
            start={start}
            childRef={childRef}
            setStart={setStart}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="SdsaCAN"
        component={ScanScreen}
        options={{
          tabBarIcon: () => (
            <Icon
              name={'qr-code-scanner'}
              type="material"
              size={40}
              color={'#fff'}
            />
          ),
          tabBarButton: props => <CustomTabBarButton {...props} />,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
              <Icon
                name={'timeline'}
                type="material"
                size={22}
                color={focused ? '#bc5c68' : '#fff'}
              />
              <Text style={{color: focused ? '#bc5c68' : '#fff'}}>History</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const style = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export default Tabs;
