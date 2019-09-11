import React, { useState, useEffect } from 'react';

const Login: React.FC = () => {
  const [User, setUser] = useState('');

  const trueSubmit = (e: any) => {
    e.preventDefault();
    console.log(User);
  }

  return (
    <div className="Login" onSubmit={trueSubmit}>
      <input type="text" onChange={(e) => setUser(e.target.value)} />
      <input type="text" onChange={(e) => setUser(e.target.value)} />
      <button type="submit">登录</button>
    </div>
  );
}

export default Login;