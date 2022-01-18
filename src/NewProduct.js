import React, { useState } from 'react';
import styles from './NewProduct.module.css';
import axios from "axios";
import { useHistory } from 'react-router-dom';

function NewProduct(props) {

    const [data, setData] = useState({title:"", description:"", price:"", location:"", images:[]});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({state: false, msg: ""});
    const history = useHistory();
    const [validation, setValidation] = useState({title:"", description:"", price:"", location:""});

    async function handleSubmit(e){
        e.preventDefault();
        let isValid = validateForm();
        if(isValid){
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
    }

    function validateForm(){

        let titleValidText = "";
        let descriptionValidText = "";
        let locationValidText = "";
        let priceValidText = "";

        let isValid = true;

        if(data.title.length <=0 || data.title.length >=26){
            titleValidText = "Title must have between 1 and 25 characters";
            isValid = false;
        }
        if(data.description.length <=3 || data.description.length >= 101){
            descriptionValidText = "Description must have betweeen 4 and 100 characters";
            isValid = false;
        }
        if(data.location.length <=0 || data.location.length >= 26){
            locationValidText = "Location must have between 1 and 25 characters";
            isValid = false;
        }
        if(isNaN(data.price)){
            priceValidText = "Price must be a number";
            isValid = false;
        }
        if(!isNaN(data.price)){
            if(data.price < 0 || data.price > 32000000 || data.price === ""){
                priceValidText = "Price must be a number between 0 and 32 000 000";
                isValid = false;
            }
        }

        setValidation({title: titleValidText, description: descriptionValidText, location: locationValidText, price: priceValidText});
        return isValid;
    }

    return (
        <>
            <div className={styles.newProdWrapper}>{/*<div className={styles.title}>Add a new product:</div>*/}
                <form action="" className={styles.newProdForm} noValidate onSubmit={(e)=>{handleSubmit(e)}}>
                    <label htmlFor="prodTitle">Title:</label>
                    <input type="text" id="prodTitle" placeholder="title" onChange={(e)=>{setData({...data, title: e.target.value})}}></input>
                    {validation.title &&
                    <span className={styles.validationError}>{validation.title}</span>}

                    <label htmlFor="prodDescription">Description:</label>
                    <textarea rows="6" id="prodDescription" placeholder="description" onChange={(e)=>{setData({...data, description: e.target.value})}}></textarea>
                    {validation.description &&
                    <span className={styles.validationError}>{validation.description}</span>}

                    <label htmlFor="prodLocation">Location:</label>
                    <input type="text" id="prodLocation" placeholder="location" onChange={(e)=>{setData({...data, location: e.target.value})}}></input>
                    {validation.location &&
                    <span className={styles.validationError}>{validation.location}</span>}

                    <label htmlFor="prodPrice">Price:</label>
                    <input type="text" id="prodPrice" placeholder="price" onChange={(e)=>{setData({...data, price: e.target.value})}}></input>
                    {validation.price &&
                    <span className={styles.validationError}>{validation.price}</span>}

                    <label htmlFor="prodImg">Image(s):</label>
                    <input type="file" id="prodImg" placeholder="image(s)" multiple onChange={(e)=>{setData({...data, images: [...data.images, ...e.target.files]})}}></input>

                    <button type="submit" className={styles.submitBtn}><span className={styles.btnFront}>Add a product</span></button>
                </form>
            </div>
            {isLoading && <span className={styles.isLoading}>is loading...</span>}
            {error.state && <span className={styles.errorMsg}>{error.msg}</span>}
        </>
    );
}

export default NewProduct;