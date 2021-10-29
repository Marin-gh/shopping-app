import React, { useState, useEffect } from 'react';
import styles from './EditProduct.module.css';
import axios from "axios";
import { useHistory, useParams } from 'react-router-dom';

function EditProduct(props) {

    const [data, setData] = useState({title:"", description:"", price:"", location:"", images:[], oldImages:[]});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({state: false, msg: ""});
    const history = useHistory();

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
    };

    function handleRemoveIcon(e, oldImageToRemove){
        const updatedOldImages = data.oldImages.filter((item)=>{
            return item !== oldImageToRemove;
        });
        setData({...data, oldImages: updatedOldImages});
    };


    return (
        <>
            <div className={styles.editProdWrapper}><div className={styles.title}>Edit a product:</div>
                <form action="" className={styles.editProdForm} onSubmit={(e)=>{handleSubmit(e)}}>
                    <label htmlFor="prodTitle">Title:</label>
                    <input type="text" id="prodTitle" placeholder="title" required value={data.title} onChange={(e)=>{setData({...data, title:e.target.value})}}></input>

                    <label htmlFor="prodDescription">Description:</label>
                    <textarea rows="6" id="prodDescription" placeholder="description" required value={data.description} onChange={(e)=>{setData({...data, description:e.target.value})}}></textarea>

                    <label htmlFor="prodLocation">Location:</label>
                    <input type="text" id="prodLocation" placeholder="location" required value={data.location} onChange={(e)=>{setData({...data, location:e.target.value})}}></input>

                    <label htmlFor="prodPrice">Price:</label>
                    <input type="text" id="prodPrice" placeholder="price" required value={data.price} onChange={(e)=>{setData({...data, price: e.target.value})}}></input>

                    <label htmlFor="prodImg">New Image(s):</label>
                    <input type="file" id="prodImg" placeholder="image(s)" multiple onChange={(e)=>{setData({...data, images: e.target.files})}}></input>

                    <button type="submit" className={styles.submitBtn}>Save</button>
                </form>
                {isLoading && <span className={styles.isLoading}>is loading...</span>}
                {error.state && <span>{error.msg}</span>}
                {data.oldImages.length!==0 && 
                    <div className={styles.oldImagesWrapper}>
                        {data.oldImages.map((oldImage)=>{
                            return(
                                <div className={styles.oldImageAndDelete} key={oldImage.filename}>
                                    <img src={oldImage.url} className={styles.cardImage} alt="productImage"></img>
                                    <div className={styles.removeIcon} onClick={(e)=>{handleRemoveIcon(e, oldImage)}}><i className="fas fa-minus-circle"></i></div>
                                </div>
                            );
                        })}
                    </div>
                }
            </div>
        </>
    );
}

export default EditProduct;