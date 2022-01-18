import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import ShoppingCartModal from './ShoppingCartModal';
import { ShoppingCartContext } from './App' ;
import { UserContext } from './App';
import axios from "axios";


function Navbar(props) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({state: false, msg: ""});

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
      setIsLoading(true);
      //sad šaljemo request serveru na '/logout' da odlogira user-a iz login server session
      try{
          //odlogirat ćemo user-a (iz login server session i maknuti iz naše client session tako da update-amo našu client session)
          const response = await axios.get('http://localhost:8080/logout', {withCredentials: true});
          //console.log(response.data);
          setIsLoading(false);
          if(typeof(response.data) === "string" ){
              setError({state: true, msg: response.data});
          }else{
              setError({state: false, msg: ""});
              const { username, email } = response.data;
              console.log(`removing user: USERNAME: ${username}, EMAIL: ${email}`);
              //update-amo globalnu user varijablu ako smo se uspješno odlogirali
              dispatchUser({type: 'remove/logout'});
          }
      }catch(err){
          setError({state: true, msg: err});
          setIsLoading(false);
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
                  <NavLink exact to="/" onClick={()=>{setIsModalOpen(false)}} activeClassName="navSelected" /*className={isActive => (isActive ? "navSelected" : "")}*/>Home</NavLink>
                  {/*<Link to='/' onClick={()=>{setIsModalOpen(false)}}>Home</Link>*/}
                </li>
                <li>
                  <NavLink exact to="/products" onClick={()=>{setIsModalOpen(false)}} activeClassName="navSelected" /*className={(isActive) => (isActive ? "navSelected" : "")}*/>Products</NavLink>
                </li>
                {!(user.isLoggedIn) ? 
                  <li>
                      <NavLink exact to='/login' onClick={()=>{setIsModalOpen(false)}} activeClassName="navSelected" /*className={(isActive) => (isActive ? "navSelected" : "")}*/>Login</NavLink> / <NavLink exact to='/register' onClick={()=>{setIsModalOpen(false)}} activeClassName="navSelected" /*className={(isActive) => (isActive ? "navSelected" : "")}*/>Register</NavLink>
                  </li> :
                  <>
                    <li>
                        <NavLink exact to='/newProduct' onClick={()=>{setIsModalOpen(false)}} activeClassName="navSelected" /*className={(isActive) => (isActive ? "navSelected" : "")}*/>New Product</NavLink>
                    </li>
                    <li>
                        {(!isLoading && !error.state) ? 
                            <span className="logout" onClick={(e)=>{setIsModalOpen(false); handleLogout(e)}}>Logout</span> :
                            <>
                                {isLoading && <span>Is loading....</span>}
                                {error.state && <span className='errorMsg'>{error.msg}</span>}
                            </>
                        }
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