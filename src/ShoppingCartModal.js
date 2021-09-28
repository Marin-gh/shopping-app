import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './ShoppingCartModal.module.css';
import { ShoppingCartContext } from './App' ;

function ShoppingCartModal(props) {

    //shoppingCart globalna state varijabla koja sadrži niz objekata/produkata koji su u košarici
    const { shoppingCart } = useContext(ShoppingCartContext);

    return (
        <>
            {shoppingCart.length!== 0 && <div className={styles.shoppingCartModalWrapper}>{shoppingCart.map((item)=>{
                return(
                <Link to={`/products/${item.id}`} key={item.id} className={styles.shoppingCartLink}>
                    <div className={styles.shoppingCartOneCard}>
                        <p>Title: {item.title}</p>
                        <p>NoOrders: {item.noOrders}</p>
                        <p>Price: {item.price * item.noOrders} euros</p>
                    </div>
                </Link>);
            })}
            </div>}
        </>   
    );
}

export default ShoppingCartModal;