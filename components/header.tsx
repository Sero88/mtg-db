import Link from 'next/link';
import Image from 'next/image';
import {Icon} from './font-awesome-icon';
import styles from '../styles/header.module.scss';
import {useRouter} from 'next/router';

export default function Header(){

    const router = useRouter();
    const homePathStyles = router.pathname && router.pathname == '/' ? ' ' + styles.homeHeader : '';

    return(
        <header className={styles.mainHeader}>
            <div className={`${styles.headerWrapper+homePathStyles} wrapper`}>
                <div className={styles.siteLogoWrapper}>
                    <Link href="/">
                        <a>
                            <Image
                                src="/images/logo.png"
                                alt="Lovers&#39; Standard"
                                width={140}
                                height={68}
                                unoptimized={true}
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