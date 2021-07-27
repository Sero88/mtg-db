import { signIn } from "next-auth/client";

export default function AccessDenied(){
    return(
        <>
            <h1>Access Denied</h1>
            <p>You must be logged in to access this site.</p>
            <button onClick={()=>signIn()}>Sign In</button>
        </>
    );
}