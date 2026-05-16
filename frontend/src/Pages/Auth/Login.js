import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { loginAPI } from "../../utils/ApiRequest";
import DottedSurface from "../../components/DottedSurface";

const Login = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    theme: "dark",
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const { email, password } = values;

    if (!email || !password) {
      toast.error("Please fill all fields", toastOptions);
      return;
    }

    try {

      setLoading(true);

      const { data } = await axios.post(loginAPI, {
        email,
        password,
      });

      if (data.success) {

        localStorage.setItem("user", JSON.stringify(data.user));

        toast.success(data.message, toastOptions);

        setTimeout(() => {
          window.location.href = "/";
        }, 1000);

      } else {

        toast.error(data.message, toastOptions);

      }

    } catch (error) {

      toast.error("Login failed. Please try again.", toastOptions);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >

      {/* Dashboard Background */}
      <DottedSurface />

      <Container
        className="d-flex align-items-center justify-content-center"
        style={{
          minHeight: "100vh",
          position: "relative",
          zIndex: 2,
        }}
      >

        <Row className="w-100">

          <Col xs={12} md={{ span: 6, offset: 3 }}>

            <div className="auth-card">

              <h1 className="text-center">
                <AccountBalanceWalletIcon
                  sx={{
                    fontSize: 45,
                    color: "#ffffff",
                  }}
                />
              </h1>

              <h2
                className="text-center text-white mt-3"
                style={{
                  fontWeight: "600",
                  letterSpacing: "0.5px",
                }}
              >
                Login
              </h2>

              <Form onSubmit={handleSubmit}>

                <Form.Group className="mt-4">

                  <Form.Label className="text-white">
                    Email
                  </Form.Label>

                  <Form.Control
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />

                </Form.Group>

                <Form.Group className="mt-3">

                  <Form.Label className="text-white">
                    Password
                  </Form.Label>

                  <div style={{ position: "relative" }}>

                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                    />

                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "10px",
                        cursor: "pointer",
                        color: "#aaa",
                        fontSize: "14px",
                      }}
                    >
                      {showPassword ? "🙈" : "👁"}
                    </span>

                  </div>

                </Form.Group>

                <div className="text-center mt-4">

                  <Button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: "10px 30px",
                      borderRadius: "10px",
                      fontWeight: "600",
                    }}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>

                  <p
                    className="mt-3"
                    style={{
                      color: "#cccccc",
                    }}
                  >
                    Don’t have an account?{" "}
                    <Link
                      to="/signup"
                      style={{
                        color: "#00d9ff",
                        fontWeight: "600",
                        textDecoration: "none",
                      }}
                    >
                      Signup
                    </Link>
                  </p>

                </div>

              </Form>

            </div>

          </Col>

        </Row>

        <ToastContainer />

      </Container>

    </div>
  );
};

export default Login;