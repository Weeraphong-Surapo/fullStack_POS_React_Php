import { useEffect, useState } from "react";
import { listCategory } from "../../functions/category";
import { createProduct } from "../../functions/product";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

listCategory;
const CreateProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [categorys, setCategorys] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [amount, setAmount] = useState("");
  const [category_id, setCategoryId] = useState("");
  const [img, setImg] = useState("");
  const [errors, setErrors] = useState(null);

  const loadData = () => {
    listCategory()
      .then((res) => {
        setCategorys(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSelectCategory = (e) => {
    setCategoryId(e.target.value);
  };

  const handleFile = (e) => {
    setImg(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("cost", cost);
    formData.append("amount", amount);
    formData.append("file", img);
    formData.append("category_id", category_id);
    createProduct(formData)
      .then((res) => {
        if (res.data.statusCode == 400) {
          setErrors(res.data.errors);
          return;
        }
        navigate("/product");
        Swal.fire({
          title: "บันทึกสำเร็จ",
          text: "",
          icon: "success",
        });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);
  return (
    <div>
      <div className="d-flex justify-content-between align-items center">
        <h3>Create Product</h3>
      </div>
      {errors && (
        <div className="alert alert-danger">
          <ul>
            {errors.map((item, index) => (
              <li key={index}>{item.message}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="">img</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFile}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="">name</label>
          <input
            type="text"
            className="form-control"
            defaultValue={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="">cost</label>
          <input
            type="number"
            className="form-control"
            defaultValue={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="">price</label>
          <input
            type="number"
            className="form-control"
            defaultValue={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="">amount</label>
          <input
            type="number"
            className="form-control"
            defaultValue={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="">category</label>
          <select
            className="form-select"
            value={category_id} // Controlled component
            // defa
            onChange={handleSelectCategory}
          >
            <option disabled value="">
              เลือกหมวดหมู่
            </option>
            {categorys.map((item, index) => (
              <option key={index} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" disabled={loading}>
          submit
        </button>
      </form>
    </div>
  );
};
export default CreateProduct;
