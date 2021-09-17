import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useParams
  } from "react-router-dom";
  import axios from "axios";
import './App.css'
import Signup from './Signup'

const App = () => {
  return (
      <div>
      <Router>
    
    <div>
      <h2>Accounts</h2>
      <Switch>
        <Route exact path="/" component={Signup} />
        <Route exact path="/authentication/activate/:id" children={<Child />} />
      </Switch>
    </div>
  </Router>
   
      </div>
  )
}



function Child() {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.
  let { id } = useParams();
  let result = "" 
  let obj = {token: id};
  JSON.stringify(obj);
  axios.post("http://localhost:3000/api/users/email-activate",obj).then((response)=>{
    result = response.data
    
  }).catch((err)=>{
    console.log(err.message)
  });

  // let result = ""
  // if(id == null || undefined) {
  //   result = "invid Link"
  // }
  // else{
  //   result = "verfied successfully please login" 
  // }

  return (
    <div>
      <h3>ID: {id}</h3>
      <h1>{result}</h1>
    </div>
  );
}

export default App