import React from 'react';
import styles from './Home.module.css';
//import background from './assets/images/background.jpg';
import { useHistory } from 'react-router-dom';

function Home() {

    const history = useHistory();

    return (
        <div className={styles.home}>
            {/*<img className={styles.img} src={background} alt="HomeCar"/>*/}
            <button type="button" className={styles.btnShop} onClick={()=>{history.push('/products');}}>
                <span className={styles.btnFront}>View products</span>
            </button>
        </div>
    );
}

export default Home;