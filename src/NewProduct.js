import React, { useState } from 'react';
import styles from './NewProduct.module.css';

function NewProduct(props) {

    const [data, setData] = useState({title:"", description:"", location:"", price:"", image:""});

    function handleSubmit(e){
        e.preventDefault();
        //sad šaljemo podatke serveru (post request)
        //const sentData = data;
    }

    return (
        <div className={styles.newProdWrapper}><div className={styles.title}>Add a new product:</div>
            <form action="" className={styles.newProdForm} onSubmit={(e)=>{handleSubmit(e)}}>
                <label htmlFor="prodTitle">Title:</label>
                <input type="text" id="prodTitle" placeholder="title" onChange={(e)=>{setData({...data, title:e.target.value})}}></input>

                <label htmlFor="prodDescription">Description:</label>
                <textarea rows="6" id="prodDescription" placeholder="description" onChange={(e)=>{setData({...data, description:e.target.value})}}></textarea>

                <label htmlFor="prodLocation">Location:</label>
                <input type="text" id="prodLocation" placeholder="location" onChange={(e)=>{setData({...data, location:e.target.value})}}></input>

                <label htmlFor="prodPrice">Price:</label>
                <input type="text" id="prodPrice" placeholder="price" onChange={(e)=>{setData({...data, price:e.target.value})}}></input>

                <label htmlFor="prodImg">Image:</label>
                <input type="text" id="prodImg" placeholder="image" onChange={(e)=>{setData({...data, image:e.target.value})}}></input>

                <button type="submit" className={styles.submitBtn}>Add a product</button>
            </form>
        </div>   
    );
}

export default NewProduct;