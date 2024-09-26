import { useEffect, useState } from "react";
import './Listproduct.css'
import crossicon from '../../assets/cross_icon.png'
import React from 'react';

const Listproduct = () => {
  const [allproducts, setallproducts] = useState([]);

  const fetchInfo = async () => {
    try {
      const resp = await fetch("http://localhost:4000/api/auth/allproducts");
      const data = await resp.json(); // Correctly parse the JSON response
      setallproducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(()=>{
    fetchInfo()
  },[]) //only execute 1 time
  

  const removeproduct = async (id)=>{
       await fetch('http://localhost:4000/api/auth/removeproduct',{
        method:"POST",
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json"
        },
        body:JSON.stringify({id:id})
       })
       await fetchInfo()
  }


  return (
    <div className="listproduct">
      <h1>ALL PRODUCTS LIST</h1>
      <div className="listproductformatmain">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product)=>{
          return <React.Fragment key={product.id}> <div  className="listproductformatmain listproduct-format">
         <img src={product.image} className="listproduct-product-icon" alt="" />
         <p>{product.name}</p>
         <p>${product.old_price}</p>
         <p>${product.new_price}</p>
         <p>{product.category}</p>
         <img onClick={()=>{removeproduct(product.id)}} className="listproduct-remove-icon" src={crossicon} alt="" />
          </div>
        <hr /> </React.Fragment>
        })}
      </div>
    </div>
  );
};

export default Listproduct;
