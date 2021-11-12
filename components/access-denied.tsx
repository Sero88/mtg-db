import { signIn } from "next-auth/client";
import styles from "../styles/accessDenied.module.scss";
import Image from 'next/image'

export default function AccessDenied(){
    return(
        <main>
            <div className={`wrapper ${styles.deniedWrapper}`}>
                <div className={styles.accessDeniedComponent}>
                    <div className={styles.deniedCard}>
                        <Image
                            src="/images/shall-not-pass.jpg"
                            width={300}
                            height={418}
                            alt=""
                        />
                    </div>
                    <p>You must be logged in to access this site.</p>
                    <button onClick={()=>signIn()}>Sign In</button>
                </div>
                
            </div>   
        </main>
    );
}