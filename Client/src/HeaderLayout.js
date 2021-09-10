import Header from './Header';
import { Route } from 'react-router-dom';


const HeaderLayout = ({component : Component , ...rest }) =>{
    return(
            <Route {...rest} render={(props) => (
                <>
                    <Header/>
                    <Component {...props} />
                </>
            )} />
    )
    
}

export default HeaderLayout;