import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Change RegisterContainer to FormContainer
const FormContainer = styled.div`
  padding: 120px 20px 50px;
  max-width: 500px;
  margin: 0 auto;
  direction: rtl;
`;

// Change PageTitle to FormTitle
const FormTitle = styled(motion.h1)`
  font-size: 40px;
  margin-bottom: 30px;
  text-align: center;
  color: ${props => props.theme.colors.primary};
`;

// Add SubmitButton component
const SubmitButton = styled(motion.button)`
  background-color: ${props => props.theme.colors.accent};
  color: white;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 10px;
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

// Add LoginPrompt component
const LoginPrompt = styled.div`
  text-align: center;
  margin-top: 20px;
  
  a {
    color: ${props => props.theme.colors.accent};
    margin-right: 5px;
    font-weight: 500;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Form = styled(motion.form)`
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accent};
  }
`;

const Button = styled(motion.button)`
  background-color: ${props => props.theme.colors.accent};
  color: white;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 10px;
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  
  a {
    color: ${props => props.theme.colors.accent};
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate inputs
    if (password !== confirmPassword) {
      setError('הסיסמאות אינן תואמות');
      return;
    }
    
    if (password.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים');
      return;
    }
    
    // Validate email is a string and properly formatted
    if (!email || typeof email !== 'string') {
      setError('כתובת האימייל אינה תקינה');
      return;
    }
    
    const trimmedEmail = email.trim();
    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError('כתובת האימייל אינה תקינה');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Registering with:', { name, email: trimmedEmail, password });
      await register(trimmedEmail, password, name);
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('כתובת האימייל כבר קיימת במערכת');
      } else {
        setError('אירעה שגיאה בתהליך ההרשמה. אנא נסה שוב.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        הרשמה
      </FormTitle>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">שם מלא</Label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="email">אימייל</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="password">סיסמה</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="confirmPassword">אימות סיסמה</Label>
          <Input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </FormGroup>
        
        <SubmitButton
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? 'מבצע רישום...' : 'הירשם'}
        </SubmitButton>
      </Form>
      
      <LoginPrompt>
        כבר יש לך חשבון? <LoginLink to="/login">התחבר עכשיו</LoginLink>
      </LoginPrompt>
    </FormContainer>
  );
};

export default Register;