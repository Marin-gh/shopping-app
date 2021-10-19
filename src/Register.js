import React, { useState, useContext } from 'react';
import styles from './Register.module.css';
import axios from "axios";
import { useHistory } from 'react-router-dom';
import { UserContext } from './App';

function Register(props) {

    const [data, setData] = useState({username:"", password:"", email:""});

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const history = useHistory();

    //user globalna state varijabla koja sadrži objekt (s podatcima o logiranom useru, ako ima koji takav)
    //dispatchUser metoda za update-anje user globalne state varijable
    const { user, dispatchUser } = useContext(UserContext);
    

    async function handleSubmit(e){
        e.preventDefault();
        setIsLoading(true);
        //sad šaljemo podatke serveru (post request)
        try{
            //spremit ćemo novog usera u bazu i dobit ćemo natrag samo neke podatke i to: username i email (password naravno ne vraćamo na client stranu)
            const response = await axios.post('http://localhost:8080/register', data, {withCredentials: true});
            //console.log(response.data);
            setIsLoading(false);
            if(typeof(response.data) === "string" ){
                setError(true);
            }else{
                setError(false);
                //update-amo globalnu user varijablu ako smo uspješno registrirali user-a
                dispatchUser({type: 'add/login', data: response.data});
                history.go(-1);
            }
        }catch{
            setError(true);
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.registerWrapper}>
            <form action="" className={styles.registerForm} onSubmit={(e)=>{handleSubmit(e)}}>

                <label htmlFor="username">Username:</label>
                <input type="text" id="username" placeholder="username" required onChange={(e)=>{setData({...data, username:e.target.value})}}></input>


                <label htmlFor="password">Password:</label>
                <input type="password" id="password" placeholder="password" required onChange={(e)=>{setData({...data, password:e.target.value})}}></input>

                <label htmlFor="email">Mail:</label>
                <input type="email" id="email" placeholder="email" required onChange={(e)=>{setData({...data, email:e.target.value})}}></input>

                <button type="submit" className={styles.submitBtn}>Register</button>
            </form>
            {isLoading && <span>Is loading....</span>}
            {error && <span>Error with registering....</span>}
        </div>
    );
}

export default Register;