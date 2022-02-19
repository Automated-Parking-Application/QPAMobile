import {useNavigation} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import React from 'react';
import {useContext} from 'react';
import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import RegisterComponent from '../../components/Signup';
import {LOGIN} from '../../constants/routeNames';
import register, {clearAuthState} from '../../context/actions/auth/register';
import {GlobalContext} from '../../context/Provider';

const Register = () => {
  const [form, setForm] = useState({});
  const {navigate} = useNavigation();
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  // const {
  //   authDispatch,
  //   authState: {error, loading, data},
  // } = useContext(GlobalContext);

  const {error, loading, data} = useSelector(state => state.auth);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (data || error) {
          // clearAuthState()(authDispatch);
          dispatch(clearAuthState());
        }
      };
    }, [data, error]),
  );

  const onChange = ({name, value}) => {
    setForm({...form, [name]: value});

    if (value !== '') {
      switch (name) {
        case 'password': {
          if (value.length < 6) {
            setErrors(prev => {
              return {...prev, [name]: 'This field needs min 6 characters'};
            });
          } else {
            setErrors(prev => {
              return {...prev, [name]: null};
            });
          }
          break;
        }
        case 'phoneNumber': {
          if (isNaN(value)) {
            setErrors(prev => {
              return {...prev, [name]: 'Number only'};
            });
          } else {
            setErrors(prev => {
              return {...prev, [name]: null};
            });
          }
          break;
        }
        case 'email': {
          let reg =
            /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i;
          if (reg.test(value) === false) {
            setErrors(prev => {
              return {...prev, [name]: 'Email is not valid'};
            });
          } else {
            setErrors(prev => {
              return {...prev, [name]: null};
            });
          }
          break;
        }
        default: {
          setErrors(prev => {
            return {...prev, [name]: null};
          });
        }
      }
    } else {
      setErrors(prev => {
        return {...prev, [name]: 'This field is required'};
      });
    }
  };

  const onSubmit = () => {
    if (!form.phoneNumber) {
      setErrors(prev => {
        return {...prev, userName: 'Please add a username'};
      });
    }
    if (!form.firstName) {
      setErrors(prev => {
        return {...prev, firstName: 'Please add a  first name'};
      });
    }
    if (!form.lastName) {
      setErrors(prev => {
        return {...prev, lastName: 'Please add a last name'};
      });
    }
    if (!form.email) {
      setErrors(prev => {
        return {...prev, email: 'Please add a email'};
      });
    }
    if (!form.password) {
      setErrors(prev => {
        return {...prev, password: 'Please add a password'};
      });
    }

    if (
      Object.values(form).length === 5 &&
      Object.values(form).every(item => item.trim().length > 0) &&
      Object.values(errors).every(item => !item)
    ) {
      register(form)(dispatch)(response => {
        navigate(LOGIN, {data: response});
      });
    }
  };

  return (
    <RegisterComponent
      onSubmit={onSubmit}
      onChange={onChange}
      form={form}
      errors={errors}
      error={error}
      loading={loading}
    />
  );
};

export default Register;
