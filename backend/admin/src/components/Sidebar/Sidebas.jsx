import "./sidebar.css";
import { Link } from "react-router-dom";
import add_product  from '../../assets/Product_Cart.svg'
import list_product from '../../assets/Product_list_icon.svg'

const Sidebas = () => {
  return (
    <div className="sidebar">
      <Link to={"/addproduct"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
            <img src={add_product} alt="" />
            <p>ADD PRODUCT</p>
        </div>
      </Link>
      <Link to={"/listproduct"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
            <img src={list_product} alt="" />
            <p>PRODUCT LIST</p>
        </div>
      </Link>
    </div>
  );
};

export default Sidebas;
