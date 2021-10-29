import React, { useState } from 'react';
import styles from './NewProduct.module.css';
import axios from "axios";
import { useHistory } from 'react-router-dom';

function NewProduct(props) {

    const [data, setData] = useState({title:"", description:"", price:"", location:"", images:[]});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({state: false, msg: ""});
    const history = useHistory();

    async function handleSubmit(e){
        e.preventDefault();
        setIsLoading(true);
        //sad šaljemo podatke serveru (post request)
        try{
            //FormData() je format u kojem ćemo serveru data (budući da data sadrži i file(s))
            const dataToSend = new FormData();
            //pod propertyjem (key-em) .images ćemo puniti podatke o svakom upload-anom file-u (image-u)
            for(let i=0; i<data.images.length; i++){
                dataToSend.append('images', data.images[i]);
            };
            dataToSend.append('title', data.title);
            dataToSend.append('description', data.description);
            dataToSend.append('price', data.price);
            dataToSend.append('location', data.location);
            const response = await axios({method: 'POST', url: 'http://localhost:8080/products', data: dataToSend, withCredentials: true, headers: {"Content-Type":"multipart/form-data"}});
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
                    <input type="text" id="prodTitle" placeholder="title" required onChange={(e)=>{setData({...data, title: e.target.value})}}></input>

                    <label htmlFor="prodDescription">Description:</label>
                    <textarea rows="6" id="prodDescription" placeholder="description" required onChange={(e)=>{setData({...data, description: e.target.value})}}></textarea>

                    <label htmlFor="prodLocation">Location:</label>
                    <input type="text" id="prodLocation" placeholder="location" required onChange={(e)=>{setData({...data, location: e.target.value})}}></input>

                    <label htmlFor="prodPrice">Price:</label>
                    <input type="text" id="prodPrice" placeholder="price" required onChange={(e)=>{setData({...data, price: parseInt(e.target.value)})}}></input>

                    <label htmlFor="prodImg">Image(s):</label>
                    <input type="file" id="prodImg" placeholder="image(s)" required multiple onChange={(e)=>{setData({...data, images: [...data.images, ...e.target.files]})}}></input>

                    <button type="submit" className={styles.submitBtn}>Add a product</button>
                </form>
            </div>
            {isLoading && <span className={styles.isLoading}>is loading...</span>}
            {error.state && <span>{error.msg}</span>}
        </>
    );
}

export default NewProduct;