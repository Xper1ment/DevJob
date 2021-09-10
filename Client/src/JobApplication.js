import { useEffect , useState , useContext } from 'react';
import useRequireAuth from './useRequireAuth';
import { Redirect } from 'react-dom';
import useJobApi from './useJobApi';

const JobApplication = ( props ) =>{
    const { name , YOE , title , location , skills , company , email , _id } = props.location.state.item;
    const { isLoggedIn , isRecruiter } = useRequireAuth();
    const URL = (isRecruiter)?`/api/apply/setViewStatus?id=${_id}`:"";
    const [ data ] = useJobApi(URL);
    if(localStorage.getItem('token') ===  null){
        return <Redirect to = '/login'/>
    }
     return(
        <div className = 'job-application'>
            <div>
                
                <label>Job Title:</label>
                <span>{title}</span>

                <label>Company : </label>
                <span>{company}</span>

                <label>Location:</label>
                <span>{location}</span>
            
                
                <label>Name:</label>
                <span>{name}</span>
                <label>Email:</label>
                <span>{email}</span>
                <label>Skills:</label>
                <ul>
                {
                    skills.map((item , idx)=>(
                            <li key = {idx} >{item}</li>
                    ))
                }
                </ul>
                
                <label>Year of Experience</label>
                <span>{YOE}</span>
            </div>
        </div>
     )

}

export default JobApplication;