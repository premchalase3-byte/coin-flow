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
            Coin-Flow is a modern and user-friendly financial management
            application designed to help individuals track, analyze, and manage
            their income and expenses efficiently. Our goal is to simplify
            personal finance by providing clear insights, analytics, and
            organized transaction records all in one place.
          </p>

          <p style={{ fontSize: "16px", lineHeight: "1.8" }}>
            With Coin-Flow, users can easily record transactions, categorize
            expenses, monitor spending patterns, and visualize financial data
            through charts and tables. The platform is built with performance,
            security, and simplicity in mind, making it suitable for daily use by
            students, professionals, and small business owners.
          </p>

          <hr style={{ borderColor: "#444" }} />

          <h4>Our Mission</h4>
          <p style={{ fontSize: "16px", lineHeight: "1.8" }}>
            Our mission is to empower users to make smarter financial decisions
            by giving them full control and visibility over their money. We
            believe that financial clarity leads to financial confidence.
          </p>

          <hr style={{ borderColor: "#444" }} />

          <h4>Development Team</h4>
          <p style={{ fontSize: "16px", lineHeight: "1.8" }}>
            <strong>Developer & Founder:</strong> Mr.Prem.N.Chalase
            <br />
          </p>

          <p style={{ fontSize: "16px", lineHeight: "1.8" }}>
            Coin-Flow is built using modern web technologies including React,
            Node.js, Express, and MongoDB, ensuring scalability, reliability, and
            a smooth user experience.
          </p>

          <hr style={{ borderColor: "#444" }} />

          <h4>Contact Us</h4>
          <p style={{ fontSize: "16px", lineHeight: "1.8" }}>
            📞 <strong>Contact Number:</strong> 7760973219
            <br />
            ✉️ <strong>Email:</strong> premchalase3@gmail.com
            <br />
            🕙 <strong>Available:</strong> 10:00 AM – 9:00 PM
          </p>

          <p style={{ fontSize: "16px", lineHeight: "1.8" }}>
            For support, feature requests, or business inquiries, feel free to
            reach out to us during the available hours. We value user feedback
            and continuously work to improve Coin-Flow.
          </p>

          <p
            style={{
              marginTop: "30px",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            © 2025 Coin-Flow. All rights reserved.
          </p>
        </Card>
      </Container>
    </>
  );
};

export default About;