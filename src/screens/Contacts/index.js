import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from '../../components/common/Icon';
import ContactsComponent from '../../components/ContactsComponent';
import getParkingSpaces from '../../context/actions/parkingSpaces/getParkingSpaces';
import {useSelector, useDispatch} from 'react-redux';

const Contacts = () => {
  const [sortBy, setSortBy] = React.useState(null);
  const {setOptions, toggleDrawer} = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  // const contactsRef = useRef([]);
  const dispatch = useDispatch();

  const {data, loading} = useSelector(
    state => state.parkingSpaces.getParkingSpaces,
  ) || {};

  useEffect(() => {
    dispatch(getParkingSpaces());
  }, [dispatch]);

  const getSettings = async () => {
    const sortPref = await AsyncStorage.getItem('sortBy');
    if (sortPref) {
      setSortBy(sortPref);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getSettings();
      return () => {};
    }, []),
  );

  // useEffect(() => {
  // const prev = contactsRef.current;

  // contactsRef.current = data;

  // const newList = contactsRef.current;
  // if (newList.length - prev.length === 1) {
  //   const newContact = newList.find(
  //     item => !prev.map(i => i.id).includes(item.id),
  //   );
  //   navigate(PARKING_SPACE_DETAIL, {item: newContact});
  // }
  // }, [data.length]);

  React.useEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            toggleDrawer();
          }}>
          <Icon type="material" style={{padding: 10}} size={25} name="menu" />
        </TouchableOpacity>
      ),
    });
  }, [setOptions, toggleDrawer]);

  return (
    <ContactsComponent
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      data={data}
      loading={loading}
      sortBy={sortBy}
    />
  );
};

export default Contacts;
