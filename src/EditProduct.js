import React, { useState, useEffect } from 'react';
import styles from './EditProduct.module.css';
import axios from "axios";
import { useHistory, useParams } from 'react-router-dom';

function EditProduct(props) {

    const [data, setData] = useState({title:"", description:"", price:"", location:"", image:[]});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const history = useHistory();

    //id će biti id od product-a kojeg editiram
    const { id } = useParams();

    //fetch data from db with given id (given as params)
    useEffect(()=>{
        async function fetchData(){
            try{
                const fetchedData = await axios.get(`http://localhost:8080/products/${id}`);
                //console.log(fetchedData);
                //fetchedData.data mi treba biti traženi objekt(product)
                if(typeof(fetchedData.data) === "string" ){
                    setError(true);
                }else{
                    setData(fetchedData.data);
                    setError(false);
                }
                setIsLoading(false);
            }catch{
                setError(true);
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
            const response = await axios.put(`http://localhost:8080/products/${id}`, data);
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
            <div className={styles.editProdWrapper}><div className={styles.title}>Edit a product:</div>
                <form action="" className={styles.editProdForm} onSubmit={(e)=>{handleSubmit(e)}}>
                    <label htmlFor="prodTitle">Title:</label>
                    <input type="text" id="prodTitle" placeholder="title" required value={data.title} onChange={(e)=>{setData({...data, title:e.target.value})}}></input>

                    <label htmlFor="prodDescription">Description:</label>
                    <textarea rows="6" id="prodDescription" placeholder="description" required value={data.description} onChange={(e)=>{setData({...data, description:e.target.value})}}></textarea>

                    <label htmlFor="prodLocation">Location:</label>
                    <input type="text" id="prodLocation" placeholder="location" required value={data.location} onChange={(e)=>{setData({...data, location:e.target.value})}}></input>

                    <label htmlFor="prodPrice">Price:</label>
                    <input type="text" id="prodPrice" placeholder="price" required value={data.price} onChange={(e)=>{setData({...data, price:parseInt(e.target.value)})}}></input>

                    <label htmlFor="prodImg">Image:</label>
                    <input type="text" id="prodImg" placeholder="image" required value={data.image[0] || ''} onChange={(e)=>{setData({...data, image: [e.target.value]})}}></input>

                    <button type="submit" className={styles.submitBtn}>Save</button>
                </form>
            </div>
            {isLoading && <span className={styles.isLoading}>is loading...</span>}
            {error && <span>Error with fetching data</span>}
        </>
    );
}

export default EditProduct;