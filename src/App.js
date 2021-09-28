import React from 'react';
import { useReducer } from 'react';
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

//initialState i reducerFuntion za globalnu ShoppingCart varijablu
//initialState će biti prazan niz (a inače ćemo tu spremati niz objekata/produkata na koje smo kliknuli "add to cart")
//action će sadržavati objekt s propertyjima .type (koja vrsta akcije) te .data koju ćemo add-ati ili remove-ati iz niza shoppingCart
const initalStateShoppingCart = [];
const reducerFunctionShoppingCart = (currentState, action) => {
	switch (action.type) {
		case 'add/increment':
      {
        console.log(`adding/incrementing shopping cart..`);
        //console.dir(currentState);
        //ako je action.data.id in currentState, tj. ako vec postoji taj product u kosarici
        if (currentState.length!==0 && currentState.some((item) => item.id === action.data.id)){
          //samo inkrementiraj .noOrders property tom postojećem productu iz košarice i returnaj novi niz s takvim promijenjenim productom
          const newState = currentState.map((item)=>{
            if(item.id === action.data.id){
              return {...action.data, noOrders: item.noOrders++};
            }else{
              return item;
            }
          });
          return newState;
        }else{
          return [...currentState, {...action.data, noOrders: 1}];
        }
      }
		case 'decrement/remove':
      {
        console.log("removing/decrementing shopping cart..");
        if(action.data.noOrders === 1){
          //remove-aj taj product i returnaj novi state bez tog producta
          const newState = currentState.filter((item)=>{
            if(item.id !== action.data.id){
              return true;
            }else{
              return false;
            }
          });
          return newState;
        }else{
          //samo dekrementiraj .noOrders property tom action.data i returnaj novi niz s takvim promijenjenim productom
          const newState = currentState.map((item)=>{
            if(item.id === action.data.id){
              return {...action.data, noOrders: item.noOrders--};
            }else{
              return item;
            }
          });
          return newState;
        }
      }
		case 'reset':
			return initalStateShoppingCart;
		default:
			return currentState;
	}
}

//globalna ShoppingCartContext varijabla
export const ShoppingCartContext = React.createContext();

function App() {

  //shoppingCart globalna state varijabla (bilo bi dobro to spremit u neki locale storage, a ne kao state varijablu) koja će sadržavati niz objekata/produkata
  const [ shoppingCart, dispatchShoppingCart ] = useReducer(reducerFunctionShoppingCart, initalStateShoppingCart );

  return (
    <ShoppingCartContext.Provider value={{shoppingCart, dispatchShoppingCart}}>
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
              </Switch>
          </article>

          <footer className={styles.footer}>
            <div>@Copyright 2021 Shopping App</div>
          </footer>
        </div>
      </Router>
  </ShoppingCartContext.Provider>
  );
}

export default App;