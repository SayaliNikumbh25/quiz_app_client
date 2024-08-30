import React, { useState } from 'react';
import { login } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
import styles from "./Register.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()
  const [serverError, setServerError] = useState("")
  const [error, setError] = useState({
    email: false,
    password: false,
  });
  let hasError = false;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError((prevState) => {
      return {
        email: false,
        password: false,
      };
    });
    setServerError("")

    if (!email) {
      hasError = true;
      setError((prevState) => {
        return {
          ...prevState,
          email: true,
        };
      });
    }

    if (!password) {
      hasError = true;
      setError((prevState) => {
        return {
          ...prevState,
          password: true,
        };
      });
    }
    if (!hasError){
      try {
        console.log(email)
        const res = await login({ email, password });
        console.log('User logged in:', res.data);
        const token = res.data.token
        const username = res.data.user.username
        const userID = res.data.user.id
        localStorage.setItem('token',token)
        localStorage.setItem('userName',username) 
        localStorage.setItem('userID',userID)
    
        navigate('/dashboard')
      } catch (error) {
        console.error('Error logging in:', error.response.data);
        setServerError(error.response.data.message)
        toast.error(error.response.data.message)
      }
    }

   
  };

  return (
    <>
       <div className={styles.mainContainer}>
        <form>
          <div className={styles.container} >
            <div className={styles.containerFileds}>
              <label className={`${styles.label}`}>Email</label>
              <input
                type="email"
                placeholder={error.email? "Invalid Email" :""}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`${styles.input} ${error.email ? styles.inputError : ''}`}
                style={{borderColor:error.email && "#D60000"}}
              />
            </div>
            <div className={styles.containerFileds}>
              <label className={`${styles.label}`}>Password</label>
              <input
                type="password"
                placeholder={error.password ? "Invalid Password": ""}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`${styles.input} ${error.password ? styles.inputError : ''}`}
                style={{borderColor:error.password && "#FF4141"}}
              />
             
            </div>
            <div className={styles.buttonContainer}>
              <button className={styles.signUpButton} type="submit" onClick={handleSubmit}>Log In</button>
            </div>
            
          </div>
        </form>
        <ToastContainer />
    </div>
    </>
    

    
  );
};

export default Login;
