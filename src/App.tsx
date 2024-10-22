// src/App.tsx
import React, { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { Sidebar } from './components/Sidebar';
import { Login } from './components/Login';
import { SearchResult, BatchSearchResult } from './types';
import { cjkSearch, batchCjkSearch, loginVerify } from './service/dataService';
import './App.css';

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [batchSearchResult, setBatchSearchResult] = useState<BatchSearchResult | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(10);
    const [totalPages] = useState<number>(279200); // 总共2792008条DDI（排除药物名开头不是字母的特殊药物）
    const [inputPage, setInputPage] = useState<string>('');
    const [username, setUsername] = useState<string>('');

    const handleSearch = async (drugA: string, drugB: string) => {
        setIsLoading(true);
        setError(null);
        try {
            if (!drugA) {
                throw new Error('请输入药物A！');
            }
            if (drugA === drugB) {
                throw new Error('请输入两个不同的药物！');
            }

            const result = await cjkSearch(drugA, drugB);
            setSearchResult(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setSearchResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    const searchAlreadyExistDDI = async (page: number, limit: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await batchCjkSearch(page - 1, limit);
            if (!Array.isArray(result)) {
                throw new Error('Unexpected data format from the backend. Expected an array.');
            }
            const items = result.map(item => ({
                drugAName: item['drugAName'],
                drugBName: item['drugBName'],
                ddiDescription: item['ddiDescription']
            }));

            setBatchSearchResult({ items });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setBatchSearchResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            searchAlreadyExistDDI(newPage, pageSize);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputPage(e.target.value);
    };

    const handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const pageNumber = parseInt(inputPage);
        if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
            handlePageChange(pageNumber);
        }
        setInputPage('');
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const range = 2;

        pageNumbers.push(1);
        if (currentPage > 3) pageNumbers.push('...');

        for (let i = Math.max(2, currentPage - range); i <= Math.min(totalPages - 1, currentPage + range); i++) {
            pageNumbers.push(i);
        }

        if (currentPage < totalPages - 2) pageNumbers.push('...');
        pageNumbers.push(totalPages);

        return pageNumbers.map((number, index) => (
            <button
                key={index}
                onClick={() => typeof number === 'number' && handlePageChange(number)}
                disabled={number === currentPage || number === '...'}
                className={`page-number ${number === currentPage ? 'current-page' : ''}`}
            >
                {number}
            </button>
        ));
    };

    useEffect(() => {
        searchAlreadyExistDDI(currentPage, pageSize);
    }, []);

    const handleLogin = async (username: string, password: string) => {
        try {
            const result = await loginVerify(username, password);
            if (result === "yes") {
                setUsername(username)
                setIsLoggedIn(true);
                localStorage.setItem('isLoggedIn', 'true');
                setLoginError(null);
            } else {
                setLoginError('用户名或密码错误');
            }
        } catch (err) {
            setLoginError('登录过程中发生错误');
        }
    };

    const handleLogout = () => {
        setUsername('')
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
    };

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn');
        if (loggedIn === 'true') {
            setIsLoggedIn(true);
        }
    }, []);

    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} error={loginError} />;
    }

    return (

        <div className="app-container">
            {/*<div className="header">*/}
            {/*    <p>用户{username}已登录 </p>*/}
            {/*    <button onClick={handleLogout} className="logout-button">登出</button>*/}
            {/*</div>*/}
            <header className="header">
                <div className="search-bar-container">
                    <SearchBar onSearch={handleSearch}/>
                </div>
                <div className="user-info-container">
                    <div className="user-info">
                        <span className="login-status">用户</span>
                        <span className="username">{username}</span>
                        <span className="login-status">已登录</span>
                    </div>
                    <button onClick={handleLogout} className="logout-button">登出</button>
                </div>
            </header>

            {isLoading && <p className="loading">Loading...</p>}
            {error && <p className="error">{error}</p>}

            {searchResult && (
                <div className="sidebar-container">
                    <Sidebar ddiInfo={searchResult}/>
                </div>
            )}

            <div className="content-container">
                <h2>已通过生物医学实验验证的DDI</h2>
                <br></br>
                {batchSearchResult && (
                    <ul className="result-list">
                        {batchSearchResult.items.map((item, idx) => (
                            <li key={idx} className="result-item">
                                <strong>Drug A:</strong> {item.drugAName}, <strong>Drug B:</strong> {item.drugBName}
                                <p><strong>DDI:</strong> {item.ddiDescription}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="pagination">
                <button className="page-nav" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>首页
                </button>
                <button className="page-nav" onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}>上一页
                </button>
                {renderPageNumbers()}
                <button className="page-nav" onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}>下一页
                </button>
                <button className="page-nav" onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}>末页
                </button>
                <form onSubmit={handleInputSubmit} className="page-jump">
                    <input
                        type="number"
                        value={inputPage}
                        onChange={handleInputChange}
                        min={1}
                        max={totalPages}
                        placeholder="跳转到"
                    />
                    <button type="submit">跳转</button>
                </form>
            </div>
        </div>
    );
};

export default App;