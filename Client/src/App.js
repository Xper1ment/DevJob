import { 
  BrowserRouter as Router ,
  Route,
  Switch
} from 'react-router-dom';

import Header from './Header';
import SearchJobs from './SearchJobs';
import Description from './Description';
import Login from './Login';
import RecruiterLogin from './RecruiterLogin';
import Profile from './Profile';
import PostJob from './PostJob';
import Form from './Form';
import JobApplication from './JobApplication';
import ApplicantList from './ApplicantList';
import HeaderLayout from './HeaderLayout';

function App(){
  //fsdffs  
  return(
    <Router>
      <Switch>
        <Route path = '/login' component = {Login}/>
        <Route path = '/recruiter-login' component = { RecruiterLogin }/>
        <HeaderLayout exact path = '/' component = {SearchJobs}/>
        <HeaderLayout path = '/profile' component = {Profile}/>
        <HeaderLayout path = '/form' component = {Form}/>
        <HeaderLayout path = '/applicants/:id' component = {ApplicantList}/>
        <HeaderLayout path = '/application' component = {JobApplication}/>
        <HeaderLayout path = '/post-job/' component = {PostJob}/>
            <HeaderLayout path = "/description/:id" component = {Description}/> 
      </Switch>
    </Router>
  );
}

export default App;
