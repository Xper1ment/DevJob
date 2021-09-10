//Job application and edit profile
import { useState ,  useEffect , useContext , useRef } from 'react';
import  useJobApi  from './useJobApi';
import Modal from './Modal';
import useRequireAuth from './useRequireAuth';
import { Redirect } from 'react-router-dom'

const Form = ({ type , data , showForm = false, myref }) => {
         
    const { isLoggedIn , isRecruiter } = useRequireAuth();
    const [ show , setModalState ] = useState(showForm);
    const [ User , { isLoading , isError }, setUrl ] = useJobApi('/api/user');
    const [ userInfo , setUserInfo ] = useState({
        name  : "",
        email : "",
        password : "",
        designation : "",
        skills : new Array(5).fill(" "),
        YOE : 0,
        isRecruiter
    })

    const showModal = () => {
        setModalState( true);
      };
    
    const hideModal = () =>{
        setModalState( false);
        window.location.reload(true);
    };

    useEffect(() => {
        setModalState(showForm);
    }, [showForm])

    useEffect(()=>{
        const { name , email , designation , skills } = User;
        setUserInfo((prevState)=>({
                ...prevState,
                name,
                email,
                designation,
                skills
        }))
        
    },[User.name , User.email , User.designation ])

    useEffect(()=>{
        if(User.message !== undefined){
            hideModal();
            window.location.reload(true);
        }
    },[User.message])

    const handleInputChange = (e) =>{
                const { name , value } = e.target;
                setUserInfo((prevState)=>({
                        ...prevState,
                        [name] : '' + value
                }))
    }
           
    const handleSkillInputChange  = (e , idx ) =>{
                e.preventDefault();
                setUserInfo(prevState => {
                        let list = prevState.skills;
                        list[idx] = '' + e.target.value;                        
                        return {...prevState, skills : list }
                })           
                
    }
    
    const handleRemoveSkills = (e, idx) =>{
                e.preventDefault(); 
                setUserInfo(prevState => {
                        const list = prevState.skills;
                        list[idx] = "";
                        return {...prevState, skills :  list }
                })
    }

    
    
    const { name , email , password , designation , skills , YOE } = userInfo ;    
    
    function profile(){
                const { title , company , location } = data;
                const applyprof = { 
                                    title ,
                                    company,
                                    name , 
                                    email , 
                                    skills  ,
                                    location , 
                                    YOE , 
                                    date_applied : new Date(),
                                }
                return applyprof;
                
    }
    const handleSubmit = (e) =>{
        e.preventDefault();
        const userData = (type === 'APPLY')?profile():userInfo;
        const apiURL = ( type === 'APPLY')?`/api/apply?job_id=${data.id}`:'/api/user';
        const reqMethod = (type === 'APPLY')?'POST':'PUT';
                setUrl({
                        url: apiURL,
                        requestOptions : {
                                method: reqMethod,
                                headers : { 'Content-Type' : 'application/json' },
                                body : JSON.stringify(userData)
                        }
                })      
    }
    
    const inputError = ( val ) =>{
        if(isError){
                return  User.errors.reduce(( ans , err )=>{
                                if( err.param === val )
                                       ans = true;
                                return ans;
                        } ,false)
        }    
        return false;
    }
    const hideForm = ()=>{
            if(User.message)
                hideModal();
    }
    if( isLoading)
        return <div>Loading...</div>
    if( !isLoggedIn )
        return <Redirect to = '/login'/>
        
    return(
        <>{

            show && <Modal show= {show} hideModal = { hideModal } setModalState = { setModalState } myref = {myref} >
                <button className = "mdl-cls-btn" onClick = { hideModal }>x</button>
                <form className = 'form'
                      onSubmit ={(e)=>handleSubmit(e)}>

                        <label>Name:</label>
                        <input  name = 'name'
                                value = {name}
                                onChange = {handleInputChange}
                                style = {(inputError('name'))?{ 'borderColor' : 'red' }:{'borderColor' : 'default'}}
                                />
                        
                        <label>Email:</label>
                        <input  name = 'email'
                                value = {email}
                                onChange = {handleInputChange}
                                style = {(inputError('email'))?{ 'borderColor' : 'red' }:{'borderColor' : 'default'}}
                                />

                        {( type === 'EDIT')?
                        (<>
                                <label> New Password:</label>  
                                <input  name = 'password'
                                        value = {password}
                                        onChange = {handleInputChange}
                                        />
                        </>):""
                        }
                        {(isRecruiter)?        
                                (<>
                                        <label>Designation:</label>
                                        <input  name = 'designation'
                                                value = {designation}
                                                onChange = {handleInputChange}
                                                style = {(inputError('designation'))?{ 'borderColor' : 'red' }:{'borderColor' : 'default'}}  
                                                />
                                </>):
                                (<>     
                                        <label>Skills:</label>
                                                
                                                {(skills)?(skills.map((item,idx) =>
                                                                (<>
                                                                        <input value = {item || " " } onChange = {(e)=> handleSkillInputChange(e , idx)}/>
                                                                        <button id = 'btn' onClick = {(e) => handleRemoveSkills(e, idx)}>x</button>
                                                                </>)
                                                        )):
                                                        (new Array(5).fill(" ").map((item,idx)=>
                                                                (<>
                                                                        <input value = {item || " " } onChange = {(e)=> handleSkillInputChange(e , idx)}/>
                                                                        <button id = 'btn' onClick = {(e) => handleRemoveSkills(e, idx)}>x</button>
                                                                </>)
                                                        ))
                                                        
                                                }         
                                
                                        <label>Year Of Experience</label> 
                                        <input  name = 'YOE'
                                                value = {YOE}
                                                onChange = {handleInputChange}
                                                style = {(inputError('YOE'))?{ 'borderColor' : 'red' }:{'borderColor' : 'default'}}
                                                />
                                </>)                           
                        } 
                        <input id = "submit" type = 'submit'/>
                        {(isError)?<div className = "error">{User.errors[0].msg}</div>:""}
                </form>
            </Modal>    
        }</>)
}
export default Form;