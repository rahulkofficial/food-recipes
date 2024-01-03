import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';


export default function Login({ onLogin }) {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("")
  const [error,setError]=useState("")

  const navigate = useNavigate();

  useEffect(()=>{
    document.title="Food Recipes | Login"
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(email && password){
      setError("");
      try {
        await axios.post('http://127.0.0.1:8000/api/v1/auth/token/', {username:email,password:password}, {
        headers: {
          'Content-Type': 'application/json',
        },
            }).then((response)=>{onLogin(response.data.access,response.data.refresh);
              Swal.fire({
                title: "Good job!",
                text: "Successfully logged in.",
                icon: "success"
              }).then(()=>navigate("recipes/"));
              });
        } catch (error) {
          setError(error.response.data.detail);
        }
    }
    else{
      setError("Please fill both email and password!");
    }
  };

  return (
    <section className="main">
      <section className="wrapper">
          <h1>Log In</h1>
          <form onSubmit={handleSubmit}>
              <span className="emailc">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" placeholder="Email" name="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
              </span>
              <span className="pass">
                  <label htmlFor="password">Password </label>
                  <input id="password" type="password" placeholder="Password" name="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
              </span>
              {
                error?(<p>{error}</p>):(<p></p>)
              }
              <span className="button">
                  <button type="submit">Log In</button>
                  <a href="sign_up" className="button">Sign up</a>
              </span>
          </form>
      </section>
    </section>
  )
}
