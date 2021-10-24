import React, { useState, useContext } from 'react';
import styles from './Login.module.css';
import axios from "axios";
import { useHistory } from 'react-router-dom';
import { UserContext } from './App';

function Login(props) {

    const [data, setData] = useState({username:"", password:""});

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({state: false, msg: ""});
    const history = useHistory();

    //user globalna state varijabla koja sadrži objekt (s podatcima o logiranom useru, ako ima koji takav)
    //dispatchUser metoda za update-anje user globalne state varijable
    const { user, dispatchUser } = useContext(UserContext);


    async function handleSubmit(e){
        e.preventDefault();
        setIsLoading(true);
        //sad šaljemo podatke serveru (post request)
        try{
            //dobit ćemo podatke od usera i to: username i email o useru ako postoji u bazi, inače ćemo dobiti string error
            const response = await axios.post('http://localhost:8080/login', data, {withCredentials: true});
            //console.log(response.data);
            setIsLoading(false);
            if(typeof(response.data) === "string" ){
                setError({state: true, msg: response.data});
            }else{
                setError({state: false, msg: ""});
                const { username, email } = response.data;
                console.log(`logged user: USERNAME: ${username}, EMAIL: ${email}`);
                //update-amo globalnu user varijablu ako smo se uspješno logirali
                dispatchUser({type: 'add/login', data: response.data});
                history.go(-1);
            }
        }catch(err){
            setError({state: true, msg: err});
            setIsLoading(false);
        }
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
            {isLoading && <span>Is loading....</span>}
            {error.state && <span>{error.msg}</span>}
        </div>   
    );
}

export default Login;