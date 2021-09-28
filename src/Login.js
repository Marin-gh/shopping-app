import React, { useState } from 'react';
import styles from './Login.module.css';

function Login(props) {

    const [data, setData] = useState({username:"", password:""});

    function handleSubmit(e){
        e.preventDefault();
        //sad šaljemo podatke serveru (post request)
        //const sentData = data;
    }

    return (
        <div className={styles.loginWrapper}>
            <form action="" className={styles.loginForm} onSubmit={(e)=>{handleSubmit(e)}}>

                <label htmlFor="username">Username:</label>
                <input type="text" id="username" placeholder="username" required onChange={(e)=>{setData({...data, username:e.target.value})}}></input>


                <label htmlFor="password">Password:</label>
                <input type="password" id="password" placeholder="password" required onChange={(e)=>{setData({...data, password:e.target.value})}}></input>

                <button type="submit" className={styles.submitBtn}>Login</button>
            </form>
        </div>   
    );
}

export default Login;