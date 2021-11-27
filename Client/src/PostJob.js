import { useState , useEffect } from 'react';
import useJobApi from './useJobApi';
import { Redirect } from 'react-router-dom';
import useRequireAuth from './useRequireAuth';


function PostJob(props){
    const [ jobInfo , setJobInfo] = useState({
        title : "",
        company : "",
        full_time : false,
        location : "",
        description : "",
        url : "",
        company_url : "",
        post_date : new Date(),
    });

    const { isRecruiter , isLoggedIn } = useRequireAuth(); 

    const DEFAULT_PROPS = { httpMethodType : 'POST', jobID : null };
    
    const { httpMethodType , jobID } = (props.location.state === undefined)?DEFAULT_PROPS:props.location.state;
    
    const DEFAULT_URL = (httpMethodType === 'PUT')?`/job-description?id=${jobID}`:'';
   
    const { title , full_time , location , description , company, url , company_url } = jobInfo ;

    const [ jobData , { isLoading , isError } , setUrl ] = useJobApi(DEFAULT_URL);

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
        if(isError){  
            setErrors(jobData.errors.reduce((errorObject , obj)=>{
                    errorObject[obj.param] = obj.msg;
                   return errorObject
            },{}))
        }
    },[isError , jobData.errors ])

    useEffect(()=>{
            let isMounted = true;
            if( Object.keys(jobData).length !== 0 && isMounted ){
               setJobInfo(jobData);
            }
            return () =>{ isMounted = false }
    }
    ,[ jobData ])

    if( !isLoggedIn && !isRecruiter )
        return <Redirect to = '/recuiter-login'/>
    if( isError === false )
        return <Redirect to = '/profile'/>

    return(
        <form   className = 'post-job-form'
                onSubmit = {
                            e => {
                                    console.log(jobInfo);
                                    e.preventDefault();
                                    setUrl({   
                                        url : (httpMethodType === 'PUT')?`/api/job/recruiter?id=${jobID}`:'/api/job/recruiter',
                                        requestOptions: {
                                            method : httpMethodType,
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
            
                
                <span>Job Title: </span>
                <input  value = {title}
                        type = 'text'
                        onChange = {handleInput}
                        name = 'title'
                        style = {( 'title' in errors )?{ 'borderColor' : 'red' }:{}}/>
                <span id = "post-job-error">{errors.title||""}</span>        
                            
            
                <span>Company Name: </span>
                <input  value = {company}
                        type = 'text' 
                        onChange = {handleInput}
                        name = 'company'
                        style = {( 'company' in errors )?{ 'borderColor' : 'red' }:{}}/>
                <span id = "post-job-error">{errors.company||""}</span>
            
                <span>Company URL: </span>
                <input  value = {company_url}
                        type = 'text'
                        onChange = {handleInput}
                        name = 'company_url'
                        style = {( 'company_url' in errors )?{ 'borderColor' : 'red' }:{}}/>    
                <span id = "post-job-error">{errors.company_url||""}</span>            

            
                <span>URL: </span>
                <input  value = {url}
                        type = 'text'
                        onChange = {handleInput}
                        name = 'url'
                        style = {( 'url' in errors )?{ 'borderColor' : 'red' }:{}}/>    
                <span id = "post-job-error">{errors.url||""}</span>

            
                <span>Full Time: </span>
                <input  onChange = {handleInput}
                        type = 'checkbox'
                        name = 'full_time'
                        checked = {full_time}/>
            

               
                <span>Location: </span>
                <input  value = {location}
                        type = 'text'
                        onChange = {handleInput}
                        name = 'location'
                        style = {( 'location' in errors )?{ 'borderColor' : 'red' }:{}}/>
                <span id = "post-job-error">{errors.location||""}</span>

               
                <span id = 'row-desc-label' >Job Description: </span>
                <textarea   value = {description} 
                            onChange = {handleInput}
                            id = 'row-textarea'
                            name = 'description'/>
            
    
            <input id = 'btn-submit' type = 'submit'/>


        </form>

    )

}

export default PostJob;
