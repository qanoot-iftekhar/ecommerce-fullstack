import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
    const [cartCount, setCartCount] = useState(0);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const fetchCartCount = async () => {
        const sessionId = localStorage.getItem('sessionId');
        console.log('Fetching cart count for session:', sessionId);
        
        if (sessionId) {
            try {
                const response = await fetch(`http://localhost:8000/api/cart/?session_id=${sessionId}`);
                const data = await response.json();
                console.log('Cart items count:', data.length);
                setCartCount(data.length);
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            setCartCount(0);
        }
    };

    const checkUser = () => {
        const loggedUser = localStorage.getItem('user');
        if (loggedUser) {
            setUser(loggedUser);
        } else {
            setUser(null);
        }
    };

    useEffect(() => {
        checkUser();
        fetchCartCount();
        
        // Listen for cart updates and login events
        window.addEventListener('cartUpdated', fetchCartCount);
        window.addEventListener('userLoggedIn', () => {
            checkUser();
            fetchCartCount();
        });
        
        return () => {
            window.removeEventListener('cartUpdated', fetchCartCount);
            window.removeEventListener('userLoggedIn', checkUser);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('sessionId');
        setUser(null);
        setCartCount(0);
        
        window.dispatchEvent(new Event('userLoggedIn'));
        navigate('/');
    };

    return (
        <section id="header">
            <Link to="/"><img src="/img/logo.png" className="logo" alt="logo" /></Link>
            <div>
                <ul id="nevbar" style={{ display: 'flex', alignItems: 'center', gap: '20px', listStyle: 'none' }}>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/shop">Shop</Link></li>
                    <li><Link to="/blog">Blog</Link></li>
                    <li><Link to="/cart">Cart ({cartCount})</Link></li>
                    {user ? (
                        <>
                            <li style={{ color: '#088178', fontWeight: 'bold' }}>Hi, {user}</li>
                            <li><Link to="/orders">My Orders</Link></li>
                            <li><button onClick={handleLogout} style={{ background: '#088178', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>Logout</button></li>
                        </>
                    ) : (
                        <li><Link to="/login" style={{ background: '#088178', color: 'white', padding: '8px 15px', borderRadius: '4px', textDecoration: 'none' }}>Login</Link></li>
                    )}
                </ul>
            </div>
        </section>
    );
}

export default Header;