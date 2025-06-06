import React, { useState } from 'react';
import './AuthForm.css';

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Extra fields for register
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState('Home Cook');

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setName('');
    setAddress('');
    setPhone('');
    setUserType('Home Cook');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = isLogin
      ? { email, password }
      : { name, email, password, address, phone, userType };

    alert(`${isLogin ? 'Login' : 'Register'}: ${JSON.stringify(payload, null, 2)}`);

    // TODO: Connect to real API
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{isLogin ? 'Login to TiffinBox' : 'Register for TiffinBox'}</h2>

        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <select value={userType} onChange={(e) => setUserType(e.target.value)}>
              <option>Home Cook</option>
              <option>Tiffin Service</option>
              <option>Food Seeker</option>
            </select>
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">
          {isLogin ? 'Login' : 'Register'}
        </button>

        <p className="switch-text">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button type="button" className="link-btn" onClick={handleToggle}>
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </form>
    </div>
  );
}

export default AuthForm;
