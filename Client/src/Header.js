import { useContext , useState , useEffect } from 'react' 
import useRequireAuth from './useRequireAuth';
import useJobApi from './useJobApi';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import MenuIcon from '@material-ui/icons/Menu';
import NavDropdown from './NavDropdown';

function Header(){
    
    const { isLoggedIn , isRecruiter , setLoginState , setAuthorState } = useRequireAuth();
    const [ showNavMenu , setNavMenuState ] = useState(false);
    const NavList = [ ['/','SignOut'],
                      ['/profile','Profile'],
                      ['/login','SignIn'],
                      ['/recruiter-login','Recruiter'],
                      ['/','Search'],
                      ['/post-job','Post']
                    ]
                    
    const handleLogout  = () =>{
        localStorage.clear();
        setLoginState(false);
        setAuthorState(false);
    }
    const handleMenuBtn = (e) =>{
        setNavMenuState(!showNavMenu);
    }
   

    return(
        <div className = "header-main">
            <div className = 'nav-bar'>
                <span>DevJobs</span>
                <MenuIcon id = 'header-menu-icon' onClick = {handleMenuBtn}/>
                {
                    showNavMenu && <NavDropdown list = { NavList } 
                                             show = { showNavMenu } 
                                             setNavMenuState = { setNavMenuState }
                                             handleLogout = { handleLogout }/>
                }
                <div className = 'nav-btns'>
                    <Link to = '/' >
                        <button onClick = {handleLogout}>SignOut</button>
                    </Link>
                    
                    <Link to = '/profile'>
                        <button>Profile</button>
                    </Link>
                    
                    <Link to = '/login'>
                        <button>SignIn</button>
                    </Link>
                    
                    <Link to = '/recruiter-login'> 
                        <button >Recruiter</button>
                    </Link>     

                    <Link to = '/' > 
                        <button>Search</button>
                    </Link>

                    <Link to = '/post-job'>
                        <button>Post Job</button>
                    </Link>    
                    
                    {
                        /*( isLoggedIn )?
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
                    */}
                    
                </div>
            </div>
        </div>
    )

}

export default Header;