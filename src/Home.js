import React from 'react';
import styles from './Home.module.css';

function Home() {
    return (
        <div className={styles.home}>
            <img className={styles.img} src="https://m.media-amazon.com/images/M/MV5BNzFiNWE2ZTktYzBhZS00ZmMwLTg5NDYtYTkwM2I0NjZhMTExXkEyXkFqcGdeQXVyNzU1NzE3NTg@._V1_QL75_UX500_CR0,47,500,281_.jpg" alt="HomeCar"/>
            <div className={styles.welcome}>
                Welcome to the Shopping App!
            </div>
        </div>
    );
}

export default Home;