import { useEffect , useState , useContext , useRef } from 'react';
import JobApplication from './JobApplication';
import { Link , Redirect } from 'react-router-dom';
import { useParams } from 'react-router';
import useRequireAuth from './useRequireAuth';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import DeletePrompt from './DeletePrompt';
import useJobApi from './useJobApi';
import Modal from './Modal';
import DeleteIcon from '@material-ui/icons/Delete';
import useWindowSize from './useWindowSize';
import CustomLink from './CustomLink';

const ApplicantList = (props) =>{
    
    const myref = useRef();
    const { isLoggedIn , isRecruiter } = useRequireAuth();
    const { id : JOB_ID } = useParams(); 
    const [ List , setListState ] = useState( props.application_list || [] );
    const [ isLoading , setIsLoading ] = useState(false);
    const [ isError , setIsError ] = useState(false);
    const [ canShow , setPromptState ] = useState(false); 
    const [ data ,{ }, setUrl ] = useJobApi();
    const windowSize = useWindowSize();
    const showPrompt = () => {
        setPromptState( true );
    };
    
    const hidePrompt = () =>{
        setPromptState( false );
    };
    
    const handleDeleteListItem = (id)=>{
        const url = `/api/apply?id=${id}`;
        setUrl({
            url ,
            requestOptions : {
                method : 'DELETE'
            }
        })
        setListState((prevState)=>{
            return [...prevState].filter((itm)=>{
                    if(itm._id !== id)
                        return itm
            })
        })

        hidePrompt();
    }
    
    useEffect(()=>{
        async function getList(){
                    setIsLoading(true); 
                    try{
                        const requestOptions = {};    
                        requestOptions.headers = new Headers({ 'Authorization' : localStorage.getItem('token')});
                        const response = await fetch(`/api/job/applicants?id=${JOB_ID}` , requestOptions )
                        const result = await response.json();
                        if( response.status !== 200  )
                            throw new Error();

                        setListState(result.applicants);
                    }catch(e){
                        setIsError(true);
                    }
                    setIsLoading(false);
            }
        if( JOB_ID !== undefined ) getList() ;
    },[JOB_ID])




    if(!isLoggedIn)
        return <Redirect to = '/login'/>

    if(isError){
        return <div>Error occured.</div>;
    }
    
    if(isLoading){
        return <div>Loading...</div>;
    }
    if( JOB_ID !== undefined && List.length === 0)
        return <div>No applicants</div>;

    if( List.length === 0 ){
        return <div>Not applied to any jobs.</div>
    }

    return(
        <div className = 'profile-recruiter'>
            <label id = 'label-job-list'>Job Applications:</label>
            <div>
                {
                    List.map((item)=>
                        (
                            (windowSize.width > 500)?
                                <div>
                                    {(!isRecruiter)?
                                        (<>
                                            <span>{item.title}</span>
                                            <span>{item.location}</span>
                                        </>):(<>
                                                <span>{item.name}</span>
                                                <span>{item.date_applied}</span>
                                            </>)
                                    }
                                    <>
                                        <DeleteIcon    
                                            style = {{  "color" : "red" }}
                                            onClick = { showPrompt }
                                        />

                                        <span>{ item.isViewed }</span>
                                        <Link to = {{   pathname : "/application" ,
                                                        state : {item} 
                                                    }}
                                            >
                                            <KeyboardArrowRightIcon
                                                style = {{ color : 'cyan' }}
                                            />
                                        </Link>

                                    </>
                                    {   
                                        canShow && 
                                            <Modal  show = { canShow } 
                                                    hideModal = { hidePrompt }
                                                    setModalState = { setPromptState }
                                                    myref = { myref }>
                                                <div className = "delete-prompt">
                                                    <span>Are you sure you want to delete this?</span>
                                                    <div>
                                                        <button className = "btn-gnl btn-cancel" onClick = {hidePrompt}>Cancel</button>
                                                        <button className = "btn-gnl btn-delete" onClick = {() =>handleDeleteListItem(item._id)}>Delete</button>
                                                    </div>
                                                </div>
                                            </Modal>
                                    }
                                </div>:
                                <CustomLink tag = 'div'
                                            to = {{   pathname : "/application" ,
                                                        state : {item} 
                                                 }}>

                                    {(!isRecruiter)?
                                        (<>
                                            <span>{item.title}</span>
                                            <span>{item.location}</span>
                                        </>):(<>
                                                <span>{item.name}</span>
                                                <span>{item.date_applied}</span>
                                            </>)
                                    }
                                    <span>{ item.isViewed }</span>            
                                </CustomLink>
                        )
                    )
                }
            </div>
        </div>
    )

}
export default ApplicantList;