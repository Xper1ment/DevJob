import { useState , useEffect , useContext } from 'react'; 
 

const useJobApi = ( defaultUrl = '' , defaultToken = true , defaultReqOpt = {}) =>{
    
    const [ url_op , setUrl ] = useState({ url : defaultUrl , requestOptions : {}});
    const [ data , setData] = useState({}); 
    const [ isError, setIsError] = useState(null);
    const [ isLoading , setIsLoading ] = useState(false); 
    const [ isToken , setIsToken ] = useState(defaultToken); 
    const [ isDeleted, setIsDeleted ] = useState(false);

    useEffect(()=>{
        const handleRequest = async (urlReq) => {
            const { url , requestOptions } = urlReq;  
            setIsLoading(true);
            if(url !== ''){
                try{
                        if(localStorage.getItem('token') !== null && isToken ){
                            const myheader = new Headers();
                            myheader.append('authorization' , localStorage.getItem('token'));
                            if(requestOptions.method !== 'GET')
                                myheader.append('Content-Type','application/json');
                            requestOptions.headers = myheader; 
                        }
                        console.log( url , requestOptions);
                        const response = await fetch(url , requestOptions);
                        const json = await response.json();
                        setData(json);

                        switch(response.status){
                            case 200:
                                (requestOptions.method === 'DELETE')?setIsDeleted(true):setIsError(false);
                                break;
                            case 422:
                                setIsError(true)
                                break;
                        }

                    }catch(err){
                        setIsError(true);
                    }
                setIsLoading(false);
            }
        }
        handleRequest(url_op);
    }
    ,[url_op.url , url_op.requestOptions , url_op])

    return [ data ,{ isLoading , isError , isDeleted }, setUrl];
}

export default useJobApi;