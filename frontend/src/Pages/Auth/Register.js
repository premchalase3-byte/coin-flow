import { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { registerAPI } from "../../utils/ApiRequest";
import axios from "axios";

const Register = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    theme: "dark",
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  /* Password Strength Checker */

  const getPasswordStrength = (password) => {

    let strength = 0;

    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    if (strength <= 2) return { label: "Weak", color: "red", width: "33%" };
    if (strength <= 4) return { label: "Medium", color: "orange", width: "66%" };
    return { label: "Strong", color: "green", width: "100%" };

  };

  const passwordStrength = getPasswordStrength(values.password);

  const handleSubmit = async (e) => {

    e.preventDefault();

    const { name, email, password, confirmPassword } = values;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields", toastOptions);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", toastOptions);
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must contain 6+ chars, 1 uppercase, 1 lowercase, 1 number and 1 special character",
        toastOptions
      );
      return;
    }

    try {

      setLoading(true);

      const { data } = await axios.post(registerAPI, {
        name,
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

      toast.error("Registration failed. Please try again.", toastOptions);

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

            <div className="auth-card">

              <h1 className="text-center">
                <AccountBalanceWalletIcon sx={{ fontSize: 40, color: "white" }} />
              </h1>

              <h2 className="text-center text-white mt-2">
                Registration
              </h2>

              <Form onSubmit={handleSubmit}>

                <Form.Group className="mt-3">
                  <Form.Label className="text-white">Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                  />
                </Form.Group>

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
                        color: "#999"
                      }}
                    >
                      {showPassword ? "🙈" : "👁"}
                    </span>

                  </div>

                  {values.password && (

                    <div style={{ marginTop: "6px", fontSize: "14px" }}>

                      <span style={{ color: passwordStrength.color }}>
                        Strength: {passwordStrength.label}
                      </span>

                      <div
                        style={{
                          height: "5px",
                          background: "#333",
                          borderRadius: "5px",
                          marginTop: "4px",
                          overflow: "hidden",
                        }}
                      >

                        <div
                          style={{
                            width: passwordStrength.width,
                            background: passwordStrength.color,
                            height: "100%",
                          }}
                        />

                      </div>

                    </div>

                  )}

                </Form.Group>

                <Form.Group className="mt-3">

                  <Form.Label className="text-white">
                    Confirm Password
                  </Form.Label>

                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                  />

                </Form.Group>

                <div className="text-center mt-5">

                  <Button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Signup"}
                  </Button>

                  <p className="mt-3" style={{ color: "#ccc" }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: "#0d6efd", fontWeight: "500" }}>
                      Login
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

export default Register;