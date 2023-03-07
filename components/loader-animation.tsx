import style from '../styles/loader.module.scss';

export default function LoaderAnimation(){
    return (
        <div className={style.loader} data-testid="loader"></div>
    );
}