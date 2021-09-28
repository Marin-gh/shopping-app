import styles from './Product.module.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import Reviews from './Reviews';
import DeleteModal from './DeleteModal.js';
import { ShoppingCartContext } from './App' ;

function Product(props) {

    const { id } = useParams();
    const [isAuthor, setIsAuthor] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const[deleteModalOpen, setDeleteModalOpen] = useState(false);

    //shoppingCart globalna state varijabla koja sadrži niz objekata/produkata koji su u košarici
    //const { shoppingCart } = useContext(ShoppingCartContext);
    //dispatchShoppingCart metoda za update-anje shoppingCart globalne state varijable
    const { dispatchShoppingCart } = useContext(ShoppingCartContext);

    //fetch data from db with given id (given as params) 
    //sad bez db
    useEffect(()=>{
        const falseData = 
            {id: '1', title: 'BMW', description: "Good car", location: "Split", price:25000, image: "https://www.bmw.hr/content/dam/bmw/common/all-models/m-series/x2-m/navigation/bmw-x-series-x2-m35i-modelfinder.png"};
        setData(falseData);
        setIsLoading(false);
    },[]);

    function handleEdit(e, item){
        e.stopPropagation();
        console.log(`You clicked edit button: ${e.target}, ${item.id}`);
    }

    function handleDelete(e, item){
        e.stopPropagation();
        console.log(`You clicked delete button: ${e.target}, ${item.id}`);
        setDeleteModalOpen(true);
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
                    <img src={data.image} className={styles.cardImage} alt="productImage"></img>
                    <div className={styles.content}>
                        <p>Title: {data.title} </p>
                        <p>Description: {data.description} </p>
                        <p>Location: {data.location} </p>
                        <p>Price: {data.price} euros</p>
                        {isAuthor && 
                            <div className={styles.btnWrapper}><button className={styles.editBtn} onClick={(e)=>{handleEdit(e, data)}}>Edit</button><button className={styles.deleteBtn} onClick={(e)=>{handleDelete(e, data)}}>Delete</button></div>
                        }
                        {isLoggedIn && 
                            <div className={styles.btnWrapper2}><button className={styles.addToCartBtn} onClick={(e)=>{handleAddToCart(e, data)}}>Add to cart</button></div>
                        }
                    </div>

                    {/*review component kojoj cu proslijediti id da dohvatim sve review-ove povezano s ovim product-om*/}
                    <Reviews id = {id}/>
                </div>}
            {deleteModalOpen && <DeleteModal closeModal={[deleteModalOpen, setDeleteModalOpen]} />}
            {error && <span>Error with fetching data</span>}
        </div>
    )
}

export default Product;