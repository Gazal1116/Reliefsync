import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateRequest() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    contact: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/relief", formData);
      alert("Relief Request Submitted Successfully 🚀");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Error submitting request");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Create Relief Request</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="title"
            placeholder="Request Title"
            value={formData.title}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <textarea
            name="description"
            placeholder="Describe the situation..."
            value={formData.description}
            onChange={handleChange}
            required
            style={styles.textarea}
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px"
  },
  card: {
    width: "420px",
    padding: "40px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(15px)",
    borderRadius: "20px",
    boxShadow: "0 0 40px rgba(111, 66, 193, 0.4)",
    transition: "0.3s ease"
  },
  heading: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#fff",
    fontSize: "26px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px"
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #6f42c1",
    backgroundColor: "#1c1c3c",
    color: "#fff",
    outline: "none"
  },
  textarea: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #6f42c1",
    backgroundColor: "#1c1c3c",
    color: "#fff",
    height: "90px",
    resize: "none",
    outline: "none"
  },
  button: {
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(90deg, #6f42c1, #007bff)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s"
  }
};

export default CreateRequest;