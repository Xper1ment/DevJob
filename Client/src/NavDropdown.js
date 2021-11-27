import { useState , useEffect } from 'react';
import { Link , useHistory } from 'react-router-dom';

const NavDropdown =({ list , show , setNavMenuState , handleLogout }) =>{

    const history = useHistory();
    const hideNavMenu = () =>{
        setNavMenuState(!show);
    }
    const handleNavLog = () =>{
        hideNavMenu();
        handleLogout();
    }
    useEffect(() => {
        return history.listen(location => {
          if (history.action === 'POP') {
              hideNavMenu();
          }
        })
      }, [])

    if(!show)
        return <></>

    return (
        <div className = 'nav-menu-drop'>
            {list.map((item , idx )=>{
                return (idx === 0)?
                <Link to = {item[0]}>
                    <button onClick = { handleNavLog }>{ item[1]}</button>
                </Link>:
                <Link to = {item[0]}>
                    <button onClick = { hideNavMenu }>{item[1]}</button>
                </Link>
                })
            }
        </div>
    )
}

export default NavDropdown;