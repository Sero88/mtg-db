import styles from '../styles/home.module.scss';
import { CollectionOption } from '../components/collection-option';
import {DailyFlavorText} from '../components/daily-flavor-text';

export default function Home() {
  return (
    <>  
      
      <DailyFlavorText />
   

      <div className={styles.collectionOptionsWrapper}>
        
          <CollectionOption 
            mainImage="/images/cards-add-image.png" 
            imageBg="/images/add-polygon.png" 
            title="Search Collection"
            mainImagePosition="right"
            link="/collection/search"
          />

          <CollectionOption 
            mainImage="/images/cards-search-image.png" 
            imageBg="/images/search-polygon.png" 
            title="Add to Collection"
            mainImagePosition="left"
            link="/collection/add"
          />
  
      </div>

      <div>
        <h2>Latest Set Name</h2>
      </div>
    </>
  )
}
