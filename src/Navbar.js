import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import ShoppingCartModal from './ShoppingCartModal';
import { ShoppingCartContext } from './App' ;
import { UserContext } from './App';
import axios from "axios";


function Navbar(props) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);

    //shoppingCart globalna state varijabla koja sadrži niz objekata/produkata koji su u košarici
    const { shoppingCart } = useContext(ShoppingCartContext);
    //dispatchShoppingCart metoda za update-anje shoppingCart globalne state varijable
    //const { dispatchShoppingCart } = useContext(ShoppingCartContext);

    //user globalna state varijabla koja sadrži objekt (s podatcima o logiranom useru, ako ima koji takav)
    //dispatchUser metoda za update-anje user globalne state varijable
    const { user, dispatchUser } = useContext(UserContext);

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


    async function handleLogout(e){
      e.preventDefault();
      setIsModalOpen(false);
      //update-amo globalnu user varijablu
      dispatchUser({type: 'remove/logout'});
      //sad šaljemo request serveru na '/logout' da odlogira user-a iz login server session
      try{
          //odlogirat ćemo user-a (iz login server session i maknuti iz naše client session tako da update-amo našu client session)
          const response = await axios.get('http://localhost:8080/logout', {withCredentials: true});
          //console.log(response.data);
          if(typeof(response.data) === "string" ){
              console.log(response.data);
          }else{
              const { username, email } = response.data;
              console.log(`removing user: USERNAME: ${username}, EMAIL: ${email}`);
          }
      }catch(error){
        console.log(error);
      }
  }


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
                {!(user.isLoggedIn) ? 
                  <li>
                      <Link to='/login' onClick={()=>{setIsModalOpen(false)}}>Login</Link> / <Link to='/register' onClick={()=>{setIsModalOpen(false)}}>Register</Link>
                  </li> :
                  <>
                    <li>
                        <Link to='/newProduct' onClick={()=>{setIsModalOpen(false)}}>New Product</Link>
                    </li>
                    <li>
                        <div className="logout" onClick={(e)=>{handleLogout(e)}}>Logout</div>
                    </li>
                  </>
                }
              </ul>
              <div className="shoppingIcon"><i className="fas fa-shopping-cart fa-lg" onClick={(e)=>{e.stopPropagation(); setIsModalOpen2(prevIsModalOpen2 => !prevIsModalOpen2);}}> <span>{shoppingCart.length}</span> </i></div>
            </>
            {<div className={isModalOpen2 ? 'shoppCartModal open' : 'shoppCartModal'}><ShoppingCartModal /></div>}
        </nav>
    );
}

export default Navbar;