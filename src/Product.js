import styles from './Product.module.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import Reviews from './Reviews';
import DeleteModal from './DeleteModal.js';
import { ShoppingCartContext } from './App' ;
import axios from "axios";
import { useHistory } from 'react-router-dom';
import { UserContext } from './App';
import { RatingView } from 'react-simple-star-rating';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

function Product(props) {

    const { id } = useParams();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState({state: false, msg: ""});

    //state - je li otvoren ili zatvoren; url - endpoint na koji šaljemo delete request; redirect - di će nas preusmjeriti nakon delete-anja
    const [deleteModalOpen, setDeleteModalOpen] = useState({state: false, url: "", redirect: '/products'});

    //shoppingCart globalna state varijabla koja sadrži niz objekata/produkata koji su u košarici
    //const { shoppingCart } = useContext(ShoppingCartContext);
    //dispatchShoppingCart metoda za update-anje shoppingCart globalne state varijable
    const { dispatchShoppingCart } = useContext(ShoppingCartContext);

    //user globalna state varijabla koja sadrži objekt (s podatcima o logiranom useru, ako ima koji takav)
    //dispatchUser metoda za update-anje user globalne state varijable
    const { user } = useContext(UserContext);

    const history = useHistory();

    //fetch data from db with given id (given as params)
    useEffect(()=>{
        async function fetchData(){
            try{
                const fetchedData = await axios.get(`http://localhost:8080/products/${id}`, {withCredentials: true});
                //console.log(fetchedData);
                //fetchedData.data mi treba biti traženi objekt(product)
                if(typeof(fetchedData.data) === "string" ){
                    setError({state: true, msg: fetchedData.data});
                }else{
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
    },[id]);


    function handleEdit(e, item){
        e.stopPropagation();
        //console.log(`You clicked edit button: ${e.target}, ${item._id}`);
        history.push(`/editProduct/${item._id}`);
    }

    function handleDelete(e, item){
        e.stopPropagation();
        //console.log(`You clicked delete button: ${e.target}, ${item._id}`);
        setDeleteModalOpen({state: true, url: `http://localhost:8080/products/${item._id}`, redirect: '/products'});
    }

    function handleAddToCart(e, item){
        e.stopPropagation();
        //console.log("You clicked add to cart button!");
        dispatchShoppingCart({type: 'add/increment', data: item});
    }

    return (
        <div className={styles.productLayout}>
            {isLoading && <span className={styles.isLoading}>is loading...</span>}
            {data && <div className={styles.card}>
                
                    {/*details about product*/}
                    {data.images.length!==0 && 
                        <Carousel emulateTouch={true} useKeyboardArrows={true} thumbWidth='30%' width='100%' className={styles.carouselComponent}>
                            {data.images.map((image, index)=>{
                                return(
                                    <div key={image._id} className={styles.cardImageWrapper}>
                                        <img src={image.url} className={styles.cardImage} alt="productImage"></img>
                                    </div>
                                )
                            })}
                        </Carousel>
                    }
                    <div className={styles.content}>
                        <p className={styles.title}>{data.title}</p>
                        <p className={styles.location}>({data.location})</p>
                        <div className={styles.ratingViewAndSpan}>
                            <RatingView ratingValue={Math.round(data.avgRating)} size={20} className={styles.ratingView}/>
                            <span className={styles.avgRatingText}>({data.avgRating.toFixed(1)})</span>
                        </div>
                        <p className={styles.description}>{data.description} </p>
                        <p className={styles.seller}>Seller: {data.author.username}</p>
                        <p className={styles.price}>{data.price} €</p>
                        <div className={styles.btnWrapper2}>
                            <button className={styles.addToCartBtn} onClick={(e)=>{handleAddToCart(e, data)}}>
                                <span className={styles.btnFront}>
                                    <span className={styles.addToCartText}>Add to cart</span><i className="fas fa-shopping-cart fa-m"></i>
                                </span>
                            </button>
                        </div>
                        {data.author._id === user.id && 
                            <div className={styles.btnWrapper}>
                                <button className={styles.editBtn} onClick={(e)=>{handleEdit(e, data)}}>
                                    <span className={styles.editBtnFront}>Edit</span>
                                </button>
                                <button className={styles.deleteBtn} onClick={(e)=>{handleDelete(e, data)}}>
                                    <span className={styles.deleteBtnFront}>Delete</span>
                                </button>
                            </div>
                        }
                    </div>

                    {/*Reviews component kojoj cu proslijediti id producta da dohvatim sve review-ove povezane s ovim product-om*/}
                    <Reviews id = {id}/>
                </div>}
            {deleteModalOpen.state && 
                <div className={styles.modalOverlay}>
                    <div className={styles.modalWrapper}>
                        <DeleteModal closeModal={[deleteModalOpen, setDeleteModalOpen]} />
                    </div>
                </div>
            }
            {error.state && <span className={styles.errorMsg}>{error.msg}</span>}
        </div>
    )
}

export default Product;