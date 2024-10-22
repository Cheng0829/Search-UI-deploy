// src/components/Login.tsx
import React, { useState } from 'react';

interface LoginProps {
    onLogin: (username: string, password: string) => void;
    error: string | null;
}

export const Login: React.FC<LoginProps> = ({ onLogin, error }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(username, password);
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h2>登录</h2>
                {error && <p className="error">{error}</p>}
                <div>
                    <label htmlFor="username">用户名：</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">密码：</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">登录</button>
            </form>
        </div>
    );
};