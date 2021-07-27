import Link from 'next/link';
import {Icon} from './font-awesome-icon';

export default function Header(){

    return(
        <header>
        <div className="siteIdentity">
            <Link href="/">
                <a>Lover's Standard</a>
            </Link>
        </div>
        <nav>
            <ul>
                <li>
                    <Link href="/cards/search">
                        <a><Icon icon="search"/> Search</a>
                    </Link>                                        
                </li>
                <li>
                    <Link href="/cards/add">
                        <a><Icon icon="plus"/> Add Cards</a>
                    </Link>
                </li>
            </ul>
        </nav>
        </header>
        
    );

}