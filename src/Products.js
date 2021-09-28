import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Products.module.css';
import DeleteModal from './DeleteModal.js';

function Products(props) {

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    //isAuthor bi trebali dobiti iz server-a (kad se logiramo, onda bi nam browser treba poslati id logiranog user-a i taj id ćemo spremiti u ovu varijablu); to bi mogla biti globalna state varijabla
    const [isAuthor, setIsAuthor] = useState(true);

    const[deleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(()=>{
        //fetch data from db
        //sad bez db
        const falseData = [
            {id: '1', title: 'BMW', description: "Good car", location: "Split", price:25000, image: "https://www.bmw.hr/content/dam/bmw/common/all-models/m-series/x2-m/navigation/bmw-x-series-x2-m35i-modelfinder.png"},
            {id: '2', title: 'Mercedes', description: "Perfect car", location: "Zagreb", price: 18000, image: "https://upload.wikimedia.org/wikipedia/commons/f/f7/2018_Mercedes-Benz_A200_AMG_Line_Premium_Automatic_1.3_Front.jpg"},
            {id: '3', title: 'Škoda', description: "Bad car", location: "Zadar", price: 10000, image: "https://media.autoexpress.co.uk/image/private/s--YqkqBUCE--/f_auto,t_content-image-full-mobile@1/v1595492412/autoexpress/2020/07/Skoda%20Octavia%20UK%202020-19.jpg"}
        ];
        setData(falseData);
        setIsLoading(false);
    },[])

    function handleEdit(e, item){
        e.stopPropagation();
        console.log(`You clicked edit button: ${e.target}, ${item.id}`);
    }

    function handleDelete(e, item){
        e.stopPropagation();
        console.log(`You clicked delete button: ${e.target}, ${item.id}`);
        setDeleteModalOpen(true);
    }

    return (
        <div className={styles.productsLayout}>
            {isLoading && <span className={styles.isLoading}>is loading...</span>}
            {data && <div className={styles.cardWrapper}>{data.map((item)=>{
                return(
                <div className={styles.card} key={item.id}>
                    <Link to={`/products/${item.id}`} className={styles.link} >
                        <img src={item.image} className={styles.cardImage} alt="productImage"></img>
                        <p>Title: {item.title} </p>
                        <p>Description: {item.description} </p>
                        <p>Location: {item.location} </p>
                        <p>Price: {item.price} euros</p>
                    </Link>
                    {isAuthor && 
                        <div className={styles.btnWrapper}><button className={styles.editBtn} onClick={(e)=>{handleEdit(e, item)}}>Edit</button><button className={styles.deleteBtn} onClick={(e)=>{handleDelete(e, item)}}>Delete</button></div>
                    }
                </div>
                )})}
            </div>}
            {deleteModalOpen && <DeleteModal closeModal={[deleteModalOpen, setDeleteModalOpen]} />}
            {error && <span>Error with fetching data</span>}
        </div>
    )
}

export default Products;