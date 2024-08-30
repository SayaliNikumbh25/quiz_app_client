import React from 'react'
import Login from './Login'
import Register from './Register'
import { useState, useEffect } from 'react'
import styles from './LandingPage.module.css'
const LandingPage = () => {
    const [show, setShow] = useState(0)
    const handleShow =(n)=>{
        if(n==0){
            setShow(0)
        }else{
            setShow(1)
        }
    } 
    console.log(show)

    useEffect(()=>{
        localStorage.clear()
    },[])
  return (
    <div className={styles.maincontainer}>
        <div className={styles.container}>
            <h1 className={styles.heading}>QUIZZIE</h1>
            <div className={styles.options}>
                <button className={`${styles.buttons} ${show==0 && styles.shadow}`} onClick={()=>handleShow(0)}>Sign Up</button>
                <button className={`${styles.buttons} ${show==1 && styles.shadow}`} onClick={()=>handleShow(1)}>Log In</button>
            </div>
            <div>
                {show == 0 && <Register/>}
                {show==1 && <Login/>}

            </div>
        </div>
    </div>
  )
}

export default LandingPage