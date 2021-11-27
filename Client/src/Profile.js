import { useState, useEffect , useContext , useRef } from 'react';
import useJobApi from './useJobApi';
import useRequireAuth  from './useRequireAuth';
import { Link , Redirect } from 'react-router-dom';
import ApplicantList from './ApplicantList';
import Modal from './Modal';
import DeleteIcon from '@material-ui/icons/Delete';
import Form from './Form';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import ListIcon from '@material-ui/icons/List';
import DeletePrompt from './DeletePrompt';
import CustomLink from './CustomLink';
import useWindowSize from './useWindowSize';

function Profile(){

    const [ userData , { isLoading , isDeleted } , setUrl] = useJobApi('/api/user');
    const { isLoggedIn , isRecruiter , setLoginState , setAuthorState } = useRequireAuth();
    const { name , email , designation , skills , YOE , job_list , application_list } = userData;
    const [ show , setModalState ] = useState(false);
    const [ jobList , setJobListState ] = useState([]); 
    const [ canShowDelPrompt , setDelPromptState ] = useState(false); 
    const [data , { } ,setUrlToDelete ] = useJobApi(''); 
    const myref = useRef();
    const windowSize = useWindowSize();

    const showModal = () => {
        setModalState( true );
        };
    
    const hideModal = () =>{
        setModalState( false );
    };
    
    const showDelPrompt = () => {
        setDelPromptState( true );
    };
    
    const hideDelPrompt = () =>{
        setDelPromptState( false );
    };
  
    const get_Time = (date) =>{
        let postDate= new Date(date); 
        return `${postDate.getDate()}.${postDate.getMonth()}.${postDate.getFullYear()}` 
    }

    const handleDeleteListItem = (id)=>{
        const url = `/api/job/recruiter?job_id=${id}`;
        setUrlToDelete({
            url ,
            requestOptions : {
                method : 'DELETE'
            }
        })
        setJobListState((prevState)=>{
            return [...prevState].filter((itm)=>{
                    if(itm._id !== id)
                        return itm
            })
        })

        hideDelPrompt();
    }

    useEffect(()=>{
        setJobListState(userData.job_list);
    },[userData.job_list])

    if(!isLoggedIn){
        return <Redirect to = '/login'/>
    }
    if(isDeleted){
        localStorage.clear();
        return <Redirect to = '/'/>
    }
    if( isLoading ){
        return <div className = 'loader'>loading...</div>
    }

    return(
        <>
                <div className = "profile-header">
                    <h2 id = "profile-title">Profile</h2>
                    
                <EditIcon onClick = {showModal}
                            className = 'prof-edit-btn'/>
                
                    
                </div>           

                <Form  type = 'EDIT' 
                       data = {null}
                       myref = {myref}
                       showForm = {show}/>
                
                <hr/>
                <div className = "profile-body">
                    <label>Name:</label>
                    <span>{name}</span>
                    
                    <label>Email:</label>
                    <span>{email}</span>
                    {(isRecruiter)?
                        
                        (<>
                            <label>Designation:</label>
                            <span>{designation}</span>
                        </>):
                        
                        (<>
                            <label>Skills:</label>
                                <div>
                                    {
                                        skills && skills.map((item)=>{
                                            if(item !== ""){
                                            return <li>{item}</li>
                                            }
                                        })
                                    }
                                </div>
                            <label>Year Of Experience:</label>
                            <span>{YOE}</span>
                        </>)
                    }
                </div>
                
                    {
                        (isRecruiter)?
                            (   (jobList.length !== 0 )?
                                    (<div className = 'profile-recruiter'>
                                        <label id = "label-job-list" >Posted jobs by you : </label>
                                        <div>
                                            {   
                                                jobList.map((job) =>
                                                            {  return (windowSize.width > 500)?
                                                                <div>
                                                                    <span>{job.title}</span>
                                                                    <span>{job.location}</span>
                                                                    <span>{get_Time(job.post_date)}</span>
                                                                    {(canShowDelPrompt) &&   
                                                                                    <Modal  show = { canShowDelPrompt } 
                                                                                            hideModal = { hideDelPrompt }
                                                                                            setModalState = { setDelPromptState }
                                                                                            myref = { myref }>
                                                                                        <div className = "delete-prompt">
                                                                                            <span>Are you sure you want to delete this post?</span>
                                                                                            <div>
                                                                                                <button className = "btn-gnl btn-cancel" 
                                                                                                        onClick = { hideDelPrompt }>
                                                                                                    Cancel
                                                                                                </button>
                                                                                                <button className = "btn-gnl btn-delete" 
                                                                                                        onClick = {() =>handleDeleteListItem(job._id)}>
                                                                                                    Delete
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </Modal>
                                                                    }
                                                                    <div id = 'icon-box'>
                                                                        <DeleteIcon    
                                                                            style = {{  "color" : "red" }}
                                                                            onClick = { showDelPrompt }
                                                                        />
                                                                        <Link to = {`/applicants/${job._id}`}>
                                                                                <ListIcon style ={{ color : 'cyan' }}/>
                                                                        </Link>
                                                                        <Link to = {{
                                                                                    pathname:'/update-job',
                                                                                    state:{
                                                                                        jobID : job._id
                                                                                    }
                                                                                }}>
                                                                                    <EditIcon style = {{ color : 'cyan',
                                                                                                        fontSize : '17px'}}/>
                                                                        </Link>
                                                                    
                                                                        <Link to = {`/description/${job._id}`}>
                                                                            <KeyboardArrowRightIcon style ={{ color : 'cyan'}}/>
                                                                        </Link>
                                                                    </div>

                                                                </div>:
                                                                <CustomLink tag = 'div' to = {`/applicants/${job._id}`}>
                                                                    <>
                                                                        <span>{job.title}</span>
                                                                        <span>{job.location}</span>
                                                                        <span>{get_Time(job.post_date)}</span>                                                                    
                                                                    </>
                                                                </CustomLink>
                                                            }
                                                        )
                                            }
                                        </div>            
                                    </div>):(<div>No jobs posted by you.</div>)
                                
                            ):(<>
                                        {
                                            <ApplicantList application_list = {application_list} />
                                        }       
                                    </>)            
                    }
                        <DeletePrompt   whatToDelete = "your Profile" 
                                        url = "/api/user"
                                        myref = { myref }
                                        styleDelBtn = "btn-del-profile"
                                        deleteProfile = { true }
                        />
                 
        </>
    )
}

export default Profile;