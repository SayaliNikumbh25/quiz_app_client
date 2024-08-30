import React from 'react'
import styles from './PageNotFound.module.css';
import {useNavigate} from 'react-router-dom';

const PageNotFound = () => {
  const navigate = useNavigate()
  return (
    <div className={styles.container}>
        <h1 className={styles.heading}>404</h1>
        <h1>Uh Oh...</h1>
        <p className={styles.information}>The your are looking for may have been moved, deleted , or possibly never Existed. < br /> Visit our homepage.</p>
        <button className={styles.button} onClick={()=>{navigate('/')}}>Visit Homepage</button>        
    </div>
  )
}

export default PageNotFound