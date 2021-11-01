import { useSession } from "next-auth/client";
import AccessDenied from "./access-denied";
import Header from "./header";
import Footer from "./footer";

type PropsWithChildren = {
    children: JSX.Element
}

export default function LayoutSecureContent({children} : PropsWithChildren){
    const [session, loading]  = useSession();

    //todo remove this after done development - before pushing to prod

    /*
    //if still loading return null
    if(typeof window !== 'undefined' && loading) return null; 

    //if there is no session show access denied
    if(!session) {
        return <AccessDenied/>;
    }

    */
    //show the content
    return(
        <>
            <Header/>
            <main>
                <div className="wrapper">
                    {children}
                </div>
            </main>
            <Footer />
            
        </>
    );
}