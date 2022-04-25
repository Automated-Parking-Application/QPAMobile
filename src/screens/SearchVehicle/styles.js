import {ScaledSheet} from 'react-native-size-matters';
import colors from '../../assets/theme/colors';

export default ScaledSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20,
    alignItems: 'center',
    flexGrow: 1,
    borderRadius: 20,
    borderColor: 'grey',
    borderWidth: 1,
    margin: 15,
  },
  item: {
    maxWidth: 300,
    flexDirection: 'row',
    paddingVertical: 15,
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  name: {fontSize: 17},
  phoneNumber: {
    opacity: 0.6,
    fontSize: 14,
    paddingVertical: 5,
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
  actionButton: {
    flexGrow: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
  },

  actionText: {
    textAlign: 'center',
    maxWidth: '70@s',
    paddingTop: '5@s',
    fontSize: '14@s',
    color: colors.white,
  },
  actionTextStyle: {
    padding: '40@s',
  },
});
