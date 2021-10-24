import React, { useState } from 'react';
import styles from './NewProduct.module.css';
import axios from "axios";
import { useHistory } from 'react-router-dom';

function NewProduct(props) {

    const [data, setData] = useState({title:"", description:"", price:"", location:"", image:[]});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({state: false, msg: ""});
    const history = useHistory();

    async function handleSubmit(e){
        e.preventDefault();
        setIsLoading(true);
        //sad šaljemo podatke serveru (post request)
        try{
            const response = await axios.post('http://localhost:8080/products', data, {withCredentials: true});
            //console.log(response.data);
            setIsLoading(false);
            if(typeof(response.data) === "string" ){
                setError({state: true, msg: response.data});
            }else{
                setError({state: false, msg: ""});
                history.replace('/products');
            }
        }catch(err){
            setError({state: true, msg: err});
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
            {error.state && <span>{error.msg}</span>}
        </>
    );
}

export default NewProduct;