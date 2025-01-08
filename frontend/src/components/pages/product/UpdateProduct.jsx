import { useEffect, useState } from "react";
import { listCategory } from "../../functions/category";
import { readProduct, updateProduct } from "../../functions/product";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Spinner from "../../layouts/Spinner";

const UpdateProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const [categorys, setCategorys] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [amount, setAmount] = useState("");
  const [category_id, setCategoryId] = useState("");
  const [img, setImg] = useState("");
  const [oldImg, setOldImg] = useState("");
  const [errors, setErrors] = useState(null);

  const loadCategory = () => {
    listCategory()
      .then((res) => {
        setCategorys(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadData = () => {
    setLoading(true);
    loadCategory();
    readProduct(id)
      .then((res) => {
        setOldImg(res.data.data.img);
        setName(res.data.data.name);
        setPrice(res.data.data.price);
        setCost(res.data.data.cost);
        setAmount(res.data.data.amount);
        setCategoryId(res.data.data.category.id);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSelectCategory = (e) => {
    setCategoryId(e.target.value);
  };

  const handleFile = (e) => {
    setImg(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    setLoading(true);

    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("cost", cost);
    formData.append("amount", amount);
    formData.append("file", img);
    formData.append("category_id", category_id);
    updateProduct(formData, id)
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
      }).finally(()=>{
    setLoading(false);
      })
  };

  useEffect(() => {
    loadData();
  }, []);
  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <>
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
            <label htmlFor="" className="text-center d-block mb-2">
              old img
            </label>
            <div className="d-flex justify-content-center">
              <img
                src={oldImg}
                style={{ width: "120px", height: "140px", objectFit: "cover" }}
                alt=""
              />
            </div>

            <div className="mb-3">
              <label htmlFor="">img</label>
              <input
                type="file"
                className="form-control"
                onChange={handleFile}
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
                type="text"
                className="form-control"
                defaultValue={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="">price</label>
              <input
                type="text"
                className="form-control"
                defaultValue={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="">amount</label>
              <input
                type="text"
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
            <button className="btn btn-primary" disabled={loading}>submit</button>
          </form>
        </>
      )}
    </div>
  );
};
export default UpdateProduct;
