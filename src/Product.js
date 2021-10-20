import styles from './Product.module.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import Reviews from './Reviews';
import DeleteModal from './DeleteModal.js';
import { ShoppingCartContext } from './App' ;
import axios from "axios";
import { useHistory } from 'react-router-dom';

function Product(props) {

    const { id } = useParams();
    const [isAuthor, setIsAuthor] = useState(true);
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    //state - je li otvoren ili zatvoren; url - endpoint na koji šaljemo delete request; redirect - di će nas preusmjeriti nakon delete-anja
    const [deleteModalOpen, setDeleteModalOpen] = useState({state: false, url: "", redirect: '/products'});

    //shoppingCart globalna state varijabla koja sadrži niz objekata/produkata koji su u košarici
    //const { shoppingCart } = useContext(ShoppingCartContext);
    //dispatchShoppingCart metoda za update-anje shoppingCart globalne state varijable
    const { dispatchShoppingCart } = useContext(ShoppingCartContext);

    const history = useHistory();

    //fetch data from db with given id (given as params)
    useEffect(()=>{
        async function fetchData(){
            try{
                const fetchedData = await axios.get(`http://localhost:8080/products/${id}`, {withCredentials: true});
                //console.log(fetchedData);
                //fetchedData.data mi treba biti traženi objekt(product)
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


    function handleEdit(e, item){
        e.stopPropagation();
        console.log(`You clicked edit button: ${e.target}, ${item._id}`);
        history.push(`/editProduct/${item._id}`);
    }

    function handleDelete(e, item){
        e.stopPropagation();
        console.log(`You clicked delete button: ${e.target}, ${item._id}`);
        setDeleteModalOpen({state:true, url: `http://localhost:8080/products/${item._id}`, redirect: '/products'});
    }

    function handleAddToCart(e, item){
        e.stopPropagation();
        console.log("You clicked add to cart button!");
        dispatchShoppingCart({type: 'add/increment', data: item});
    }

    return (
        <div className={styles.productLayout}>
            {isLoading && <span className={styles.isLoading}>is loading...</span>}
            {data && <div className={styles.card}>
                
                    {/*details about product*/}
                    <img src={data.image[0]} className={styles.cardImage} alt="productImage"></img>
                    <div className={styles.content}>
                        <p>Title: {data.title} </p>
                        <p>Description: {data.description} </p>
                        <p>Location: {data.location} </p>
                        <p>Price: {data.price} euros</p>
                        <p>Author: {data.author.username}</p>
                        {isAuthor && 
                            <div className={styles.btnWrapper}>
                                <button className={styles.editBtn} onClick={(e)=>{handleEdit(e, data)}}>Edit</button>
                                <button className={styles.deleteBtn} onClick={(e)=>{handleDelete(e, data)}}>Delete</button>
                            </div>
                        }
                        <div className={styles.btnWrapper2}>
                            <button className={styles.addToCartBtn} onClick={(e)=>{handleAddToCart(e, data)}}>Add to cart</button>
                        </div>
                    </div>

                    {/*Reviews component kojoj cu proslijediti id producta da dohvatim sve review-ove povezano s ovim product-om*/}
                    <Reviews id = {id}/>
                </div>}
            {deleteModalOpen.state && <div className={styles.modalWrapper}><DeleteModal closeModal={[deleteModalOpen, setDeleteModalOpen]} /></div>}
            {error && <span>Error with fetching data</span>}
        </div>
    )
}

export default Product;