import React, {createContext, useReducer} from 'react';
import authInitialState from './initialStates/authState';
import contactsInitialState from './initialStates/contactsInitialState';
import parkingsInitialState from './initialStates/parkingSpacesInitialState';
import auth from './reducers/auth';
import contacts from './reducers/contacts';
import parkingSpaces from './reducers/parkingSpaces';

export const GlobalContext = createContext({});

const GlobalProvider = ({children}) => {
  const [authState, authDispatch] = useReducer(auth, authInitialState);
  const [contactsState, contactsDispatch] = useReducer(
    contacts,
    contactsInitialState,
  );
  const [parkingSpacesState, parkingSpacesDispatch] = useReducer(
    parkingSpaces,
    parkingsInitialState,
  );

  return (
    <GlobalContext.Provider
      value={{
        contactsState,
        authState,
        parkingSpacesState,
        authDispatch,
        parkingSpacesDispatch,
        contactsDispatch
      }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
