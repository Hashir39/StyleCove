import Addproduct from "../../components/AddProduct/Addproduct";
import Listproduct from "../../components/ListProduct/Listproduct";
import Sidebas from "../../components/Sidebar/Sidebas";
import "./admin.css";
import { Routes, Route } from "react-router-dom";

const Admin = () => {
  return (
    <div className="admin">
      <Sidebas />
      <Routes>
        <Route exact path="/addproduct" element={<Addproduct/>} />
        <Route exact path="/listproduct" element={<Listproduct/>} />
      </Routes>
    </div>
  );
};

export default Admin;
