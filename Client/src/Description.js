import { useParams } from 'react-router';
import { useState, seContext , useContext , useRef } from 'react';
import { Link } from 'react-router-dom';
import useRequireAuth  from './useRequireAuth';
import useJobApi from './useJobApi';
import Modal from './Modal';
import Form from './Form';
import useWindowSize from './useWindowSize';

const Description = () =>{
        const { id } = useParams();
        const myref = useRef();
        const { isLoggedIn , isRecruiter } = useRequireAuth();
        const [  RESULT , {  isLoading , isError } , setUrl ] = useJobApi( `/job-description?id=${id}`);
        const [ show , setModalState ] = useState(false);
        const URL = ( isLoggedIn )?`/api/job/isApplied?id=${id}`:"";
        const [{ isApplied }] = useJobApi( URL , true );
        const windowSize = useWindowSize();

        const showModal = () => {
            setModalState( true);
          };
        
        const hideModal = () =>{
            setModalState( false );
        };
        
        const getMarkUp = (html) =>{
                return {__html : html}
        }
        
        const changeKeyName = () =>{
            let keysMap = { 
                jobTitle:'title',
                jobDescription:'description' ,
                employerName:'company',
                jobUrl:'url',
                externalUrl:'company_url', 
                locationName:'location'
               }
            return Object.keys(RESULT).reduce(
                (acc, key) => ({
                  ...acc,
                  ...{ [keysMap[key] || key]: RESULT[key] }
                }),
                {}
              );
            
            return RESULT;
        }
    
        const { title,
                description ,
                company,
                url,
                company_url, 
                location,  
               } = changeKeyName();
        
        return(
        (isLoading)?<div>loading...</div>:
            <div className = 'despar'>
                <div className = 'header'>
                    <h2>{company}</h2>
                    {(company_url)?
                        <a target = '_blank' href = {`https://${company_url}`}>    
                            <button type = 'button'>Company Site</button>
                        </a>:""
                    }     
                </div>
                <div className = 'body'>
                    <div className = 'desp-title-box'>
                        <div className = 'title'>
                            <h1>{title}</h1>
                            {
                                (/[A-Za-z]/.test(id))?
                                        (<>
                                            <Form type = 'APPLY' 
                                                    data = {{ id,
                                                            title ,
                                                            company ,
                                                            location }}
                                                    showForm = { show }
                                                    myref = { myref }/>
                                                
                                            {
                                                (isApplied)?
                                                    (<button style = {{ backgroundColor : "green"}}>Applied Already!</button>):
                                                    (<button onClick = { showModal }>Apply</button>)
                                                        
                                                    
                                            }
                                        </>):
                                    (<>
                                        <a target = '_blank' href = {url}>
                                            <button>Apply at Reed</button>
                                        </a>
                                    </>)
                            }
                        </div>
                    </div>
                    <div className = 'description' 
                         dangerouslySetInnerHTML = {getMarkUp(description)}
                    />
                </div>
            </div>            
        )
}

export default Description;


