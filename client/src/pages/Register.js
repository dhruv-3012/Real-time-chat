import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      if (res.data.msg === "User created") {
        alert("Registration Successful! Please login.");
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a0035 0%, #4c0099 40%, #7c3aed 70%, #c084fc 100%)',
      fontFamily: "'Syne', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');

        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(10deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-8deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .reg-card { animation: fadeIn 0.6s ease forwards; }

        .reg-input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 12px;
          border: 2px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.08);
          color: #fff;
          font-size: 15px;
          font-family: 'Syne', sans-serif;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
        }
        .reg-input::placeholder { color: rgba(255,255,255,0.4); }
        .reg-input:focus {
          border-color: #c084fc;
          background: rgba(255,255,255,0.14);
          box-shadow: 0 0 0 4px rgba(192, 132, 252, 0.15);
        }

        .reg-btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #a855f7, #7c3aed);
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          font-family: 'Syne', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(124, 58, 237, 0.5);
          letter-spacing: 0.5px;
        }
        .reg-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(124, 58, 237, 0.7);
        }
        .reg-btn:active { transform: translateY(0); }
      `}</style>

      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: '-100px', right: '-100px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'rgba(168, 85, 247, 0.2)',
        animation: 'float1 6s ease-in-out infinite',
        pointerEvents: 'none',
      }}/>
      <div style={{
        position: 'absolute', bottom: '-80px', left: '-80px',
        width: '350px', height: '350px', borderRadius: '50%',
        background: 'rgba(124, 58, 237, 0.25)',
        animation: 'float2 8s ease-in-out infinite',
        pointerEvents: 'none',
      }}/>
      <div style={{
        position: 'absolute', top: '30%', left: '10%',
        width: '150px', height: '150px', borderRadius: '50%',
        background: 'rgba(192, 132, 252, 0.15)',
        animation: 'float1 5s ease-in-out infinite 1s',
        pointerEvents: 'none',
      }}/>

      {/* Card */}
      <div className="reg-card" style={{
        width: '100%',
        maxWidth: '420px',
        margin: '20px',
        background: 'rgba(255, 255, 255, 0.07)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.15)',
        padding: '44px 40px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
        zIndex: 1,
      }}>
        {/* Logo / Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '60px', height: '60px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '28px',
            boxShadow: '0 8px 24px rgba(124, 58, 237, 0.5)',
          }}>
            💬
          </div>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Create account
          </h2>
          <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
            Join VibeChat today
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#fca5a5',
            fontSize: '14px',
            textAlign: 'center',
            marginBottom: '16px',
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '600', marginBottom: '6px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Username
            </label>
            <input
              className="reg-input"
              type="text"
              placeholder="cooluser123"
              required
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '600', marginBottom: '6px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Email
            </label>
            <input
              className="reg-input"
              type="email"
              placeholder="you@example.com"
              required
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '600', marginBottom: '6px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Password
            </label>
            <input
              className="reg-input"
              type="password"
              placeholder="••••••••"
              required
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button className="reg-btn" type="submit" style={{ marginTop: '8px' }}>
            Create Account
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#c084fc', fontWeight: '700', textDecoration: 'none' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;