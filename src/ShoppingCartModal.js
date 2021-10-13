import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './ShoppingCartModal.module.css';
import { ShoppingCartContext } from './App' ;

function ShoppingCartModal(props) {

    //shoppingCart globalna state varijabla koja sadrži niz objekata/produkata koji su u košarici
    //dispatchShoppingCart to update shoppingCart global state variable
    const { shoppingCart, dispatchShoppingCart } = useContext(ShoppingCartContext);

    function TotalPrice(){
        let sum = 0;
        for(let item of shoppingCart){
            sum = sum + (item.price * item.noOrders);
        }
        return sum;
    }

    function handleRemove(e, item){
        e.stopPropagation();
        console.log("You clicked remove icon!");
        dispatchShoppingCart({type: 'remove', data: item});
    }

    function handleNoOrders(e, item){
        e.stopPropagation();
        console.log(`You change the noOrders value to ${e.target.value}`);
        if ((e.target.value>=1 && e.target.value<=100)){
            dispatchShoppingCart({type: 'change', data: item, noOrders: parseInt(e.target.value)});
        }else if(e.target.value===""){
            dispatchShoppingCart({type: 'change', data: item, noOrders: 0});
        }
    }

    //nakon napuštanja focusa input-a za noOrders koji je prazan, update-a se .noOrders property tog item-a na 1
    function handleNoOrders2(e, item){
        if(e.target.value===""){
            dispatchShoppingCart({type: 'change', data: item, noOrders: 1});
        }
    }
    
    function noOrders(item){
        //ako je .noOrders property item-a 0 (što smo mogli postići brisajući sve iz input-a za noOrders), onda vrati prazan string (koji će se prikazati u tom inputu, dakle taj input će biti prazan iako će .noOrders tog item-a biti 0)
        if (item.noOrders===0){
            return "";
        }else{
            return item.noOrders;
        }
    }

    return (
        <>
            {shoppingCart.length!== 0 && 
                <div className={styles.shoppingCartModalWrapper} onClick={(e)=>{e.stopPropagation();}}>
                    {shoppingCart.map((item)=>{
                        return(
                            <div key={item._id} className={styles.shoppingCartOneCard}>
                                <div className={styles.removeIcon} onClick={(e)=>{handleRemove(e, item)}}><i className="fas fa-minus-circle"></i></div>
                                <Link to={`/products/${item._id}`} onClick={(e)=>{console.log("You clicked on a link")}}>
                                    <img className={styles.shoppingCartImage} src={item.image} alt="productImage"></img>
                                </Link>
                                <p>{item.title}</p>
                                <p>NoOrders: <input type="number" min="1" max="100" step="1" value={noOrders(item)} onChange={(e)=>{handleNoOrders(e, item)}} onBlur={(e)=>handleNoOrders2(e,item)}></input></p>
                                <p>Price: {item.price * item.noOrders} euros</p>
                            </div>
                        );
                    })}
                    <div className={styles.totalPrice}>
                        Total: {TotalPrice()} euros
                    </div>
                </div>
            }
            {shoppingCart.length===0 && 
                <div className={styles.shoppingCartModalWrapper} onClick={(e)=>{e.stopPropagation();}}>
                    <div className={styles.shoppingCartEmptyMsg}>Shopping cart is empty!</div>
                </div>
            }
        </>   
    );
}

export default ShoppingCartModal;