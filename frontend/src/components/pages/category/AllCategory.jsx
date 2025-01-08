import { useEffect, useState } from "react";
import { deleteCategory, listCategory } from "../../functions/category";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Spinner from "../../layouts/Spinner";
import { Table } from "antd";

const columns = [
  {
    title: "#",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "สินค้า",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "จัดการ",
    dataIndex: "actions",
    key: "actions",
    render: (text, record) => (
      <div className="btn-group">
        <Link to={`/category/${record.id}`} className="btn btn-warning">
          edit
        </Link>
        <button
          className="btn btn-danger"
          onClick={() => deleteData(record.id)}
        >
          del
        </button>
      </div>
    ),
  },
];

const AllCategory = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const [category, setCategorys] = useState([]);
  const loadData = () => {
    setLoading(true);
    listCategory()
      .then((res) => {
        setCategorys(res.data.data);
        const updatedData = res.data.data.map((item) => ({
          ...item,
          key: item.id, // Assigning `key` using `id` or another unique field
        }));
        setDataSource(updatedData);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteData = (id) => {
    setLoading(true);
    deleteCategory(id)
      .then((res) => {
        Swal.fire({
          title: "ลบสำเร็จ",
          text: "",
          icon: "success",
        });
        loadData();
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
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center pb-2">
            <h3>Category</h3>
            <Link to="/category/create" className="btn btn-primary">
              เพิ่มข้อมูล
            </Link>
          </div>
          <Table dataSource={dataSource} columns={columns} />
        </>
      )}
    </div>
  );
};
export default AllCategory;
