import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import RefreshTokenService from './RefreshTokenService';


export default function Recipes() {
  const [categories,setCategories]=useState([])
  const [recipes,setRecipes]=useState([])
  const [favs,setFavs]=useState([])
  const [q,setQ]=useState("")
  const [v,setV]=useState("")
  const [fav,setFav]=useState(false)
  const [user,setUser]=useState("")
  const accessToken = localStorage.getItem('accessToken');
  const [myrecipes,setMyrecipes]=useState([])


  async function handleFavAdd(id){
    try{
      await axios.post(`http://127.0.0.1:8000/api/v1/recipes/add_fav/${id}`,null,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      )

      const resps=await axios.get('http://127.0.0.1:8000/api/v1/recipes/fav', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            });
            setFavs(resps.data.data)
    } catch (error) {
      if (error.response.status === 401) {
        try {
          await RefreshTokenService()
        } catch (refreshError) {
          console.error('Error refreshing access token:', refreshError);
        }
      } else {
        console.error('Error fetching data:', error);
      }
    }
  }

  async function handleFavRemove(id){
    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/recipes/remove_fav/${id}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      )

      const resps=await axios.get('http://127.0.0.1:8000/api/v1/recipes/fav', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            });
            setFavs(resps.data.data)
     } catch (error) {
      if (error.response.status === 401) {
        try {
          await RefreshTokenService()
        } catch (refreshError) {
          console.error('Error refreshing access token:', refreshError);
        }
      } else {
        console.error('Error fetching data:', error);
      }
    }
  }

  const handleClick=(id)=>{
    window.location.href=`http://localhost:3000/recipe_detailed/${id}`;
  }

  const handleRecipe=(item)=>(
    fav?(
      favs.map((itm)=>(
        item.id===itm.recipe && itm.user===user?(
          <li key={item.id}>
              <a href="/" onClick={(e)=>{e.preventDefault();handleClick(item.id);}}>
                  <img src={item.image} alt="img" />
                  <h3>{item.title}</h3>
                  <p>{item.category}</p>
              </a>
              <div>
                  {item.id===itm.recipe && itm.user===user?(
                    <a href="/" className="fav" onClick={(e)=>{e.preventDefault();handleFavRemove(item.id)}} >
                      <h4>Remove from Favorites</h4>
                      <img src={require("../assets/images/heartr.svg").default} alt="fav" />
                    </a>
                  ):(
                    <a href="/" className="fav" onClick={(e)=>{e.preventDefault();handleFavAdd(item.id)}}>
                          <h4>Add to Favorites</h4>
                          <img src={require("../assets/images/heartb.svg").default} alt="fav" />
                      </a>
                  )         
                  }  
              </div>
          </li>
        ):(<div key={uuidv4()}></div>)
      ))
    ):(
      <li key={item.id}>
        <a href="/" onClick={(e)=>{e.preventDefault();handleClick(item.id);}}>
            {item.image?(
              <img src={item.image} alt="img" />
            ):(
              <img src={require("../assets/images/recipe.jpeg")} alt="img" />
            )
            }
            <h3>{item.title}</h3>
            <p>{item.category}</p>
        </a>
        <div>

            {favs.find((itm)=>(
              item.id===itm.recipe && itm.user===user
            ))?
              (
                <a href="/" className="fav" onClick={(e)=>{e.preventDefault();handleFavRemove(item.id)}}>
                    <h4>Remove from Favorites</h4>
                    <img src={require("../assets/images/heartr.svg").default} alt="fav" />
                </a>
              ):(
                <a href="/" className="fav" onClick={(e)=>{e.preventDefault();handleFavAdd(item.id)}}>
                    <h4>Add to Favorites</h4>
                    <img src={require("../assets/images/heartb.svg").default} alt="fav" />
                </a>
              )  
            }  
        </div>
    </li>
    )
  )

  const handleLogout=(e)=>{
    e.preventDefault();
    Swal.fire({
      title: "Do you want to Log Out?",
      showCancelButton: true,
      confirmButtonText: "Log Out",
    }).then((result) => {
      if (result.isConfirmed) {
          Swal.fire({
            title: "Logged out!",
            text: "See you soon....",
            icon: "success"
          }).then(()=>{
            window.location.href="http://localhost:3000";
          });
      }
    });
  }


  useEffect(()=>{
     document.title="Food Recipes | Recipes"
      async function fetchData(){
        try {
          const res=await axios.get('http://127.0.0.1:8000/api/v1/recipes', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params:{
              q:q,
              v:v,
            },
          });

          setRecipes(res.data.data)

          const resp=await axios.get('http://127.0.0.1:8000/api/v1/recipes/categories', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          setCategories(resp.data.data)

          const resps=await axios.get('http://127.0.0.1:8000/api/v1/recipes/fav', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          });
          setFavs(resps.data.data)

          const response=await axios.get('http://127.0.0.1:8000/api/v1/recipes/user', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          });
          setUser(response.data.data)
        } catch (error) {
          if (error.response.status === 401) {
            try {
              await RefreshTokenService()
            } catch (refreshError) {
              console.error('Error refreshing access token:', refreshError);
            }
          } else {
            console.error('Error fetching data:', error);
          }
        }
      };
      fetchData();
  },[q,v,accessToken])

  return (
    <section className="all">
      <section className="wrapper">
          <header>
              <div>
                  <h1><a href="http://localhost:3000/recipes/"><img src={require("../assets/images/logo.png")} alt="logo" /></a></h1>
                  <h1 className="name">Food Recipes</h1>
              </div>
              <div>
                  {myrecipes.length===0?(
                    fav?(
                      <>
                        <a href="/" className="button" onClick={(e)=>{e.preventDefault();setFav(false)}}>Home</a>
                        <a href="/" className="button" onClick={(e)=>handleLogout(e)}>Log Out</a>
                      </>
                    ):(
                        <>
                          <a href="http://localhost:3000/add" className="button">Add Recipes</a>
                          {favs.find((item)=>item.user===user)?(<a href="/" className="button" onClick={(e)=>{e.preventDefault();setFav(true)}}>Favorites</a>):(<></>)}
                          <a href="/" className="button" onClick={(e)=>handleLogout(e)}>Log Out</a>
                        </>
                    )
                  ):(
                    fav?(
                      <>
                        <a href="/" className="button" onClick={(e)=>{e.preventDefault();setFav(false)}}>Home</a>
                        <a href="/" className="button" onClick={(e)=>handleLogout(e)}>Log Out</a>
                      </>
                    ):(
                        <>
                          <a href="/" className="button" onClick={(e)=>{e.preventDefault();setMyrecipes([])}}>Home</a>
                          <a href="http://localhost:3000/add" className="button">Add Recipes</a>
                          {favs.find((item)=>item.user===user)?(<a href="/" className="button" onClick={(e)=>{e.preventDefault();setFav(true)}}>Favorites</a>):(<></>)}
                          <a href="/" className="button" onClick={(e)=>handleLogout(e)}>Log Out</a>
                        </>
                    )
                  )}
              </div>
          </header>
          <section className="list">
              <div className='top'>
                  <h1>Make the food you like</h1>
                  <div>
                      <form action="" method="post">
                          <span>
                              <img src={require("../assets/images/search.svg").default} alt="search" />
                              <input type="search" placeholder="Search Recipe" name="q" value={q} onChange={(e)=>setQ(e.target.value)} />
                          </span>
                          <select name="v" value={v} onChange={(e)=>setV(e.target.value)} >
                              <option value={""}>All</option>
                              {categories.map((item)=>(
                                  <option key={item.id} value={item.title} >{item.title}</option>
                              ))
                              }
                          </select>
                          {
                            recipes.find((itm)=>(
                              itm.user === user
                            ))?(<button onClick={(e)=>{e.preventDefault();setMyrecipes(recipes.filter((item)=>item.user===user))}}>My recipes</button>):(<></>)
                          }
                      </form>
                  </div>
              </div>
              <div className='bottom'>
                  {recipes.length === 0?(<h1>Sorry! Recipe not available now, try another one.</h1>):(
                    <>
                      <ul>
                          {
                            myrecipes.length===0?(
                                recipes.map((item)=>(             
                                  handleRecipe(item)             
                                ))
                            ):(
                              myrecipes.map((item)=>(
                                handleRecipe(item)             
                              ))
                            )
                          }
                      </ul>
                    </>)
                  }
              </div>
          </section>
      </section>
  </section>
  )
}
