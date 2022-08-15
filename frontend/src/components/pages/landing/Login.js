import React, { useEffect, useState } from 'react';
import ErrorMsg from '../../UI/ErrorMsg';
import { Button } from 'react-bootstrap';
import './styles.css';
import { useNavigate } from 'react-router-dom';

import { authAtom } from '../../../states/authStates';
import { useRecoilValue } from 'recoil';
import { useUserActions } from '../../../actions/user_actions';

const Login = () => {
  const navigate = useNavigate();
  const auth = useRecoilValue(authAtom);

  useEffect(() => {
    //redirect to home if already logged in
    if (auth) {
      navigate('/');
    }
  }, []);

  const userActions = useUserActions();

  const initialInputUserState = {
    email: '',
    password: '',
  };

  const [inputUser, setInputUser] = useState(initialInputUserState);
  const [errorMsg, setErrorMsg] = useState();

  const handleInputChange = (field, value) => {
    setInputUser({
      ...inputUser,
      [field]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevents form from being submitted automatically


      let user = {
        email: inputUser.email,
        password: inputUser.password,
      };
      userActions
        .login(user, '/login').then((res) => {
          setInputUser({
            email: res.email,
            password: res.password,
          });
          navigate('/');
        })
        .catch(error => {
          setErrorMsg('Email or password is incorrect, please enter valid credentials.');
        });
      

    
  };

  return (
    <div className="login-form-container">
      <div className="form-title">
        <h1>Login</h1>
      </div>
      <br />
      {errorMsg && <ErrorMsg msg={errorMsg} />}

      <form onSubmit={handleSubmit}>
        <div className="input">
          <input
            type="email"
            id="email"
            name="email"
            value={inputUser.email}
            required
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter email"
          />
        </div>
        <br />

        <div className="input">
          <input
            type="password"
            name="password"
            value={inputUser.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Enter password"
          />
        </div>
        <br />

        <Button variant="info" type="submit" style = {{marginLeft: "38%"}}>
          Login
        </Button>
      </form>
      <a href="/verify-user" style = {{marginLeft: "35%"}}>Forgot password?</a>
    </div>
  );
};

export default Login;
