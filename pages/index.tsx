import {Icon} from '../components/font-awesome-icon';
import styles from '../styles/home.module.scss';
import { CollectionOption } from '../components/collection-option';

export default function Home() {
  return (
    <>  
      <div className={styles.dailyFlavorText}>
        <Icon icon="quoteLeft" /><span>This is the daily flavor text of the day</span><Icon icon="quoteRight" />
      </div>

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
