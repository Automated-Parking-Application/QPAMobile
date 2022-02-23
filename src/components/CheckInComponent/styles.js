import {StyleSheet} from 'react-native';
import {Header, Colors} from 'react-native/Libraries/NewAppScreen';
export default StyleSheet.create({
  scrollView: {
    // backgroundColor: Colors.lighter,
    display: 'flex', flexWrap: 'nowrap', flexDirection: 'row'
  },
  body: {
    // display: 'flex',
    // flexWrap: 'wrap',
    // backgroundColor: Colors.white,
  },
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
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 0,
    marginBottom: 15,
    marginRight: 15,
    marginLeft: 15
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
});
