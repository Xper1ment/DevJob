import { useState , useContext } from 'react';
import Results from './Results';
import useJobApi from './useJobApi';

function SearchJobs(){
    const [ query , setQuery ] = useState({
        isFullTime : false,
        title : "",
        location : "",
    });
    const handleInputChange = (e) =>{
        const target = e.target;
        const value = (target.type === 'checkbox')?target.checked:'' + target.value;
        const name = target.name;
        setQuery(prevState => ({
            ...prevState,
            [name] : value 
         }));
    }
    const [  data , { isLoading , isError }, setUrl ] =  useJobApi(
                                                        `/findJobs?title=&full_time=false&location=`
                                                        , false );
    const { title , isFullTime , location } = query;
    return(
        <>
            <div className =  'psearch'>   
                <form className = 'search'
                    onSubmit = 
                    {(event) => 
                            {   
                                event.preventDefault();
                                setUrl({ url : `/findJobs?title=${title}&full_time=${isFullTime}&location=${location}`}); 
                            }
                    }
                >
                    <input  id = 'inptitle'
                            type = 'text'
                            name = 'title' 
                            value = { title } 
                            onChange = { handleInputChange }
                            placeholder = 'Title..'/>

                    <input  id = 'inploc'
                            type = 'text'
                            name = 'location'
                            value = { location } 
                            onChange  = { handleInputChange }
                            placeholder = 'Location..'/>

                    <div id = 'inpjtype' >
                        <div>
                        <span>Full Time</span>
                        <input  name = 'isFullTime'
                                type = 'checkbox' 
                                checked = { isFullTime } 
                                onChange = { handleInputChange }
                        />
                        </div>
                    <input  id = 'btt' 
                            type = 'submit' 
                            value = 'Search'/>  
                    </div>        
                </form>
            </div>
            <div className = 'result'>
                {       
                      (isLoading)?<div> Loading... </div>:
                               (data.length > 0)? 
                                    data.map((obj)=> (
                                        <Results key = {obj.jobId || obj._id} 
                                                id = {obj.jobId || obj._id}
                                                company = {obj.employerName||obj.company} 
                                                date = {obj.date||obj.post_date} 
                                                title = {obj.jobTitle||obj.title} 
                                        />
                                    )):<span>No Jobs Found.</span>
                }
            </div>
        </>
    );

}
export default SearchJobs;