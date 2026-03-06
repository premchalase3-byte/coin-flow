import { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";import axios from "axios";
import { loginAPI } from "../../utils/ApiRequest";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

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

      <Container className="mt-5" style={{ position: "relative", zIndex: 2 }}>
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <h1 className="text-center mt-5">
              <AccountBalanceWalletIcon sx={{ fontSize: 40, color: "white" }} />
            </h1>
            <h2 className="text-white text-center">Login</h2>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mt-3">
                <Form.Label className="text-white">Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label className="text-white">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                />
              </Form.Group>

              <div className="text-center mt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Signing in..." : "Login"}
                </Button>

                <p className="mt-3 text-muted">
                  Don’t have an account?{" "}
                  <Link to="/signup" className="text-white">
                    Signup
                  </Link>
                </p>
              </div>
            </Form>
          </Col>
        </Row>

        <ToastContainer />
      </Container>
    </div>
  );
};

export default Login;