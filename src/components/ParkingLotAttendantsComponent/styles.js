import {StyleSheet} from 'react-native';
import colors from '../../assets/theme/colors';
// import colors from '../../../assets/theme/colors';

export default StyleSheet.create({
  scrollView: {backgroundColor: colors.white, flex: 1},
  avatar: {width: 70, height: 70, borderRadius: 70, marginRight: 10},
  flatList: {padding: 20, paddingTop: 42},
  flatListItem: {
    flexDirection: 'row',
    padding: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.3,
    shadowRadius: 20
  },
  floatingActionButton: {
    backgroundColor: '#304D63',
    width: 55,
    height: 55,
    position: 'absolute',
    bottom: 45,
    right: 10,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {fontSize: 16, fontWeight: '700'},
  phoneNumber: {fontSize: 14, opacity: 0.7},
});
