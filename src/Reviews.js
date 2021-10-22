import React, { useState, useEffect, useContext } from 'react';
import styles from './Reviews.module.css';
import { UserContext } from './App';
import axios from "axios";
import { useHistory } from 'react-router-dom';
import DeleteModal from './DeleteModal.js';
//import { useRef } from 'react';

function Reviews(props) {

    //id product-a čije review-e želimo izlistati
    const id = props.id;

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [error2, setError2] = useState(false);
    const [newReview, setNewReview] = useState({body:"", product: id});
    const [deleteModalOpen, setDeleteModalOpen] = useState({state: false, url: "", redirect: `/products/${id}`});
    const [isAuthor, setIsAuthor] = useState(true);
    //user globalna state varijabla koja sadrži objekt (s podatcima o logiranom useru, ako ima koji takav)
    const { user } = useContext(UserContext);

    const history = useHistory();

    //const editInputRef = useRef();

    //fetch data from db (samo one review-e koji su povezani s dobivenim id-om, a to je id od product-a kojeg promatramo)
    useEffect(()=>{
        async function fetchData(){
            try{
                const fetchedData = await axios.get(`http://localhost:8080/reviews/${id}`, {withCredentials: true});
                //console.log(fetchedData);
                //fetchedData.data mi treba biti niz objekata(review-ova)
                if(typeof(fetchedData.data) === "string" ){
                    setError(true);
                }else{
                    setData(fetchedData.data);
                    setError(false);
                }
                setIsLoading(false);
            }catch{
                setError(true);
                setIsLoading(false);
            }
        }
        fetchData();
    },[id]);


    //edit review
    function handleEdit(e, item){
        e.stopPropagation();
        console.log(`You clicked edit button: ${e.target}, ${item._id}`);
        //sad bi trebalo omogućiti fokus na review koji želimo editirati i dodati "save" i "cancel" button
    }

    //delete review (događa se u DeleteModal.js nakon klika na "Yes")
    function handleDelete(e, item){
        e.stopPropagation();
        console.log(`You clicked delete button: ${e.target}, ${item._id}`);
        setDeleteModalOpen({state:true, url: `http://localhost:8080/reviews/${item._id}`, redirect: `/products/${id}`});
    }

    //add a new review
    async function handleSubmit(e){
        e.preventDefault();
        setIsLoading2(true);
        //sad šaljemo podatke serveru (post request)
        try{
            const response = await axios.post(`http://localhost:8080/reviews/${id}`, newReview, {withCredentials: true});
            //console.log(response.data);
            setIsLoading2(false);
            if(typeof(response.data) === "string" ){
                setError2(true);
            }else{
                setError2(false);
                //history.replace(`/products/${id}`);
                history.go(0);
            }
        }catch{
            setError2(true);
            setIsLoading2(false);
        }
    }

    return (
        <div className={styles.reviewsLayout}>
            {isLoading && <span className={styles.isLoading}>is loading...</span>}
            {data && <><div className={styles.title}>Reviews:</div><div className={styles.cardWrapper}>{data.map((item)=>{
                return(
                <div className={styles.card} key={item._id}>
                    <p>{item.body} </p>
                    <p className={styles.author}>Author: {item.author.username}</p>
                    {isAuthor && 
                        <div className={styles.btnWrapper}>
                            <button className={styles.editBtn} onClick={(e)=>{handleEdit(e, item)}}>Edit</button>
                            <button className={styles.deleteBtn} onClick={(e)=>{handleDelete(e, item)}}>Delete</button>
                        </div>
                    }
                </div>
                )})}
            </div>
            {user.isLoggedIn &&
                    <form action="" className={styles.newReviewForm} onSubmit={(e)=>{handleSubmit(e)}}>
                        <label htmlFor="addReview"></label>
                        <textarea id="addReview" rows="6" cols="50" placeholder="Add a new review..." required className={styles.textReview} onChange={(e)=>{setNewReview({body: e.target.value, product: id})}}></textarea>
                        <button type="submit" className={styles.submitBtn}>Add a review</button>
                        {isLoading2 && <span className={styles.isLoading}>is loading (saving a new review)...</span>}
                        {error2 && <span>Error with adding a new review</span>}
                    </form>
            }
            </>}
            {deleteModalOpen.state && <div className={styles.modalWrapper}><DeleteModal closeModal={[deleteModalOpen, setDeleteModalOpen]} /></div>}
            {error && <span>Error with fetching data</span>}
        </div>
    )
}

export default Reviews;