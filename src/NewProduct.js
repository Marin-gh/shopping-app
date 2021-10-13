import React, { useState } from 'react';
import styles from './NewProduct.module.css';
import axios from "axios";
import { useHistory } from 'react-router-dom';

function NewProduct(props) {

    const [data, setData] = useState({title:"", description:"", price:"", location:"", image:[]});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const history = useHistory();

    async function handleSubmit(e){
        e.preventDefault();
        setIsLoading(true);
        //sad šaljemo podatke serveru (post request)
        try{
            const response = await axios.post('http://localhost:8080/products', data);
            //console.log(response.data);
            setIsLoading(false);
            if(typeof(response.data) === "string" ){
                setError(true);
            }else{
                setError(false);
                history.replace('/products');
            }
        }catch{
            setError(true);
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className={styles.newProdWrapper}><div className={styles.title}>Add a new product:</div>
                <form action="" className={styles.newProdForm} onSubmit={(e)=>{handleSubmit(e)}}>
                    <label htmlFor="prodTitle">Title:</label>
                    <input type="text" id="prodTitle" placeholder="title" required onChange={(e)=>{setData({...data, title:e.target.value})}}></input>

                    <label htmlFor="prodDescription">Description:</label>
                    <textarea rows="6" id="prodDescription" placeholder="description" required onChange={(e)=>{setData({...data, description:e.target.value})}}></textarea>

                    <label htmlFor="prodLocation">Location:</label>
                    <input type="text" id="prodLocation" placeholder="location" required onChange={(e)=>{setData({...data, location:e.target.value})}}></input>

                    <label htmlFor="prodPrice">Price:</label>
                    <input type="text" id="prodPrice" placeholder="price" required onChange={(e)=>{setData({...data, price:parseInt(e.target.value)})}}></input>

                    <label htmlFor="prodImg">Image:</label>
                    <input type="text" id="prodImg" placeholder="image" required onChange={(e)=>{setData({...data, image: [e.target.value]})}}></input>

                    <button type="submit" className={styles.submitBtn}>Add a product</button>
                </form>
            </div>
            {isLoading && <span className={styles.isLoading}>is loading...</span>}
            {error && <span>Error with fetching data</span>}
        </>
    );
}

export default NewProduct;