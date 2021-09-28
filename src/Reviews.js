import React, { useState, useEffect } from 'react';
import styles from './Reviews.module.css';

function Reviews(props) {

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isAuthor, setIsAuthor] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const [newReview, setNewReview] = useState("");

    const id = props.id;

    useEffect((id)=>{
        //fetch data from db (samo one review-e koji su povezani s dobivenim id-om, a to je id od product-a kojeg promatramo)
        //sad bez db
        const falseData = [
            {id: '1', description: "Good car....", rating: "3", author: "Mirko"},
            {id: '2', description: "Perfect car....", rating: "5", author: "Sirko"},
            {id: '3', description: "Bad car....", rating: "1", author: "Ćirko"}
        ];
        setData(falseData);
        setIsLoading(false);
    },[id]);


    function handleEdit(e, item){
        e.stopPropagation();
        console.log(`You clicked edit button: ${e.target}, ${item.id}`);
    }

    function handleDelete(e, item){
        e.stopPropagation();
        console.log(`You clicked delete button: ${e.target}, ${item.id}`);
    }

    function handleSubmit(e){
        e.preventDefault();
        //sad još treba poslati serveru podatke o novom review-u (te tko šalje taj review i id product-a kojeg imamo ovdje pod props.id)
        //const sentData = {newReview, productId : id, userId: ""};
        //sad šaljemo sentData na neki endpoint
    }

    return (
        <div className={styles.reviewsLayout}>
            {isLoading && <span className={styles.isLoading}>is loading...</span>}
            {data && <><div className={styles.title}>Reviews:</div><div className={styles.cardWrapper}>{data.map((item)=>{
                return(
                <div className={styles.card} key={item.id}>
                    <p>{item.description} </p>
                    <p className={styles.author}>Author: {item.author}</p>
                    {isAuthor && 
                        <div className={styles.btnWrapper}><button className={styles.editBtn} onClick={(e)=>{handleEdit(e, item)}}>Edit</button><button className={styles.deleteBtn} onClick={(e)=>{handleDelete(e, item)}}>Delete</button></div>
                    }
                </div>
                )})}
            </div>
            {isLoggedIn &&
                    <form action="" className={styles.newReviewForm} onSubmit={(e)=>{handleSubmit(e)}}>
                        <label htmlFor="addReview"></label>
                        <textarea id="addReview" rows="6" cols="50" placeholder="Add a new review..." className={styles.textReview} onChange={(e)=>{setNewReview(e.target.value)}}></textarea>
                        <button type="submit" className={styles.submitBtn}>Add a review</button>
                    </form>
            }
            </>}
            {error && <span>Error with fetching data</span>}
        </div>
    )
}

export default Reviews;