import { useState } from "react";
import { login } from "../functions/auth";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    login(formData)
      .then((res) => {
        if (res.data.success) {
          localStorage.setItem("user", JSON.stringify(res.data.data));
          location.reload();
        } else {
          setError(res.data.errors);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div
      className="container-fluid"
      style={{
        backgroundImage: `url("https://png.pngtree.com/thumb_back/fh260/background/20230408/pngtree-rainbow-curves-abstract-colorful-background-image_2164067.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
      }}
    >
      <div className=" d-flex justify-content-center align-items-center vh-100">
        <div className="card border-0 shadow">
          <div className="card-body">
            <h1>WELCOME TO POS SYSTEM</h1>
            <hr />
            {error.length ? (
              <div className="alert alert-danger pb-0">
                <ul>
                  {error.map((item, index) => (
                    <li key={index}>{item.message}</li>
                  ))}
                </ul>
              </div>
            ) : <></>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="">username</label>
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="">password</label>
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button className="btn btn-primary float-end">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
