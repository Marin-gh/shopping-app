import React from 'react';
import { useReducer, useEffect } from 'react';
import styles from './App.module.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './Home';
import Navbar from './Navbar';
import Products from './Products';
import Product from './Product';
import NewProduct from './NewProduct';
import Login from './Login';
import Register from './Register';
import NotFound from './NotFound';
import Error from './Error';
import EditProduct from './EditProduct';

//initialState i reducerFuntion za globalnu ShoppingCart varijablu
//initialState će biti prazan niz (a inače ćemo tu spremati niz objekata/produkata na koje smo kliknuli "add to cart")
//action će sadržavati objekt s propertyjima .type (koja vrsta akcije) te .data koju ćemo add-ati ili remove-ati iz niza shoppingCart
const initialStateShoppingCart = [];
const reducerFunctionShoppingCart = (currentState, action) => {
	switch (action.type) {
		case 'add/increment':
      {
        console.log(`adding/incrementing shopping cart..`);
        //ako je action.data._id in currentState, tj. ako vec postoji taj product u kosarici
        if (currentState.length!==0 && currentState.some((item) => item._id === action.data._id)){
          //samo inkrementiraj .noOrders property tom postojećem productu iz košarice i returnaj novi niz s takvim promijenjenim productom
          const newState = currentState.map((item)=>{
            if(item._id === action.data._id){
              return {...action.data, noOrders: item.noOrders+1};
            }else{
              return item;
            }
          });
          return newState;
        }else{
          return [...currentState, {...action.data, noOrders: 1}];
        }
      }
		/*case 'decrement/remove':
      {
        console.log("removing/decrementing shopping cart..");
        if(action.data.noOrders === 1){
          //remove-aj taj product i returnaj novi state bez tog producta
          const newState = currentState.filter((item)=>{
            if(item._id !== action.data._id){
              return true;
            }else{
              return false;
            }
          });
          return newState;
        }else{
          //samo dekrementiraj .noOrders property tom action.data i returnaj novi niz s takvim promijenjenim productom
          const newState = currentState.map((item)=>{
            if(item._id === action.data._id){
              return {...action.data, noOrders: item.noOrders-1};
            }else{
              return item;
            }
          });
          return newState;
        }
      }*/
    case 'remove':
      {
        console.log("removing item from shopping cart..");
        //remove-aj taj product i returnaj novi state bez tog producta
        const newState = currentState.filter((item)=>{
          if(item._id !== action.data._id){
            return true;
          }else{
            return false;
          }
        });
        return newState;
      }
    case 'change':
      {
        console.log("changing noOrders property (min 1, max 100)..");
        //samo change .noOrders property tom action.data i returnaj novi niz s takvim promijenjenim productom
        const newState = currentState.map((item)=>{
          if(item._id === action.data._id){
            return {...action.data, noOrders: action.noOrders};
          }else{
            return item;
          }
        });
        return newState;
      }
		case 'reset':
			return initialStateShoppingCart;
		default:
			return currentState;
	}
}

//initialState i reducerFuntion za globalnu user varijablu
//initialState će biti prazan objekt (a inače ćemo tu spremati objekt/user-a koji je logiran); zapravo objekt s propertyjem .isLoggedIn postavljenim na false, ali
//nema ostalih propertyja koji bi se odnosili na logiranog usera
//action će sadržavati objekt s propertyjima .type (koja vrsta akcije) te .data (koji dobivamo od severa iz baze) koju ćemo add-ati/login kao podatci o logiranom useru
const initialStateUser = {isLoggedIn: false};
const reducerFunctionUser = (currentState, action) => {
	switch (action.type) {
		case 'add/login':
      //update user globalne state varijable s podatcima o user-u koji dolaze kao action.data od servera iz baze te postavljanje propertyja .isLoggedIn na true
          return {...action.data, isLoggedIn: true};
    case 'remove/logout':
          return {isLoggedIn: false};
    case 'reset':
        return {isLoggedIn: false};
    default:
        return currentState;
  }
}

//globalna ShoppingCartContext varijabla
export const ShoppingCartContext = React.createContext();

//globalna UserContext varijabla
export const UserContext = React.createContext();

function App() {

  //shoppingCart globalna state varijabla (na svaki refresh, vrijednost globalne state varijable je ono što je spremljeno u localeStorage pod key 'shoppingCart'
  //ili ako nije još spremljeno ništa, onda initialStateShoppingCart što je prazan niz)
  const [ shoppingCart, dispatchShoppingCart ] = useReducer(reducerFunctionShoppingCart, JSON.parse(localStorage.getItem('shoppingCart')) || initialStateShoppingCart );

  //user globalna state varijabla (na svaki refresh, vrijednost globalne state varijable je ono što je spremljeno u localeStorage pod key 'user'
  //ili ako nije još spremljeno ništa, onda initialStateUser što je prazan objekt, doduše s propertyje .isLoggedIn postavljenim na false)
  const [ user, dispatchUser ] = useReducer(reducerFunctionUser, JSON.parse(sessionStorage.getItem('user')) || initialStateUser );

  useEffect(() => {
    //na svaku promjenu globalne shoppingCart state varijable, spremi tu novu vrijednost u localeStorage pod key "shoppingCart"
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
  }, [shoppingCart]);

  useEffect(() => {
    //na svaku promjenu globalne user state varijable, spremi tu novu vrijednost u localeStorage pod key "user"
    sessionStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <ShoppingCartContext.Provider value={{shoppingCart, dispatchShoppingCart}}>
      <UserContext.Provider value={{user, dispatchUser}}>
        <Router>
          <div className={styles.layout}>
            
            <header>
                <Navbar/>
            </header>
            
            <article>
              <Switch>
                  <Route exact path="/">
                    <Home />
                  </Route>
                  <Route exact path="/products">
                    <Products />
                  </Route>
                  <Route exact path="/products/:id">
                    <Product />
                  </Route>
                  <Route exact path="/login">
                    <Login />
                  </Route>
                  <Route exact path="/register">
                    <Register />
                  </Route>
                  <Route exact path="/newProduct">
                    <NewProduct />
                  </Route>
                  <Route exact path="/editProduct/:id">
                    <EditProduct />
                  </Route>
                  <Route exact path="/error">
                    <Error />
                  </Route>
                  <Route path='*'>
                    <NotFound />
                  </Route>
                </Switch>
            </article>

            <footer className={styles.footer}>
              <div>@Copyright 2021 Shopping App</div>
            </footer>
          </div>
        </Router>
      </UserContext.Provider>
  </ShoppingCartContext.Provider>
  );
}

export default App;