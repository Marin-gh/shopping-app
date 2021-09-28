import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import ShoppingCartModal from './ShoppingCartModal';
import { ShoppingCartContext } from './App' ;


function Navbar(props) {

    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);

    //shoppingCart globalna state varijabla koja sadrži niz objekata/produkata koji su u košarici
    const { shoppingCart } = useContext(ShoppingCartContext);
    //dispatchShoppingCart metoda za update-anje shoppingCart globalne state varijable
    //const { dispatchShoppingCart } = useContext(ShoppingCartContext);

    useEffect(()=>{
      const handleModal = ()=>{
        if(isModalOpen){
          setIsModalOpen(false);
        }
        if(isModalOpen2){
          setIsModalOpen2(false);
        }
      }
      window.addEventListener('click', handleModal);
      return () => {
        window.removeEventListener('click', handleModal);
      };

    },[isModalOpen, isModalOpen2]);


    return (
        <nav className="nav">
            <div className="navIcons">
              {isModalOpen ? <i className="fas fa-times fa-lg" onClick={(e) => {e.stopPropagation(); setIsModalOpen(false)}}></i> : <i className="fas fa-bars fa-lg" onClick={(e) => {e.stopPropagation(); setIsModalOpen(true)}}></i>}
              <i className="fas fa-shopping-cart fa-lg" onClick={(e)=>{e.stopPropagation(); setIsModalOpen2(prevIsModalOpen2 => !prevIsModalOpen2);}}> <span>{shoppingCart.length}</span> </i>
            </div>
            <>
              <ul className={isModalOpen ? 'navUl open' : 'navUl' }>
                <li>
                  <Link to='/' onClick={()=>{setIsModalOpen(false)}}>Home</Link>
                </li>
                <li>
                  <Link to='/products' onClick={()=>{setIsModalOpen(false)}}>Products</Link>
                </li> 
                <div>
                  {!isLoggedIn ? 
                    <li>
                        <Link to='/login' onClick={()=>{setIsModalOpen(false)}}>Login</Link> / <Link to='/register' onClick={()=>{setIsModalOpen(false)}}>Register</Link>
                    </li> :
                    <li>
                        <Link to='/newProduct' onClick={()=>{setIsModalOpen(false)}}>New Product</Link>
                    </li>
                  }
                </div>
              </ul>
              <div className="shoppingIcon"><i className="fas fa-shopping-cart fa-lg" onClick={(e)=>{e.stopPropagation(); setIsModalOpen2(prevIsModalOpen2 => !prevIsModalOpen2);}}> <span>{shoppingCart.length}</span> </i></div>
            </>
            {isModalOpen2 && <ShoppingCartModal />}
        </nav>
    );
}

export default Navbar;