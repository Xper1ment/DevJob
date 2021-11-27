import JobFormTemp from './JobFormTemp';
import { useState , useEffect } from 'react';
import useJobApi from './useJobApi';
import { Redirect } from 'react-router-dom';
import useRequireAuth from './useRequireAuth';

const UpdateJob = (props) =>{

    const [ jobInfo , setJobInfo ] = useState({
        title : "",
        company : "",
        full_time : false,
        location : "",
        description : "",
        url : "",
        company_url : "",
        post_date : new Date(),
    });
    const JOB_ID = props.location.state.jobID;
    
    const { isRecruiter , isLoggedIn } = useRequireAuth();
    const [ jobData , { isLoading , isError } , setUrl ] = useJobApi('');    
    const [ errors , setErrors ] =  useState({});

    const handleInput = (e) =>{
        const target =  e.target;
        const name = target.name;
        const value = (target.type === 'checkbox')?target.checked:"" + target.value;

        setJobInfo(prevState => ({
            ...prevState,
            [name] : value
        }))
    }

    useEffect(()=>{
        const updateJob = async () =>{
            const data = await fetch(`/job-description?id=${JOB_ID}` ,
                                        {
                                            method : 'GET',
                                            headers : {
                                                'authorization' : localStorage.getItem('token')
                                            }
                                        } 
                                    );
            const response = await data.json();
            setJobInfo(response);
            
        }
        updateJob();
    },[])

    useEffect(()=>{
        if(isError){  
            setErrors(jobData.errors.reduce((errorObject , obj)=>{
                    errorObject[obj.param] = obj.msg;
                   return errorObject
            },{}))
        }
    },[isError , jobData.errors ])
    
    if( !isLoggedIn && !isRecruiter )
        return <Redirect to = '/recruiter-login'/>
    if( isError === false)
        return <Redirect to = '/profile'/>
    
    return(
        <form   className = 'post-job-form'
            onSubmit = {
                        e => {
                                console.log(jobInfo);
                                e.preventDefault();
                                setUrl({   
                                    url : `/api/job/recruiter?id=${JOB_ID}`,
                                    requestOptions: {
                                        method : 'PUT',
                                        headers : {'Content-Type' : 'application/json'},
                                        body : JSON.stringify(jobInfo)
                                    }    
                                })
                                setJobInfo({
                                    title : "",
                                    company : "",
                                    full_time : false,
                                    location : "",
                                    description : "",
                                    url : "",
                                    company_url : "",
                                    post_date : new Date(),
                                })
                                setErrors({})
                            }
                        }>
            <JobFormTemp jobInfo = { jobInfo } 
                         handleInput = { handleInput }
                         errors = { errors }/>   
        </form>
    )
}

export default UpdateJob;