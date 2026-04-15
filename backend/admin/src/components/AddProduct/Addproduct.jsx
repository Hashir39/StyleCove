import "./addproduct.css";
import uploadarea from "../../assets/upload_area.svg";
import { useState } from "react";

const Addproduct = () => {
  const [image, setimage] = useState(null);
  const [productdetails, setproductdetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: "",
  });

  const imageHandler = (e) => {
    setimage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setproductdetails({ ...productdetails, [e.target.name]: e.target.value });
  };

  const Add_product = async () => {
    if (!image) {
      alert("Please select an image");
      return;
    }
    console.log(productdetails);
    let responseData;
    let product = productdetails;

    let formData = new FormData();
    formData.append("product", image);

    await fetch("http://localhost:4000/upload", {
      method: "POST",
      // headers: {
      //   Accept: "application/json",
      // },
      body: formData,
    })
      .then((resp) => resp.json())
      .then((data) => {
        responseData = data;
      });
    if (responseData.success) {
      product.image = responseData.image_url;
      console.log("Product sent to addproduct API:", product);
      await fetch("http://localhost:4000/api/auth/addproduct", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })
        .then((resp) => resp.json())
        .then((data) => {
          data.success ? alert("Added") : alert("Failed");
        });
    }
  };

  return (
    <div className="addproduct">
      <div className="addproduct-item-field">
        <p>PRODUCT TITLE</p>
        <input
          value={productdetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type Here"
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-item-field">
          <p>PRICE</p>
          <input
            value={productdetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder="Type Here"
          />
        </div>
        <div className="addproduct-item-field">
          <p>Offer PRICE</p>
          <input
            type="text"
            value={productdetails.new_price}
            onChange={changeHandler}
            name="new_price"
            placeholder="Type Here"
          />
        </div>
      </div>
      <div className="addproduct-item-field">
        <p>PRODUCT CATEGORY</p>
        <select
          value={productdetails.category}
          onChange={changeHandler}
          name="category"
          className="addproductselector"
        >
          <option value="women">WOMEN</option>
          <option value="men">MEN</option>
          <option value="kid">KID</option>
        </select>
      </div>
      <div className="addproduct-item-field">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : uploadarea}
            className="addproductthumbnail"
            alt=""
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>
      <button
        onClick={() => {
          Add_product();
        }}
        className="addproduct-btn"
      >
        ADD
      </button>
    </div>
  );
};

export default Addproduct;
