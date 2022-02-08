import {createSelector} from 'reselect';

export const getAllParkingLotAttendantData = id => state =>
  state.parkingLotAttendants?.data[id]?.map(item => (item.user));

