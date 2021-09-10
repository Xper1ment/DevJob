import CustomLink from './CustomLink' 

function Results({ id, company, date, title }){

    /*const [ bookmarkJob , setBookmark ] = useState(isBookmared);
    localStorage.setItem()*/   
    
    const get_Time = (date) =>{
            let now = new Date();
            let postingDay = new Date(date);
            let newDate = date.split('/'); 
            if(date !== newDate[0]){
                let [d,m,y] = newDate;
                postingDay = new Date(m+'/'+d+'/'+y);
            } 
            let Year =  now.getFullYear() - postingDay.getFullYear() ;
            let Month = now.getMonth() -  postingDay.getMonth();
            let Day =   now.getDate() -  postingDay.getDate();
            let Week =  Math.floor(Day/7);
            let Hour = now.getHours() - postingDay.getHours();

            if(Year > 0) return "" + Year  + "y ago";
            else if( Month > 0 ) return "" + Month + "mo ago";
            else if(  Week > 0 ) return "" + Week + "w ago";
            else if( Day > 0 ) return "" + Day + "d ago";
            else return "" + Hour + "h ago";
             
    }

    return (
        <CustomLink tag ='div' to = {`/description/${id}`}>
                <h2>{title}</h2>
                <h3>{company}</h3>
                <h3>{get_Time(date)}</h3>
        </CustomLink>
    )

}

export default Results;