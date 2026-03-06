import { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { loginAPI } from "../../utils/ApiRequest";

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
    setValues({ ...values, [e.target.name]: e.target.value });
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

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (

    <div style={{ position: "relative", overflow: "hidden" }}>

      <Particles
        init={particlesInit}
        options={{
          background: { color: { value: "#000" } },
          particles: {
            number: { value: 200 },
            color: { value: "#ffcc00" },
            size: { value: 3 },
            move: { enable: true, speed: 2 },
          },
        }}
        style={{
          position: "absolute",
          zIndex: -1,
          inset: 0,
        }}
      />

      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh", position: "relative", zIndex: 2 }}
      >

        <Row className="w-100">

          <Col xs={12} md={{ span: 6, offset: 3 }}>

            <div
              style={{
                backdropFilter: "blur(10px)",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "15px",
                padding: "35px",
              }}
            >

              <h1 className="text-center">
                <AccountBalanceWalletIcon
                  sx={{ fontSize: 40, color: "white" }}
                />
              </h1>

              <h2 className="text-center text-white mt-3">
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
                    />

                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "8px",
                        cursor: "pointer",
                        color: "#999",
                      }}
                    >
                      {showPassword ? "🙈" : "👁"}
                    </span>

                  </div>

                </Form.Group>

                <div className="text-center mt-4">

                  <Button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </Button>

                  <p className="mt-3" style={{ color: "#ccc" }}>
                    Don’t have an account?{" "}
                    <Link
                      to="/signup"
                      style={{ color: "#0d6efd", fontWeight: "500" }}
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