import { useContext , useState , useEffect } from 'react' 
import useRequireAuth from './useRequireAuth';
import useJobApi from './useJobApi';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function Header(){
    
    const { isLoggedIn , isRecruiter , setLoginState , setAuthorState } = useRequireAuth();
    
    const handleLogout  = () =>{
        localStorage.clear();
        setLoginState(false);
        setAuthorState(false);
    }

    return(
        <div className = "header-main">
            <div className = 'nav-bar'>
                <span>DevJobs</span>
                <div>
                    {
                        ( isLoggedIn )?
                            (<>
                                <Link to = '/' >
                                    <button onClick = {handleLogout}>SignOut</button>
                                </Link>
                                <Link to = '/profile'>
                                    <button>Profile</button>
                                </Link>
                            </>):(<Link to = '/login'>
                                        <button>SignIn</button>
                                  </Link>)
                        
                    }
                        <Link to = '/recruiter-login'> 
                            <button >Recruiter</button>
                        </Link>     
                        
                        <Link to = '/' > 
                            <button>Search</button>
                        </Link>
                    
                    { isRecruiter && isLoggedIn 
                        &&  <Link to = '/post-job'>
                                <button>Post Job</button>
                            </Link> }
                </div>    
            </div>
        </div>
    )

}

export default Header;