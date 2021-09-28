import React, { useState } from 'react';
import styles from './Register.module.css';

function Register(props) {

    const [data, setData] = useState({username:"", password:"", email:""});

    function handleSubmit(e){
        e.preventDefault();
        //sad šaljemo podatke serveru (post request)
        //const sentData = data;
    }

    return (
        <div className={styles.registerWrapper}>
            <form action="" className={styles.registerForm} onSubmit={(e)=>{handleSubmit(e)}}>

                <label htmlFor="username">Username:</label>
                <input type="text" id="username" placeholder="username" required onChange={(e)=>{setData({...data, username:e.target.value})}}></input>


                <label htmlFor="password">Password:</label>
                <input type="password" id="password" placeholder="password" required onChange={(e)=>{setData({...data, password:e.target.value})}}></input>

                <label htmlFor="mail">Mail:</label>
                <input type="mail" id="mail" placeholder="mail" required onChange={(e)=>{setData({...data, mail:e.target.value})}}></input>

                <button type="submit" className={styles.submitBtn}>Register</button>
            </form>
        </div>   
    );
}

export default Register;