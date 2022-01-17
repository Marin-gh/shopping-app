import React, { useState, useEffect } from 'react';
import styles from './EditProduct.module.css';
import axios from "axios";
import { useHistory, useParams } from 'react-router-dom';

function EditProduct(props) {

    const [data, setData] = useState({title:"", description:"", price:"", location:"", images:[], oldImages:[]});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({state: false, msg: ""});
    const history = useHistory();
    const [validation, setValidation] = useState({title:"", description:"", price:"", location:""});

    //id će biti id od product-a kojeg editiram
    const { id } = useParams();

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
                    const { images } = fetchedData.data;
                    setData({...fetchedData.data, images: [], oldImages: images});
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

    async function handleSubmit(e){
        e.preventDefault();
        let isValid = validateForm();
        if(isValid){
            setIsLoading(true);
            //sad šaljemo podatke serveru (put request)
            try{
                //FormData() je format u kojem ćemo serveru slati data (budući da data sadrži i file(s))
                const dataToSend = new FormData();
                //pod propertyjem (key-em) .images ćemo puniti podatke o svakom upload-anom file-u (image-u)
                for(let i=0; i<data.images.length; i++){
                    dataToSend.append('images', data.images[i]);
                };
                dataToSend.append('title', data.title);
                dataToSend.append('description', data.description);
                dataToSend.append('price', parseInt(data.price));
                dataToSend.append('location', data.location);
                dataToSend.append('oldImages', JSON.stringify(data.oldImages));
                //console.log(dataToSend.getAll('oldImages'));
                const response = await axios({method: 'PUT', url: `http://localhost:8080/products/${id}`, data: dataToSend, withCredentials: true, headers: {"Content-Type":"multipart/form-data"}});
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
    };

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

    function handleRemoveIcon(e, oldImageToRemove){
        const updatedOldImages = data.oldImages.filter((item)=>{
            return item !== oldImageToRemove;
        });
        setData({...data, oldImages: updatedOldImages});
    };


    return (
        <>
            <div className={styles.editProdWrapper}><div className={styles.title}>Edit a product:</div>
                <form action="" className={styles.editProdForm} noValidate onSubmit={(e)=>{handleSubmit(e)}}>
                    <label htmlFor="prodTitle">Title:</label>
                    <input type="text" id="prodTitle" placeholder="title" required value={data.title} onChange={(e)=>{setData({...data, title:e.target.value})}}></input>
                    {validation.title &&
                    <span className={styles.validationError}>{validation.title}</span>}

                    <label htmlFor="prodDescription">Description:</label>
                    <textarea rows="6" id="prodDescription" placeholder="description" required value={data.description} onChange={(e)=>{setData({...data, description:e.target.value})}}></textarea>
                    {validation.description &&
                    <span className={styles.validationError}>{validation.description}</span>}

                    <label htmlFor="prodLocation">Location:</label>
                    <input type="text" id="prodLocation" placeholder="location" required value={data.location} onChange={(e)=>{setData({...data, location:e.target.value})}}></input>
                    {validation.location &&
                    <span className={styles.validationError}>{validation.location}</span>}

                    <label htmlFor="prodPrice">Price:</label>
                    <input type="text" id="prodPrice" placeholder="price" required value={data.price} onChange={(e)=>{setData({...data, price: e.target.value})}}></input>
                    {validation.price &&
                    <span className={styles.validationError}>{validation.price}</span>}

                    <label htmlFor="prodImg">New Image(s):</label>
                    <input type="file" id="prodImg" placeholder="image(s)" multiple onChange={(e)=>{setData({...data, images: e.target.files})}}></input>

                    <button type="submit" className={styles.submitBtn}><span className={styles.btnFront}>Save</span></button>
                </form>
                {isLoading && <span className={styles.isLoading}>is loading...</span>}
                {error.state && <span>{error.msg}</span>}
                {data.oldImages.length!==0 && 
                    <>
                        <span className={styles.askMsg}>Do you want to delete any of uploaded images?</span>
                        <div className={styles.oldImagesWrapper}>
                            {data.oldImages.map((oldImage)=>{
                                return(
                                    <div className={styles.oldImageAndDelete} key={oldImage.filename}>
                                        <img src={oldImage.url} className={styles.cardImage} alt="productImage"></img>
                                        <div className={styles.removeIcon} onClick={(e)=>{handleRemoveIcon(e, oldImage)}}><i className="fas fa-times-circle"></i></div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                }
            </div>
        </>
    );
}

export default EditProduct;