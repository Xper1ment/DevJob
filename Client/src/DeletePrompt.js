import { useState , useEffect } from 'react';
import Modal from './Modal';
import useRequireAuth from './useRequireAuth';
import useJobApi from './useJobApi';
import DeleteIcon from '@material-ui/icons/Delete';
import { Redirect } from 'react-router-dom';

const DeletePrompt = ({ whatToDelete , url , myref , showButton = true , styleDelBtn = "", deleteProfile = false }) =>{
    
    const [ canShow , setPromptState ] = useState(false); 
    const [ data ,{ isError }, setUrl ] = useJobApi();
    const [ redirect , setRedirect ] = useState(false);
    const { setLoginState , setAuthorState } = useRequireAuth();

    const showPrompt = () => {
        setPromptState( true );
    };
    
    const hidePrompt = () =>{
        setPromptState( false );
    };
    
    const handleDelete = ()=>{
        setUrl({
            url ,
            requestOptions : {
                method : 'DELETE'
            }
        })
        hidePrompt();
        setRedirect(true);
    }

    useEffect(() => {
        if(deleteProfile && redirect ){
            localStorage.clear();
            setAuthorState(false);
            setLoginState(false);
        }
    }, [ redirect ])

    if(redirect)
        return <Redirect to = "/login"/>

    return(
        <>
        {
            (showButton)? 
                (<button className = { styleDelBtn } 
                         onClick = { showPrompt }>
                         Delete { whatToDelete }
                </button>):
                (<DeleteIcon    
                    style = {{  "color" : "red" }}
                    onClick = { showPrompt }
                />)
        }
        {   
            canShow && 
                <Modal  show = { canShow } 
                        hideModal = { hidePrompt }
                        setModalState = { setPromptState }
                        myref = { myref }>
                    <div className = "delete-prompt">
                        <span>Are you sure you want to delete { whatToDelete } ?</span>
                        <div>
                            <button className = "btn-gnl btn-cancel" onClick = {hidePrompt}>Cancel</button>
                            <button className = "btn-gnl btn-delete"onClick = {handleDelete}>Delete</button>
                        </div>
                    </div>
                </Modal>
        }
        </>
    )
}

export default DeletePrompt;