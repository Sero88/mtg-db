import Image from 'next/image';
import styles from '../styles/collectionOption.module.scss';
import AddCards from './add-cards';
import Link from 'next/link';

type CollectionOptionProps = {
   imageBg: string,
   mainImage: string, 
   title: string, 
   mainImagePosition: 'left' | 'right',
   link: string

}

export function CollectionOption({imageBg, title, mainImage, mainImagePosition, link}:CollectionOptionProps){
    const allowedPositions =  {
        left: 'center left',
        right: 'center right'
    }

    const imagePosition = allowedPositions[mainImagePosition];

    const addType = {
    }
    return(
        <div className={styles.collectionOption}>
            <Link href={link}>
                <a>
                    <div className={styles.imagesWrapper}>
                        <Image 
                            src={imageBg}
                            layout="fill"
                            objectPosition="center center"
                            objectFit="contain"
                            className={styles.bgImage}
                        />

                        <Image 
                            src={mainImage}
                            layout="fill"
                            objectPosition={imagePosition}
                            objectFit="contain"
                            className={styles.mainImage}
                        />
                    </div>
                    <p className={styles.title}>{title}</p>
                </a>
              
            </Link>           
           
        </div>
    )
}