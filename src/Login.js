// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase/firebaseconfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css'; // Optional: style the form
import './Institute';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const profile = sessionStorage.getItem("profile");

  // List of valid institute email-password pairs
  const validInstituteUsers = [
    { email: "anupambera@gmail.com", password: "anupambera@gmail.com" },
    { email: "swagatamr577@gmail.com", password: "swagatamr577@gmail.com" },
    { email: "bablaroy577@gmail.com", password: "bablaroy577@gmail.com" }
  ];

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (profile === "Institute") {
      // Validate institute credentials
      const user = validInstituteUsers.find(
        (user) => user.email === email && user.password === password
      );

      if (user) {
        navigate("/Institute");
      } else {
        setError("Invalid credentials!");
      }
    } else {
      // For verifier, login through Firebase
      try {
        await signInWithEmailAndPassword(auth, email, password);
        setError("");
        navigate("/verifier");
      } catch (err) {
        setError("Invalid credentials!");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>{profile} Login</h2>
      <form onSubmit={handleLogin}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
      {profile !== "Institute" && (
        <button onClick={() => navigate("/register")}>
          New user? Click here to register!
        </button>
      )}
    </div>
  );
}

export default Login;
