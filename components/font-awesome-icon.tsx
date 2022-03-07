import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch, faPlus, faMinus, faQuoteLeft, faQuoteRight, faTimes, faChartBar} from '@fortawesome/free-solid-svg-icons';

const icons = {
    search: faSearch,
    plus: faPlus,
    minus: faMinus,
    quoteLeft: faQuoteLeft,
    quoteRight: faQuoteRight,
    times: faTimes,
    chartBar: faChartBar,
}

type Icon = {
    icon: keyof typeof icons, 
    className?: string
}

export function Icon({icon, className=""} : Icon){
    className = className ? className : `${icon}Icon`;
    return (
        <FontAwesomeIcon className={"fa-icon" + " " + className } icon={icons[icon]}/>
    );

}