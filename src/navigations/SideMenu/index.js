import React from 'react';
import {
  Image,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import Container from '../../components/common/Container';
import {SETTINGS, LOGIN, LOGOUT} from '../../constants/routeNames';
import logoutUser from '../../context/actions/auth/logoutUser';
import {useDispatch, useSelector} from 'react-redux';
import removeSelectedParkingSpace from '../../context/actions/parkingSpaces/removeSelectedParkingSpace';

import styles from './styles';
import Icon from '../../components/common/Icon';

const SideMenu = ({navigation, authDispatch}) => {
  const dispatch = useDispatch();
  const hasCheckedInParkingSpace =
    typeof useSelector(
      state => state?.parkingSpaces?.selectedParkingSpace?.id,
    ) === 'number';

  const handleLogout = () => {
    navigation.toggleDrawer();
    Alert.alert('Logout!', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        onPress: () => {},
      },

      {
        text: 'OK',
        onPress: () => {
          dispatch(logoutUser());
        },
      },
    ]);
  };

  const menuItems = hasCheckedInParkingSpace
    ? [
        {
          icon: <Icon type="fontisto" size={17} name="player-settings" />,
          name: 'Settings',
          onPress: () => {
            navigation.navigate(SETTINGS);
          },
        },
        {
          icon: (
            <Icon
              type="materialCommunity"
              size={17}
              name="account-arrow-left"
            />
          ),
          name: 'Leave Parking Space',
          onPress: () => {
            dispatch(removeSelectedParkingSpace());
            navigation.toggleDrawer();
          },
        },
        {
          icon: <Icon type="material" size={17} name="logout" />,
          name: 'Logout',
          onPress: handleLogout,
        },
      ]
    : [
        {
          icon: <Icon type="fontisto" size={17} name="player-settings" />,
          name: 'Settings',
          onPress: () => {
            navigation.navigate(SETTINGS);
          },
        },
        {
          icon: <Icon type="material" size={17} name="logout" />,
          name: 'Logout',
          onPress: handleLogout,
        },
      ];
  return (
    <SafeAreaView>
      <Container>
        <Image
          height={70}
          width={70}
          source={require('../../assets/images/logo.png')}
          style={styles.logoImage}
        />

        <View style={{paddingHorizontal: 30}}>
          {menuItems.map(({name, icon, onPress}) => (
            <TouchableOpacity onPress={onPress} key={name} style={styles.item}>
              <View style={styles.icon}>{icon}</View>
              <Text style={styles.itemText}>{name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Container>
    </SafeAreaView>
  );
};

export default SideMenu;
