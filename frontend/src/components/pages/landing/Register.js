import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import { Container, Button, Form, Col, Row, Nav } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

import { authAtom } from '../../../states/authStates';
import { useUserActions } from '../../../actions';

import { Loading } from '../../../atoms';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const auth = useRecoilValue(authAtom);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    //redirect to home if already logged in
    if (auth && location.state?.from) {
      navigate(location.state.from);
    }
  }, []);

  const initialInputUserState = {
    username: '',
    full_name: '',
    password: '',
    email: '',
    confirmPassword: '',
  };

  const userActions = useUserActions();
  const [inputUser, setInputUser] = useState(initialInputUserState);

  const handleInputChange = (field, value) => {
    setInputUser({
      ...inputUser,
      [field]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); //prevents from being submitted until these actions have been run

    let user = {
      // inputs a new user into the mongoDb base
      email: inputUser.email,
      username: inputUser.username,
      password: inputUser.password,
      full_name: inputUser.full_name,
    };

    if (inputUser.password !== inputUser.confirmPassword) {
      // if the confirmed password is not the same as the initial
      toast.error('Enter the same password twice!');
      return;
    }
    if (
      inputUser.username.length === 0 ||
      inputUser.email.length === 0 ||
      inputUser.full_name.length === 0 ||
      inputUser.password.length === 0 ||
      inputUser.confirmPassword.length === 0
    ) {
      toast.error('Please enter in the missing field(s).');
      return;
    }
    try {
      setLoading(true);
      await userActions.login(user, '/register');
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error.msg || 'User already exists');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container className='mt-5 shadow p-3 mb-3 bg-white rounded col-xs-6 col-lg-4'>
      <Form onSubmit={handleSubmit} className='justify-content-center'>
        <Row className='mb-3 text-center'>
          <h2>Sign Up</h2>
        </Row>
        <Row className='mb-3'>
          <Form.Group as={Col} controlId='formGridEmail'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              name='email'
              placeholder='Enter email'
              required
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col} controlId='formGridFullname'>
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              name='full_name'
              placeholder='Enter a full name'
              required
              onChange={(e) => handleInputChange('full_name', e.target.value)}
            />
          </Form.Group>
        </Row>
        <Form.Group className='mb-3' controlId='formGridUsername'>
          <Form.Label>Username</Form.Label>
          <Form.Control
            name='username'
            placeholder='Enter a username'
            required
            onChange={(e) => handleInputChange('username', e.target.value)}
          />
        </Form.Group>
        <Row className='mb-3'>
          <Form.Group as={Col} controlId='formGridPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='password'
              required
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col} controlId='formGridConfirmPassword'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm password'
              required
              onChange={(e) =>
                handleInputChange('confirmPassword', e.target.value)
              }
            />
          </Form.Group>
        </Row>
        <Row className='mb-3 justify-content-center text-center'>
          <Button variant='primary' type='submit' style={{ width: '75%' }}>
            Register
          </Button>
        </Row>
        {/* <Row className="mb-3"></Row> */}
        <Row className='mb-3 justify-content-center'>
          <Col>
            <Nav className='justify-content-center'>
              <Nav.Link href='/login'>Have an Account? Login</Nav.Link>
            </Nav>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default Register;
