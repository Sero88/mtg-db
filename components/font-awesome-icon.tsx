import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch, faPlus, faQuoteLeft, faQuoteRight} from '@fortawesome/free-solid-svg-icons';

const icons = {
    search: faSearch,
    plus: faPlus,
    quoteLeft: faQuoteLeft,
    quoteRight: faQuoteRight,
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