
const JobFormTemp = ({ jobInfo , errors , handleInput }) =>{
    
    const { title , full_time , location , description , company, url , company_url } = jobInfo;    

    return(            
            <>     
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

            </>

    )
}
export default JobFormTemp;