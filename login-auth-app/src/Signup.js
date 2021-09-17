import React from 'react'
import { useState,useEffect} from 'react';
import axios from 'axios';

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [user, setUser] = useState({});

    const submitForm = async (e) => {
        e.preventDefault();
        if(name && email && password) {
            const user = {name:name,email:email,password:password};
            JSON.stringify(user);
            console.log(user);
            // submitForm();
            await axios.post("http://localhost:3000/api/users/app", user).then((res)=>{
                console.log(res);
            })
            }   
        else{
            alert('all fields are required');
        }       
    }


    // useEffect(submitForm)


    return (
        // <div>
        //   <h1>Please Signup here</h1>
        //   <label>name</label><br/>
        //   <input type="text" name="name" placeholder="name" />
        //   <br/>
        //   <label>email</label><br/>          
        //   <input type="email" name="email" placeholder="email" />
        //   <br/>
        //   <label>password</label><br/>
        //   <input type="password" name="password" placeholder="password" />
        //   <br/>
        //   <br/>
        //   <button>Signup</button>  
        // </div>
        <> 
        <form action="post" onSubmit={submitForm}>
            <div>
                <label htmlFor="name">Name</label>  
                    <input type="text" name="name" id="name" autoComplete="off"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                />    
            </div>
            <div>
                <label htmlFor="email">Email</label>  
                    <input type="text" name="email" id="email" autoComplete="off"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                />    
            </div>  

            <div>
                <label htmlFor="password">Password</label>  
                    <input type="password" name="password" id="password" autoComplete="off"
                        value={password}
                          onChange={(e) => setPassword(e.target.value)}
                />    
            </div>   
            <button type="submit">Add</button>        
            </form>
            </>
    )
}

export default Signup