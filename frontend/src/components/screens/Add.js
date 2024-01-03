import React,{useEffect, useState} from 'react'
import axios from 'axios';
import Swal from 'sweetalert2'
import RefreshTokenService from './RefreshTokenService';


export default function Add() {

  const [image,setImage]=useState("")
  const [category,setCategory]=useState("Breakfast")
  const [name,setName]=useState("")
  const [description,setDescription]=useState("")
  const accessToken=localStorage.getItem('accessToken')
  const [cat,setCat]=useState([]);

  useEffect(()=>{
    document.title="Food Recipes | Add Recipe"
    async function fetchData(){
      try{
        const res=await axios.get("http://127.0.0.1:8000/api/v1/recipes/categories",{
          headers:{
            Authorization:`Bearer ${accessToken}`,
          }
        });
        setCat(res.data.data)
      } catch(error){
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
    fetchData();
  },[accessToken])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
          const response=await axios.post('http://127.0.0.1:8000/api/v1/recipes/add', {title:name,file:image,description:description,category:category}, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        Swal.fire({
          title: response.data.title,
          text: response.data.message,
          icon: response.data.icon
        });
        setImage("");
        setCategory("");
        setName("")
        setDescription("")

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

  return (
    <section className="main">
            <section className="wrapper">
                <h1 style={{marginTop:100}}>Add Recipe</h1>
                <form action="" method="post" id="recipeForm" encType="multipart/form-data" onSubmit={handleSubmit}>
                    <span className="first_name">
                        <label htmlFor="rname">Recipe name</label>
                        <input id="rname" type="text" placeholder="Recipe name" name="title" value={name} onChange={(e)=>setName(e.target.value)} required />
                    </span>
                    <span className="last_name">
                        <label htmlFor="image">Image</label>
                        <input id="image" type="file"  name="file" accept="image/*" placeholder="choose image"  onChange={(e)=>setImage(e.target.files[0])} />
                    </span>
                    <span className="emailc">
                        <label htmlFor="recipe">Recipe</label>
                        <textarea name="description" id="recipe" cols="54" rows="5" placeholder="Enter recipe here!!!" value={description} onChange={(e)=>setDescription(e.target.value)}  required></textarea>
                    </span>
                    <span className="select">
                        <label htmlFor="cat">Category</label>
                        <select id="cat" value={category} onChange={(e)=>setCategory(e.target.value)} required>
                          {
                            cat.map((item)=>(
                              <option key={item.id} value={item.title}>{item.title}</option>
                            ))
                          }
                        </select>
                    </span>
                    <span className="button">
                        <button type="submit">Add Recipe</button>
                        <a href="http://localhost:3000/recipes/" className="button">Cancel</a>
                    </span>
                </form>
            </section>
        </section>
  )
}
