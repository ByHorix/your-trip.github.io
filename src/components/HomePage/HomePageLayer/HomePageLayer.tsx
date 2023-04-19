import React, {PropsWithChildren} from "react";
import styles from './HomePageLayer.module.scss';

const HomePageLayer: React.FC<PropsWithChildren> = ({children}) => {
    return (
        <>
            <div className={styles.background}/>
            <div className={styles.homePageContainer}>
                {children}
            </div>
        </>
    )
}

export default HomePageLayer;
