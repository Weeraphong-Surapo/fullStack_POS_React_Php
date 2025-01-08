import { useParams } from "react-router-dom";
import { readOrder } from "../../functions/order";
import { useEffect, useState } from "react";

const OneOrder = () => {
  const [order, setOrder] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const loadData = (id) => {
    setLoading(true);
    readOrder(id)
      .then((res) => {
        setOrder(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const formatThaiNumber = (number) => {
    return new Intl.NumberFormat("th-TH").format(number);
  };
  useEffect(() => {
    loadData(id);
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center pb-2">
        <h3>Order Detail : {order?.order_code || "Loading..."}</h3>
      </div>
      <ul>
        <li>การชำระ : {order?.type}</li>
        <li>ผู้ขาย : {order?.userSale?.username}</li>
      </ul>
      <h3>product item</h3>
      {!loading ? (
        <table className="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>name</th>
              <th>price</th>
              <th>amount</th>
              <th>total</th>
            </tr>
          </thead>
          <tbody>
            {order?.products?.length > 0 ? (
              order.products.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{formatThaiNumber(item.price)}</td>
                  <td>{formatThaiNumber(item.amount)}</td>
                  <td>{formatThaiNumber(item.price * item.amount)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
                <td className="text-center" colSpan={5}>Total Price : {formatThaiNumber(order?.total_price)}</td>
            </tr>
          </tfoot>
        </table>
      ) : (
        <>Loading...</>
      )}
    </div>
  );
};
export default OneOrder;
