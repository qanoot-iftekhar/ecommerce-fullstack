import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const sessionId = localStorage.getItem('sessionId');
    
    console.log('Session ID:', sessionId);
    
    if (!sessionId) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.get(`http://localhost:8000/api/cart/?session_id=${sessionId}`);
      console.log('Cart items:', response.data);
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
    setLoading(false);
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.product_detail?.price) || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading cart...</div>;
  }

  return (
    <section style={{ padding: '80px', minHeight: '60vh' }}>
      <h2>Shopping Cart</h2>
      
      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p>Your cart is empty.</p>
          <a href="/shop" style={{
            display: 'inline-block',
            marginTop: '20px',
            padding: '15px 30px',
            background: '#088178',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '5px'
          }}>Continue Shopping</a>
        </div>
      ) : (
        <>
          <div style={{ marginTop: '30px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Product</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Price</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Quantity</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '20px' }}>
                      <img 
                        src={item.product_detail?.image || '/img/logo.png'} 
                        alt="" 
                        style={{ width: '80px' }}
                      />
                    </td>
                    <td style={{ padding: '20px' }}>{item.product_detail?.name}</td>
                    <td style={{ padding: '20px' }}>${item.product_detail?.price}</td>
                    <td style={{ padding: '20px' }}>{item.quantity}</td>
                    <td style={{ padding: '20px' }}>${((item.product_detail?.price || 0) * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div style={{ marginTop: '30px', textAlign: 'right' }}>
              <h3>Total: ${getTotal().toFixed(2)}</h3>
              <Link to="/checkout">
                <button className="normal" style={{ marginTop: '20px', background: '#088178', color: '#fff', padding: '15px 30px', border: 'none', cursor: 'pointer' }}>
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default CartPage;