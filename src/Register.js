import React, { useState, useContext, useRef } from 'react';
import styles from './Register.module.css';
import axios from "axios";
import { useHistory } from 'react-router-dom';
import { UserContext } from './App';


function Register(props) {

    const [data, setData] = useState({username:"", password:"", email:""});

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({state: false, msg: ""});
    const history = useHistory();
    const [validation, setValidation] = useState({username: "", password: "", email: ""});
    const inputUsernameRef = useRef(null);
    const inputPasswordRef = useRef(null);
    const inputEmailRef = useRef(null);

    //user globalna state varijabla koja sadrži objekt (s podatcima o logiranom useru, ako ima koji takav)
    //dispatchUser metoda za update-anje user globalne state varijable
    const { user, dispatchUser } = useContext(UserContext);
    

    async function handleSubmit(e){
        e.preventDefault();
        if(validation.username === "" && validation.password === "" && validation.email === "" && data.username !== "" && data.password !== "" && data.email !== ""){
            setIsLoading(true);
            //sad šaljemo podatke serveru (post request)
            try{
                //spremit ćemo novog usera u bazu i dobit ćemo natrag samo neke podatke i to: username i email (password naravno ne vraćamo na client stranu)
                const response = await axios.post('http://localhost:8080/register', data, {withCredentials: true});
                //console.log(response.data);
                setIsLoading(false);
                if(typeof(response.data) === "string" ){
                    setError({state: true, msg: response.data});
                }else{
                    setError({state: false, msg: ""});
                    //update-amo globalnu user varijablu ako smo uspješno registrirali user-a
                    dispatchUser({type: 'add/login', data: response.data});
                    history.go(-1);
                }
            }catch(err){
                setError({state: true, msg: err});
                setIsLoading(false);
            }
        }
    }

    function validateUsername(username){
        if(username.length <=0 || username.length >=21){
            inputUsernameRef.current.classList.add(styles.invalid);
            inputUsernameRef.current.classList.remove(styles.valid);
            setValidation({...validation, username: "Username must have min 1 and max 20 characters"});
        }else{
            inputUsernameRef.current.classList.remove(styles.invalid);
            inputUsernameRef.current.classList.add(styles.valid);
            setValidation({...validation, username: ""});
        }
    }

    function validatePassword(password){
        if(password.length <=4 || password.length >=21 || !(/\d/.test(password))){
            inputPasswordRef.current.classList.add(styles.invalid);
            inputPasswordRef.current.classList.remove(styles.valid);
            setValidation({...validation, password: "Password must have min 5, max 40 characters and at least one number"});
        }else{
            inputPasswordRef.current.classList.remove(styles.invalid);
            inputPasswordRef.current.classList.add(styles.valid);
            setValidation({...validation, password: ""});
        }
    }

    function validateEmail(email){
        const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!(pattern.test(email))){
            inputEmailRef.current.classList.add(styles.invalid);
            inputEmailRef.current.classList.remove(styles.valid);
            setValidation({...validation, email: "Email must have pattern: xxxx@yyyy.zzzz"});
        }else{
            inputEmailRef.current.classList.remove(styles.invalid);
            inputEmailRef.current.classList.add(styles.valid);
            setValidation({...validation, email: ""});
        }
    }

    return (
        <div className={styles.registerWrapper}>
            <form action="" className={styles.registerForm} noValidate onSubmit={(e)=>{handleSubmit(e)}}>

                <label htmlFor="username">Username:</label>
                <input type="text" id="username" placeholder="username" ref={inputUsernameRef} onChange={(e)=>{setData({...data, username:e.target.value})}} onBlur={(e)=>{validateUsername(e.target.value)}}></input>
                {validation.username &&
                <span className={styles.validationError}>{validation.username}</span>}

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" placeholder="password" ref={inputPasswordRef} onChange={(e)=>{setData({...data, password:e.target.value})}} onBlur={(e)=>{validatePassword(e.target.value)}}></input>
                {validation.password &&
                <span className={styles.validationError}>{validation.password}</span>}

                <label htmlFor="email">Email:</label>
                <input type="email" id="email" placeholder="email" ref={inputEmailRef} onChange={(e)=>{setData({...data, email:e.target.value})}} onBlur={(e)=>{validateEmail(e.target.value)}}></input>
                {validation.email &&
                <span className={styles.validationError}>{validation.email}</span>}

                <button type="submit" className={styles.submitBtn}><span className={styles.btnFront}>Register</span></button>
            </form>
            {isLoading && <span>Is loading....</span>}
            {error.state && <span className={styles.errorMsg}>{error.msg}</span>}
        </div>
    );
}

export default Register;