import React, { useState, useEffect } from 'react';

function TestCart() {
    const [message, setMessage] = useState('');
    const [cartItems, setCartItems] = useState([]);

    const addToCart = async () => {
        let sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = 'session_' + Date.now();
            localStorage.setItem('sessionId', sessionId);
        }

        setMessage('Adding to cart...');

        try {
            const response = await fetch('http://localhost:8000/api/cart/add_to_cart/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session_id: sessionId,
                    product_id: 1,
                    quantity: 1
                })
            });

            const data = await response.json();
            console.log('Response:', data);
            
            if (response.ok) {
                setMessage('✅ Success! Product added to cart!');
                fetchCart();
            } else {
                setMessage('❌ Error: ' + JSON.stringify(data));
            }
        } catch (error) {
            setMessage('❌ Error: ' + error.message);
            console.error('Fetch error:', error);
        }
    };

    const fetchCart = async () => {
        const sessionId = localStorage.getItem('sessionId');
        if (!sessionId) return;

        try {
            const response = await fetch(`http://localhost:8000/api/cart/?session_id=${sessionId}`);
            const data = await response.json();
            setCartItems(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <div style={{ padding: '50px' }}>
            <h1>Test Cart Page</h1>
            
            <button 
                onClick={addToCart}
                style={{
                    padding: '10px 20px',
                    background: '#088178',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    borderRadius: '5px'
                }}
            >
                Add Product ID 1 to Cart
            </button>
            
            <p style={{ marginTop: '20px', color: 'blue' }}>{message}</p>
            
            <h2>Cart Items:</h2>
            {cartItems.length === 0 ? (
                <p>Cart is empty</p>
            ) : (
                <ul>
                    {cartItems.map(item => (
                        <li key={item.id}>
                            <strong>{item.product_detail?.name}</strong> - 
                            Quantity: {item.quantity} - 
                            Price: ${item.product_detail?.price}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TestCart;