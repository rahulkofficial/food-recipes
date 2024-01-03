import React, { useState,useEffect } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';


export default function SignUp({ onLogin }) {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("")
  const [cpassword,setCpassword]=useState("")
  const [first_name,setFirst_name]=useState("")
  const [last_name,setLast_name]=useState("")
  const [error,setError]=useState("")
  const [showp,setShowp]=useState(false)
  const [showc,setShowc]=useState(false)


  useEffect(()=>{
    document.title="Food Recipes | Signup"
  },[])


  const handleSubmit = async (e) => {
    e.preventDefault();
    if(email && password && first_name && last_name && cpassword){
      if(password.length >= 8){
        if(/[A-Z]+/.test(password)){
          if(/[a-z]+/.test(password)){
            if(/[0-9]+/.test(password)){
              if(/[^A-Za-z0-9]+/.test(password)){
                if(password === cpassword){
                  try {
                    await axios.post('http://127.0.0.1:8000/api/v1/auth/create', {email:email,password:password,first_name:first_name,last_name:last_name}, {
                          headers: {
                            'Content-Type': 'application/json',
                          },
                        }).then((response)=>{
                          if(response.data.data.access){
                            onLogin(response.data.data.access,response.data.data.refresh);
                            Swal.fire({
                              title: "Good job!",
                              text: "Successfully registerd.",
                              icon: "success"
                            }).then(()=>window.location.href="http://localhost:3000/recipes/");
                          }
                          else{
                            setError(response.data.data);
                          }
                        });
                    } catch (error) {
                      console.log(error);
                    }
                }
                else{
                  setError("Password is not match with confirm password!");
                }
              }
              else{
                setError("Password must contain atleast one special characters!");
              }
            }
            else{
              setError("Password must contain atleast one digit!");
            }
          }
          else{
            setError("Password must contain lowercase letters!");
          }
        }
        else{
          setError("Password must contain uppercase letters!");
        }
      }
      else{
        setError("Password must contain atleast 8 characters!");
      }
    }
    else{
      setError("Please fill all the fields!");
    }
  };

  return (
    <section className="main">
      <section className="wrapper">
          <h1 style={{marginTop:100}}>Sign Up</h1>
          <form onSubmit={handleSubmit}>
              <span className="first_name">
                  <label htmlFor="first_name">First name</label>
                  <input id="first_name" type="text" placeholder="First name" name="first_name" value={first_name} onChange={(e)=>setFirst_name(e.target.value)} required/>
              </span>
              <span className="last_name">
                  <label htmlFor="last_name">Last name</label>
                  <input id="last_name" type="text" placeholder="Last name" name="last_name" value={last_name} onChange={(e)=>setLast_name(e.target.value)} required/>
              </span>
              <span className="emailc">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" placeholder="Email" name="email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
              </span>
              <span className="spass">
                  <label htmlFor="password">Password </label>
                  <input id="password" type={showp?"text":"password"} placeholder="Password" name="password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                  {
                   showp?(<img title='hide' src={require("../assets/images/hide.svg").default} alt='hide' onClick={()=>setShowp(!showp)} />):(<img title='show' src={require("../assets/images/show.svg").default} alt='show' onClick={()=>setShowp(!showp)} />)
                  } 
              </span>
              <span className="spass">
                  <label htmlFor="cpassword">Confirm </label>
                  <input id="cpassword" type={showc?"text":"password"} placeholder="Confirm" name="password" value={cpassword} onChange={(e)=>setCpassword(e.target.value)} required/>
                  {
                  showc?(<img title='hide' src={require("../assets/images/hide.svg").default} alt='hide' onClick={()=>setShowc(!showc)} />):(<img title='show' src={require("../assets/images/show.svg").default} alt='show' onClick={()=>setShowc(!showc)} />)
                  } 
              </span>
              {
                error?(<p>{error}</p>):(<p></p>)
              }
              <span className="button">
                  <button type="submit">Sign Up</button>
                  <a href="/" className="button">Log In</a>
              </span>
          </form>
      </section>
    </section>
  )
}
