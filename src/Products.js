import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './Products.module.css';
import DeleteModal from './DeleteModal.js';
import axios from "axios";
import { useHistory } from 'react-router-dom';
import { UserContext } from './App';
import { RatingView } from 'react-simple-star-rating';

function Products(props) {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState({state: false, msg: ""});
    const [deleteModalOpen, setDeleteModalOpen] = useState({state: false, url: "", redirect: '/products'});

    //user globalna state varijabla koja sadrži objekt (s podatcima o logiranom useru, ako ima koji takav)
    //dispatchUser metoda za update-anje user globalne state varijable
    const { user } = useContext(UserContext);

    const history = useHistory();

    //fetch data from db
    useEffect(()=>{
        async function fetchData(){
            try{
                const fetchedData = await axios.get('http://localhost:8080/products', {withCredentials: true});
                //console.log(fetchedData);
                //fetchedData.data mi treba biti niz objekata(produkata)
                if(typeof(fetchedData.data) === "string" ){
                    setError({state: true, msg: fetchedData.data});
                }else{
                    //console.dir(fetchedData.data);
                    setData(fetchedData.data);
                    setError({state: false, msg: ""});
                }
                setIsLoading(false);
            }catch(err){
                setError({state: true, msg: err});
                setIsLoading(false);
            }
        }
        fetchData();
    },[]);

    function handleEdit(e, item){
        e.stopPropagation();
        console.log(`You clicked edit button: ${e.target}, ${item._id}`);
        history.push(`/editProduct/${item._id}`);
    }

    function handleDelete(e, item){
        e.stopPropagation();
        console.log(`You clicked delete button: ${e.target}, ${item._id}`);
        setDeleteModalOpen({state: true, url: `http://localhost:8080/products/${item._id}`, redirect: '/products'});
    }

    return (
        <div className={styles.productsLayout}>
            {isLoading && <span className={styles.isLoading}>is loading...</span>}
            {data.length!==0 && <div className={styles.cardWrapper}>{data.map((item)=>{
                return(
                <div className={styles.card} key={item._id}>
                    <Link to={`/products/${item._id}`} className={styles.link} >
                        <img src={item.image[0]} className={styles.cardImage} alt="productImage"></img>
                        <p>Title: {item.title} </p>
                        <p>Description: {item.description} </p>
                        <p>Location: {item.location} </p>
                        <p>Price: {item.price} euros</p>
                        <p>Author: {item.author.username}</p>
                        <RatingView ratingValue={Math.round(item.avgRating)} size={20}/>
                    </Link>
                    {item.author._id === user.id && 
                        <div className={styles.btnWrapper}><button className={styles.editBtn} onClick={(e)=>{handleEdit(e, item)}}>Edit</button>
                        <button className={styles.deleteBtn} onClick={(e)=>{handleDelete(e, item)}}>Delete</button></div>
                    }
                </div>
                )})}
            </div>}
            {deleteModalOpen.state && <div className={styles.modalWrapper}><DeleteModal closeModal={[deleteModalOpen, setDeleteModalOpen]} /></div>}
            {error.state && <span>{error.msg}</span>}
        </div>
    )
}

export default Products;