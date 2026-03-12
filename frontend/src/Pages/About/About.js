import React from "react";
import Navbar from "../../components/Navbar";
import { Container, Card } from "react-bootstrap";

const About = () => {
  return (
    <>
      <Navbar />

      <Container
        fluid
        style={{
          marginTop: "90px",
          minHeight: "100vh",
          padding: "40px",
          color: "#ffffff",
        }}
      >
        <Card
          style={{
            backgroundColor: "#1e1e1e",
            borderRadius: "12px",
            padding: "30px",
            maxWidth: "1000px",
            margin: "0 auto",
            color: "#ffffff",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            About Coin-Flow
          </h2>

          <p style={{ fontSize: "16px", lineHeight: "1.8" }}>
            Coin-Flow is a modern personal finance management application
            designed to help users track, analyze, and manage their income and
            expenses efficiently. The platform provides a simple and intuitive
            interface where users can record transactions, organize financial
            data, and gain insights into their spending habits.
          </p>

          <p style={{ fontSize: "16px", lineHeight: "1.8" }}>
            The application allows users to categorize transactions, monitor
            income and expenses, and visualize financial activity using charts
            and structured reports. Coin-Flow is built with a focus on
            performance, security, and usability, making it suitable for
            students, professionals, and individuals who want better control
            over their personal finances.
          </p>

          <hr style={{ borderColor: "#444" }} />

          <h4>Our Mission</h4>
          <p style={{ fontSize: "16px", lineHeight: "1.8" }}>
            Our mission is to empower individuals to make smarter financial
            decisions by providing clear insights and organized financial data.
            We believe that when people understand their spending patterns,
            they can build stronger financial habits and achieve better
            financial stability.
          </p>

          <hr style={{ borderColor: "#444" }} />

          <h4>Technology Stack</h4>
          <p style={{ fontSize: "16px", lineHeight: "1.8" }}>
            Coin-Flow is developed using modern web technologies including
            React.js for the frontend, Node.js and Express.js for backend API
            development, and MongoDB for database management. These
            technologies ensure scalability, security, and a smooth user
            experience.
          </p>

          <hr style={{ borderColor: "#444" }} />

          <h4>Development Team</h4>
          <p style={{ fontSize: "16px", lineHeight: "1.8" }}>
            <strong>Major Developer & Founder:</strong> Mr. Prem N. Chalase
          </p>

          <hr style={{ borderColor: "#444" }} />

          <h4>Contact Information</h4>
          <p style={{ fontSize: "16px", lineHeight: "1.8" }}>
            📞 <strong>Phone:</strong> +91 7760973219
            <br />
            🔗 <strong>LinkedIn:</strong>{" "}
            <a
              href="https://www.linkedin.com/in/prem-chalase-21a572392"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#2ecc71", textDecoration: "none" }}
            >
              linkedin.com/in/prem-chalase-21a572392
            </a>
            <br />
            ✉️ <strong>Email:</strong> premchalase3@gmail.com
            <br />
            🕙 <strong>Availability:</strong> 10:00 AM – 9:00 PM
          </p>

          <p style={{ fontSize: "16px", lineHeight: "1.8" }}>
            For support, feature suggestions, or collaboration inquiries,
            please feel free to reach out. User feedback plays an important
            role in improving and evolving the Coin-Flow platform.
          </p>

          <p
            style={{
              marginTop: "30px",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            © 2026 Coin-Flow. All Rights Reserved.
          </p>
        </Card>
      </Container>
    </>
  );
};

export default About;