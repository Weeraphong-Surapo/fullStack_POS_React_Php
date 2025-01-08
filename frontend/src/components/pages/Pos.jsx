import { useEffect, useState } from "react";
import { listProduct } from "../functions/product";
import { checkOut } from "../functions/order";
import Swal from "sweetalert2";
import Spinner from "../layouts/Spinner";

const Pos = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [type, setType] = useState("");
  const [carts, setCarts] = useState(() => {
    const storedCart = localStorage.getItem("carts");
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const loadData = () => {
    setLoading(true);
    listProduct()
      .then((res) => {
        setProducts(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const addToCart = (item) => {
    const existingCart = [...carts]; // Clone the current cart state
    const index = existingCart.findIndex((cartItem) => cartItem.id === item.id);

    if (index !== -1) {
      if (item.amount <= existingCart[index].quantity) {
        return;
      }

      // If the item exists, update its quantity
      existingCart[index].quantity += 1;
    } else {
      // If the item doesn't exist, add it to the cart
      item["quantity"] = 1;
      existingCart.push(item);
    }

    // Update the state and localStorage
    setCarts(existingCart);
    localStorage.setItem("carts", JSON.stringify(existingCart));
  };

  const totalPrice = () => {
    return carts.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const deleteCartItem = (item) => {
    const updatedCart = carts.filter((cartItem) => cartItem.id !== item.id);

    setCarts(updatedCart);
    localStorage.setItem("carts", JSON.stringify(updatedCart));
  };

  const checkOutOrder = () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("order", JSON.stringify(carts));
    formData.append("type", type);
    formData.append("user_id", 1);
    checkOut(formData)
      .then((res) => {
        setCarts([]);
        localStorage.removeItem("carts");
        setType("");
        Swal.fire({
          title: "บันทึกการขายสำเร็จ",
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

  const formatThaiNumber = (number) => {
    return new Intl.NumberFormat("th-TH").format(number);
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
          <div className="row">
            <div className="col-md-8">
              <div className="row">
                {products.map((item, index) => (
                  <div
                    className="col-md-4 col-lg-3 mb-3"
                    key={index}
                    onClick={() => addToCart(item)}
                  >
                    <div className="card border-0 shadow-lg h-100">
                      <div className="card-body">
                        <img
                          src={item.img}
                          style={{
                            width: "100%",
                            height: "130px",
                            objectFit: "cover",
                          }}
                          alt=""
                        />
                        <h5 className="text-center mt-3">{item.name}</h5>
                        <p className="text-muted text-center">
                          {formatThaiNumber(item.price)} บาท
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-4">
              <table className="table">
                <thead>
                  <tr>
                    <th>name</th>
                    <th>qty</th>
                    <th>total</th>
                    <th>del</th>
                  </tr>
                </thead>
                <tbody>
                  {carts.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{formatThaiNumber(item.price * item.quantity)}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteCartItem(item)}
                        >
                          del
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                className="btn btn-success w-100"
                onClick={() => setType("CASH")}
                disabled={carts.length < 1}
              >
                CASH
              </button>
              <button
                className="btn btn-outline-secondary w-100 mt-2"
                onClick={() => setType("QR CODE")}
                disabled={carts.length < 1}
              >
                QR CODE
              </button>

              {type ? (
                <div className="col-12">
                  <hr />
                  <h4>รายะเอียด</h4>
                  <ul className="list-unstyled">
                    <li>
                      <h5 className="alert alert-info">การชำระ {type}</h5>
                    </li>
                    <li>
                      <h5 className="alert alert-success">
                        รวมทั้งสิ้น {formatThaiNumber(totalPrice())} บาท
                      </h5>
                    </li>
                  </ul>
                  <button
                    className="btn btn-primary w-100"
                    onClick={checkOutOrder}
                  >
                    CHECK OUT
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Pos;
