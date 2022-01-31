import {useRoute} from '@react-navigation/native';
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

  const dispatch = useDispatch();
  React.useEffect(() => {
    if (params?.data) {
      setJustSignedUp(true);
      setForm({...form, phoneNumbẻ: params.data.phonenumber});
    }
  }, [params]);

  const {error, loading} = useSelector(state => state.auth);

  const onSubmit = () => {
    if (form.phoneNumber && form.password) {
      dispatch(loginUser(form));
    }
  };

  const onChange = ({name, value}) => {
    setJustSignedUp(false);
    setForm({...form, [name]: value});
  };

  return (
    <LoginComponent
      onSubmit={onSubmit}
      onChange={onChange}
      form={form}
      error={error}
      loading={loading}
      justSignedUp={justSignedUp}
    />
  );
};

export default Login;
