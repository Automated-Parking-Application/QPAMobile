import {useRoute} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import React, {useState} from 'react';
import {useContext} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import LoginComponent from '../../components/Login';
import loginUser from '../../context/actions/auth/loginUser';
import {GlobalContext} from '../../context/Provider';
const Login = () => {
  const [form, setForm] = useState({});
  const [justSignedUp, setJustSignedUp] = useState(false);
  const {params} = useRoute();
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const {error, loading, data} = useSelector(state => state.auth);
  React.useEffect(() => {
    if (params?.data) {
      setJustSignedUp(true);
      setForm({...form, phoneNumbẻ: params.data.phonenumber});
    }
  }, [params]);

  const onSubmit = () => {
    if (form.phoneNumber && form.password) {
      dispatch(loginUser(form));
    }
  };

  const onChange = ({name, value}) => {
    setJustSignedUp(false);
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
  return (
    <LoginComponent
      onSubmit={onSubmit}
      onChange={onChange}
      form={form}
      error={error}
      errors={errors}
      loading={loading}
      justSignedUp={justSignedUp}
    />
  );
};

export default Login;
