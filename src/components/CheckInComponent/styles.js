import {StyleSheet, Dimensions} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;
export default StyleSheet.create({
  scrollView: {
    flexDirection: 'row',
  },
  body: {},
  sectionContainer: {
    width: '100%',
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  section: {
    backgroundColor: Colors.white,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addPhotoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  photoList: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 0,
    marginBottom: 15,
  },
  photo: {
    marginRight: 10,
    marginTop: 10,
    width: 100,
    height: 100,
    borderRadius: 10,
  },

  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3399cc',
  },
  photoIcon: {
    width: 30,
    height: 30,
  },
  addButtonContainer: {
    padding: 15,
    justifyContent: 'flex-end',
  },
  addButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 24,
  },
  buttonTouchable: {
    fontSize: 21,
    backgroundColor: '#ff0066',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    width: deviceWidth - 62,
  },
  buttonTextStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
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
});
