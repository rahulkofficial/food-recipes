import React,{useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'
import RefreshTokenService from './RefreshTokenService';



export default function RecipesDetailed() {

  const { id } = useParams();
  const [recipe,setRecipe]=useState({})
  const [user,setUser]=useState("")
  const accessToken = localStorage.getItem('accessToken');


  useEffect(()=>{
    document.title=`Food Recipes | Recipe:${id}`
    async function fetchData(){
      try {
        const resp=await axios.get(`http://127.0.0.1:8000/api/v1/recipes/details/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setRecipe(resp.data.data)

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
},[accessToken, id])

const handleUpdate=(id)=>{
  Swal.fire({
    title: "Do you want to update this recipe?",
    showCancelButton: true,
    confirmButtonText: "Update",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href=`http://localhost:3000/update/${id}`;
    }
  });
}

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

 const handleDelete=(id)=>{
  Swal.fire({
    title: "Do you want to Delete this recipe?",
    showCancelButton: true,
    confirmButtonText: "Delete",
  }).then((result) => {
    if (result.isConfirmed) {
      try {
        axios.delete(`http://127.0.0.1:8000/api/v1/recipes/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((response)=>{
        Swal.fire({
          title: response.data.title,
          text: response.data.message,
          icon: response.data.icon
        }).then(()=>{
          window.location.href="http://localhost:3000/recipes/";
        });
      });
  } catch (error) {
    if (error.response.status === 401) {
      try {
        RefreshTokenService()
      } catch (refreshError) {
        console.error('Error refreshing access token:', refreshError);
      }
    } else {
      console.error('Error fetching data:', error);
    }
  }
    }
  });
}
  return (
    <section className="all">
            <section className="wrapper">
                <header>
                    <div>
                        <h1><a href="http://localhost:3000/recipes/"><img src={require("../assets/images/logo.png")} alt="logo" /></a></h1>
                        <h1 className="name">Food Recipes</h1>
                    </div>
                    <div>
                        <a href="http://localhost:3000/recipes/" className="button">Home</a>
                        { recipe.user===user?(
                          <>
                            <a href="/" onClick={(e)=>{e.preventDefault();handleUpdate(id);}} className="button">Update Recipe</a>
                            <a href="/" onClick={(e)=>{e.preventDefault();handleDelete(id);}} className="button" id="delete_button">Delete Recipe</a>
                          </>
                        ):(<></>)    
                        }
                        <a href="/" className="button" onClick={(e)=>handleLogout(e)}>Log Out</a>
                        <div>
                          { recipe.user===user?(
                                <p>Your Recipe</p>
                            ):(
                              <p>You can't update or delete because this recipe is not your</p>
                            )
                          }
                        </div>
                    </div>
                </header>
                <section className="details">
                    <div className='top'>
                        <h1>{recipe.title}</h1>
                        <p>{recipe.category}</p>
                    </div>
                    <div className='bottom'>
                        {recipe.image?(
                            <img src={recipe.image} alt="img" />
                          ):(
                            <img src={require("../assets/images/recipe.jpeg")} alt="img" />
                          )
                        }
                        <h2>Recipe</h2>
                        <p>{recipe.description}</p>
                    </div>
                </section>
            </section>
        </section>
  )
}
