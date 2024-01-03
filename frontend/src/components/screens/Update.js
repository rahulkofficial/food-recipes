import React,{useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'
import RefreshTokenService from './RefreshTokenService';



export default function Update() {

  const [image,setImage]=useState("");
  const [category,setCategory]=useState("")
  const [name,setName]=useState("")
  const [description,setDescription]=useState("")
  const [imn,setImn]=useState([])
  const accessToken=localStorage.getItem('accessToken')
  const { id } = useParams();
  const [recipe,setRecipe]=useState({})
  const [cat,setCat]=useState([]);



  useEffect(()=>{
    document.title=`Food Recipes | Update Recipe:${id}`
    async function fetchData(){
      try {

        const resp=await axios.get(`http://127.0.0.1:8000/api/v1/recipes/details/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const res=await axios.get("http://127.0.0.1:8000/api/v1/recipes/categories",{
          headers:{
            Authorization:`Bearer ${accessToken}`,
          }
        });
        
        setCat(res.data.data)
        setRecipe(resp.data.data)
        setName(resp.data.data.title)
        setDescription(resp.data.data.description)
        setCategory(resp.data.data.category)
        resp.data.data.image?setImn(resp.data.data.image.split('/')):setImn([]);

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


const handleSubmit = async (e) => {
  e.preventDefault();
  try {
        const response=await axios.put(`http://127.0.0.1:8000/api/v1/recipes/update/${id}`, {file:image,title:name,category:category,description:description}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      Swal.fire({
        title: response.data.title,
        text: response.data.message,
        icon: response.data.icon
      }).then(()=>{
        window.location.href=`http://localhost:3000/recipe_detailed/${id}`;
      });
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
            <h1 style={{marginTop:100}}>Update Recipe</h1>
            <form className="update" encType="multipart/form-data" onSubmit={handleSubmit}>
                <span className="first_name">
                    <label htmlFor="rname">Recipe name</label>
                    <input id="rname" type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Recipe name" name="title" required />
                </span>
                {recipe.image != null?(
                  <span>
                      <label htmlFor="imagec">Current Image</label>
                          <a href={recipe.image} target='blank'>{imn[imn.length-1]}</a>
                  </span>
                ):(
                  <span>
                        <label htmlFor="imagec">Current Image</label>
                        <p>NO image</p>
                    </span>
                  )
                }
                <span className="last_name">
                    <label htmlFor="image">Image</label>
                    <input id="image" type="file"  name="file" accept="image/*" onChange={(e)=>setImage(e.target.files[0])} />
                </span>
                <span className="emailc">
                    <label htmlFor="recipe">Recipe</label>
                    <textarea name="description" id="recipe" cols="54" rows="5" value={description} onChange={(e)=>setDescription(e.target.value)} required>{recipe.description}</textarea>
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
                    <button type="submit">Update Recipe</button>
                    <a href={`http://localhost:3000/recipe_detailed/${id}`} className="button">Cancel</a>
                </span>
            </form>
        </section>
    </section>
  )
}
