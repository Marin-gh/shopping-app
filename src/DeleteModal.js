import React from 'react';
import styles from './DeleteModal.module.css';

function DeleteModal(props) {

    const [deleteModalOpen, setDeleteModalOpen] = props.closeModal;

    function handleYes(e){
        e.stopPropagation();
        console.log("You clicked Yes button!");
        //zatvoriti modal i poslati delete request serveru
        setDeleteModalOpen(false);
    }

    function handleNo(e){
        e.stopPropagation();
        console.log("You clicked No button!");
        //samo zatvoriti modal
        setDeleteModalOpen(false);
    }


    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modal}>
                <div className={styles.title}>Do you want to delete the product?</div>
                <div className={styles.btnWrapper}>
                    <button onClick={(e)=>{handleYes(e)}}>Yes</button><button onClick={(e)=>{handleNo(e)}}>No</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;