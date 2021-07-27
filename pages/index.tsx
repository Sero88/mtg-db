import {Icon} from '../components/font-awesome-icon';

export default function Home() {
  return (
    <>  
      <div className="dailyFlavorText">
        <Icon icon="quoteLeft" />
        <p>This is the daily flavor text of the day</p>
        <Icon icon="quoteRight" />
      </div>

      <div>
        <h2>Latest Set Name</h2>
      </div>
    </>
  )
}
