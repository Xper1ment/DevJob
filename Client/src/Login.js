import { useState , useEffect , useContext } from 'react';
import useJobApi  from './useJobApi';
import { Redirect } from 'react-router-dom';

const Login = ( ) => {

    const [ userInfo , setUserInfo ] = useState({
            name : "",
            email : "",
            password : "",
            designation : " ",
            skills : ["","","","",""],
            YOE : 0,
            isRecruiter : false    
    });
    const [ signedUp , setSignUp ] = useState(true);
    //const [ isError , setIsError ] = useState(null);
    

    const handleInput = (e) =>{
                const name =  e.target.name;
                const value = e.target.value;
                setUserInfo( prevState => ({
                    ...prevState,
                    [name] : '' + value
            }))
    }

    const [ userData , { isError } , setUrl ] = useJobApi('', false); 
    
    useEffect(()=>{
        return ()=>{
            if(isError === false){
                localStorage.setItem('token',userData.token);
                localStorage.setItem('recruiter', userData.isRecruiter);
            }
        }
    })

    if( isError === false ){    
        return <Redirect to = '/'/>
    }
    const { name , email , password , designation } = userInfo ;
    return(
            <form   className = "login-form"
                    onSubmit = { e =>{
                                    e.preventDefault();
                                    const apiURL = (signedUp)?'/signIn':'/signUp';
                                    setUrl({url : apiURL ,
                                            requestOptions : {
                                                    method : 'POST',
                                                    headers : { 'Content-Type': 'application/json'},
                                                    body : JSON.stringify(userInfo)     
                                                }
                                            })
                                    }
                                }
            >
            {
                (!signedUp)?(
                    <>
                        <span>Name: </span>
                            <input  name = "name" 
                                    onChange = {handleInput}
                                    value = {name}/>
                    </>):''                    
            }       

                <span>Email: </span>
                    <input  name = "email" 
                            onChange = {handleInput}
                            value = {email} />
                
                <span>Password: </span>
                    <input  name = "password" 
                            onChange = {handleInput}
                            value = {password} />
                
                <input id = 'btn-submit' type = "Submit"/>
            {
                (signedUp)?(
                    <span>
                        Don't have a account?
                        <a  style = {{ color : 'cyan' }}
                            href = '' 
                            onClick = {(e) =>{
                                            e.preventDefault();
                                            setSignUp(false);           
                                        }}
                        >SignUp</a>
                    </span>):(
                            <span>
                                Already have an account?
                                <a  style = {{ color : 'cyan' }}
                                    href = '' 
                                    onClick = {(e) =>{
                                                e.preventDefault();
                                                setSignUp(true);           
                                                }}
                                >Login</a>
                            </span>)
            }
            { 
                (isError === null)?
                    (<span className = 'error'>{ userData.message }</span>):''
            }
            </form>
        )
}

export default Login;