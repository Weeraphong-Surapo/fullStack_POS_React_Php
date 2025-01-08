import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../../functions/category";

const CreateCategory = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    createCategory(formData)
      .then((res) => {
        navigate('/category')
        Swal.fire({
          title: "บันทึกสำเร็จ",
          text: "",
          icon: "success",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center pb-2">
        <h3>Category</h3>
        <button className="btn btn-primary">เพิ่มข้อมูล</button>
      </div>
      <form action="" onSubmit={handleSubmit}>
        <label htmlFor="">หมวดหมู่</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn btn-primary mt-3" disabled={loading}>บันทึก</button>
      </form>
    </div>
  );
};
export default CreateCategory;
