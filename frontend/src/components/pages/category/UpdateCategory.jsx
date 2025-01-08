import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { readCategory, update } from "../../functions/category";
import Spinner from "../../layouts/Spinner";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


const UpdateCategory = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const [category, setCategory] = useState({
    id: "",
    name: "",
  });
  const { id } = useParams();
  const loadData = (id) => {
    setLoading(true);
    readCategory(id)
      .then((res) => {
        setCategory(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", category.name);
    update(id, formData)
      .then((res) => {
        navigate("/category");
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

  useEffect(() => {
    loadData(id);
  }, []);

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center pb-2">
            <h3>Edit Category</h3>
          </div>
          <form action="" onSubmit={handleUpdate}>
            <label htmlFor="">หมวดหมู่</label>
            <input
              type="text"
              className="form-control"
              defaultValue={category.name}
              onChange={(e) =>
                setCategory((prevState) => ({
                  ...prevState,
                  name: e.target.value,
                }))
              }
            />
            <button className="btn btn-primary mt-3" disabled={loading}>
              บันทึก
            </button>
          </form>
        </>
      )}
    </div>
  );
};
export default UpdateCategory;
