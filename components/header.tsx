import Link from 'next/link';
import Image from 'next/image';
import {Icon} from './font-awesome-icon';

export default function Header(){

    return(
        <header>
            <div className="wrapper">
                <div className="siteIdentity">
                    <Link href="/">
                        <a>
                            <Image
                                src="/images/logo.png"
                                alt="Lovers&#39; Standard"
                                width={156}
                                height={68}
                            />
                        </a>
                    </Link>
                </div>
                <nav>
                    <ul>
                        <li>
                            <Link href="/collection/search">
                                <a><Icon icon="search"/> Search</a>
                            </Link>                                        
                        </li>
                        <li>
                            <Link href="/collection/add">
                                <a><Icon icon="plus"/> Add Cards</a>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
        
    );

}