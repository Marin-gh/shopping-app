import React, { useState, useEffect } from 'react';
import styles from './Products.module.css';
import axios from "axios";
import PaginatedItems from './PaginatedItems';

function Products(props) {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState({state: false, msg: ""});

    //fetch data from db
    useEffect(()=>{
        async function fetchData(){
            try{
                const fetchedData = await axios.get('http://localhost:8080/products', {withCredentials: true});
                //console.log(fetchedData);
                //fetchedData.data mi treba biti niz objekata(produkata)
                if(typeof(fetchedData.data) === "string" ){
                    setError({state: true, msg: fetchedData.data});
                }else{
                    //console.dir(fetchedData.data);
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
    },[]);

    return (
        <div className={styles.productsLayout}>
            {isLoading && <span className={styles.isLoading}>is loading...</span>}

            {data.length!==0 && <PaginatedItems data={data} itemsPerPage={4}/>}

            {error.state && <span>{error.msg}</span>}
        </div>
    )
}

export default Products;