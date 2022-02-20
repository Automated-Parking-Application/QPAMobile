import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ScanScreen from '../../screens/ScanScreen';
import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import Icon from '../../components/common/Icon';
const Tab = createBottomTabNavigator();

const Tabs = () => {
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
        name="SCsAN"
        component={ScanScreen}
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
        }}
      />
      <Tab.Screen
        name="SdsaCAN"
        component={ScanScreen}
        options={{
          tabBarIcon: ({focused}) => (
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
        name="SdCAN"
        component={ScanScreen}
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
