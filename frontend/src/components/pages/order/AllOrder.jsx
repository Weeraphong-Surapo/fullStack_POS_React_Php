import { useEffect, useState } from "react";
import { listOrder } from "../../functions/order";
import { Link } from "react-router-dom";
import { Table } from "antd";

const columns = [
  {
    title: "#",
    dataIndex: "order_code",
    key: "order_code",
  },
  {
    title: "ราคารวม",
    dataIndex: "total_price",
    key: "total_price",
    render: (text, record) => (
        <>
          {new Intl.NumberFormat("th-TH").format(
            record.total_price
          )}
        </>
      ),
  },

  {
    title: "รวมต้นทุน",
    dataIndex: "total_cost",
    key: "total_cost",
    render: (text, record) => (
        <>
          {new Intl.NumberFormat("th-TH").format(
            record.total_cost
          )}
        </>
      ),
  },
  {
    title: "กำไร",
    dataIndex: "total_prefix",
    key: "total_prefix",
    render: (text, record) => (
      <>
        {new Intl.NumberFormat("th-TH").format(
          record.total_price - record.total_cost
        )}
      </>
    ),
  },
  {
    title: "ผู้ขาย",
    dataIndex: "userSale",
    key: "userSale",
    render: (text, record) => <>{record.userSale.username}</>,
  },
  {
    title: "วันที่ขาย",
    dataIndex: "order_date",
    key: "order_date",
    // render:(text,record)
  },
  {
    title: "จัดการ",
    dataIndex: "actions",
    key: "actions",
    render: (text, record) => (
      <div className="btn-group">
        <Link to={`/order/${record.id}`} className="btn btn-primary">
          view
        </Link>
      </div>
    ),
  },
];
const AllOrder = () => {
  const [dataSource, setDataSource] = useState([]);
  const [orders, setOrders] = useState([]);

  const loadData = () => {
    listOrder()
      .then((res) => {
        setOrders(res.data.data);
        const updatedData = res.data.data.map((item, index) => ({
          ...item,
          key: item.id,
        }));
        setDataSource(updatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const formatThaiNumber = (number) => {
    return new Intl.NumberFormat("th-TH").format(number);
  };
  useEffect(() => {
    loadData();
  }, []);
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center pb-2">
        <h3>Order</h3>
      </div>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
};
export default AllOrder;
