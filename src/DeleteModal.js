import React, { useState } from 'react';
import styles from './DeleteModal.module.css';
import axios from "axios";
import { useHistory } from 'react-router-dom';
import Draggable from 'react-draggable';

function DeleteModal(props) {

    const [deleteModalOpen, setDeleteModalOpen] = props.closeModal;
    const url = deleteModalOpen.url;
    const redirect = deleteModalOpen.redirect;

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({state: false, msg: ""});

    const history = useHistory();

    async function handleYes(e){
        e.stopPropagation();
        //console.log("You clicked Yes button!");
        //zatvoriti modal i poslati delete request serveru
        setDeleteModalOpen({state: false, url: url});

        setIsLoading(true);
        //sad šaljemo podatke serveru (delete request)
        try{
            const response = await axios.delete(url, {withCredentials: true});
            //console.log(response.data);
            setIsLoading(false);
            if(typeof(response.data) === "string" ){
                setError({state: true, msg: response.data});
            }else{
                setError({state: false, msg: ""});
                //history.push('/products'); -> ovo mi ne reloada ako smo na istoj stranici (ne unmnount pa mi se ne pali useeffect() unutar Product.js)
                //history.replace('/products'); -> ovo mi ne reloada ako smo na istoj stranici (ne unmnount pa mi se ne pali useeffect() unutar Product.js)
                if(redirect!==history.location.pathname){
                    history.replace(redirect);
                }else{
                    //to reload the page (sad se pali useeffect() iz Product.js)
                    history.go(0);
                }  
            }
        }catch(err){
            setError({state: true, msg: err});
            setIsLoading(false);
        }
    }

    function handleNo(e){
        e.stopPropagation();
        //console.log("You clicked No button!");
        //samo zatvoriti modal
        setDeleteModalOpen({state: false, url: url});
    }


    return (
        <Draggable>
            <div className={styles.modal}>
                <div className={styles.title}>Do you want to delete the product?</div>
                <div className={styles.btnWrapper}>
                    <button onClick={(e)=>{handleYes(e)}}>Yes</button>
                    <button onClick={(e)=>{handleNo(e)}}>No</button>
                </div>
                {isLoading && <span>is loading...</span>}
                {error.state && <span>{error.msg}</span>}
            </div>
        </Draggable>
    );
}

export default DeleteModal;