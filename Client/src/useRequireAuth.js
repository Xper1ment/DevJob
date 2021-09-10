import { useState , useEffect } from 'react';


const useRequireAuth = ( ) =>{

    const [ isLoggedIn , setLoginState ] = useState(()=>((localStorage.getItem('token') === null)?false:true));
    const [ isRecruiter , setAuthorState ] = useState(()=>((localStorage.getItem('recruiter') === 'true')?true:false));

    useEffect(() => {
        if(localStorage.getItem('token') !== null)
            setLoginState(true);
        if(localStorage.getItem('recruiter') && 
                localStorage.getItem('recruiter') === 'true' )
            setAuthorState(true);
    }, [ isLoggedIn , isRecruiter])
    

    return { isLoggedIn , isRecruiter , setLoginState , setAuthorState };
}

export default useRequireAuth;