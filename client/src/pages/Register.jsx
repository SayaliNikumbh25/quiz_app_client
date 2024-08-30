import React, { useState, useEffect } from "react";
import { register } from "../services/api";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [serverError, setServerError] = useState("")
  const [error, setError] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    isPasswordMatch: false
  });

  let hasError = false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    console.log("here")
    e.preventDefault();
   
    setError((prevState) => {
      return {
        username: false,
        email: false,
        password: false,
        confirmPassword: false,
        isPasswordMatch:false
      };
    });
    setServerError("")
    console.log("start",error)
    if (!username) {
      hasError = true;
      setError((prevState) => {
        return {
          ...prevState,
          username: true,
        };
      });
    }
    if (!email || !emailRegex.test(email)) {
      hasError = true;
      setError((prevState) => {
        return {
          ...prevState,
          email: true,
        };
      });
    }

    if (!password || !passwordRegex.test(password)) {
      hasError = true;
      setPassword('')
      setError((prevState) => {
        return {
          ...prevState,
          password: true,
        };
      });
    }

    if (!confirmPassword) {
      hasError = true;
    
      setError((prevState) => {
        return {
          ...prevState,
          confirmPassword: true,
        };
      });
    }

    if(password && confirmPassword){
      if(password !== confirmPassword){
        console.log("compare", password !== confirmPassword)
        hasError = true;
        setConfirmPassword('')
        setError((prevState) => {
          return {
            ...prevState,
            isPasswordMatch: true,
          };
        });
      }
    }
    console.log('before if',error.isPasswordMatch)
    if (!hasError) {
        try {
          const res = await register({ username, email, password });
          console.log("User registered:", res.data);
          const token = res.data.token
          const user = res.data.user.username
          const userID = res.data.user.id
          localStorage.setItem('token',token)
          localStorage.setItem('userName',user) 
          localStorage.setItem('userID',userID)
          navigate('/dashboard')
        } catch (error) {
          console.error("Error registering user:", error.response.data);
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
              <label className={`${styles.label}`}>Name</label>
              <input
                type="text"
                placeholder={error.username ?"Please enter the Username":""}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={`${styles.input} ${error.username ? styles.inputError : ''}`}
                style={{border:error.username && "2px solid #D60000"}}
              />
            </div>
            <div className={styles.containerFileds}>
              <label className={`${styles.label} ${error.email ? styles.labelError : ''}`}>Email</label>
              <input
                type="email"
                placeholder={error.email? "Please enter the valid Email" :""}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`${styles.input} ${error.email ? styles.inputError : ''}`}
                style={{borderColor:error.email && "#D60000"}}
              />
            </div>
            <div className={styles.containerFileds}>
              <label className={`${styles.label} ${error.password ? styles.labelError : ''}`}>Password</label>
              <input
                type="password"
                placeholder={error.password ? "Weak Password" :""}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`${styles.input} ${error.password ? styles.inputError : ''}`}
                style={{borderColor:error.password && "#D60000"}}
              />
            </div>
            <div className={styles.containerFileds}>
              <label className={`${styles.label}`}> Confirm Password</label>
              <input
                type="password"
                placeholder={error.isPasswordMatch || error.confirmPassword ? "password doesn’t match":""}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`${styles.input} ${error.isPasswordMatch ? styles.inputError : ''} ` }
                style={{borderColor:(error.confirmPassword || error.isPasswordMatch) && "#D60000"}}
              /> 
            </div>
            <div className={styles.buttonContainer}>
              <button className={styles.signUpButton} type="submit" onClick={handleSubmit}>Sign Up</button>
            </div>
          
          </div>
        </form>
        <ToastContainer />
    </div>
        
    </>
  );
};

export default Register;
