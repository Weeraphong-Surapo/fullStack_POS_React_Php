import { useEffect, useState } from "react";
import { deleteProduct, listProduct } from "../../functions/product";
import { Link } from "react-router-dom";
import Spinner from "../../layouts/Spinner";
import { Table } from "antd";
const columns = [
  {
    title: "#",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "รูปภาพ",
    dataIndex: "img",
    key: "img",
    render: (text, record) => (
      <>
        <img
          src={record.img}
          alt=""
          style={{ width: "150px", height: "120px", objectFit: "cover" }}
        />
      </>
    ),
  },
  {
    title: "สินค้า",
    dataIndex: "name",
    key: "name",
  },

  {
    title: "หมวดหมู่",
    dataIndex: "category",
    key: "category",
    render: (text, record) => <>{record.category.name}</>,
  },
  {
    title: "ราคา",
    dataIndex: "price",
    key: "price",
    // render:(text,record)
  },
  {
    title: "ต้นทุน",
    dataIndex: "cost",
    key: "cost",
    // render:(text,record)
  },
  {
    title: "จำนวน",
    dataIndex: "amount",
    key: "amount",
    // render:(text,record)
  },
  {
    title: "ขายแล้ว",
    dataIndex: "sold",
    key: "sold",
    // render:(text,record)
  },
  {
    title: "จัดการ",
    dataIndex: "actions",
    key: "actions",
    render: (text, record) => (
      <div className="btn-group">
        <Link to={`/product/${record.id}`} className="btn btn-warning">
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

const AllProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const loadData = () => {
    setLoading(true);
    listProduct()
      .then((res) => {
        setProducts(res.data.data);
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
    deleteProduct(id)
      .then((res) => {
        loadData();
      })
      .catch((err) => {
        console.log(err);
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
          <div className="d-flex justify-content-between pb-2">
            <h3>Product</h3>
            <Link to="/product/create" className="btn btn-primary">
              เพิ่มข้อมูล
            </Link>
          </div>
          <Table dataSource={dataSource} columns={columns} />;
        </>
      )}
    </div>
  );
};
export default AllProduct;
