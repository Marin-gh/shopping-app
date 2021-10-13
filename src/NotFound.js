import React from 'react';
import styles from './NotFound.module.css';

function NotFound(props) {
    return (
        <div className={styles.notFoundWrapper}>
            <div className={styles.notFoundText}>Page not found!</div>
        </div>
    );
}

export default NotFound;