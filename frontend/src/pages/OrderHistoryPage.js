import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loggedUser = localStorage.getItem('user');
        
        if (!loggedUser) {
            navigate('/login');
            return;
        }
        
        const fetchOrders = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/orders/user_orders/?email=${loggedUser}`);
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error('Error:', error);
            }
            setLoading(false);
        };
        
        fetchOrders();
    }, [navigate]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '80px', minHeight: '60vh' }}>
                <h3>Loading your orders...</h3>
            </div>
        );
    }

    return (
        <div style={{ padding: '80px', minHeight: '60vh' }}>
            <h2 style={{ marginBottom: '30px', textAlign: 'center', color: '#222' }}>My Orders</h2>
            
            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <p>You haven't placed any orders yet.</p>
                    <a href="/shop" style={{
                        display: 'inline-block',
                        marginTop: '20px',
                        padding: '15px 30px',
                        background: '#088178',
                        color: '#fff',
                        textDecoration: 'none',
                        borderRadius: '5px'
                    }}>Start Shopping</a>
                </div>
            ) : (
                <div>
                    {orders.map(order => (
                        <div key={order.id} style={{
                            border: '1px solid #e0e0e0',
                            borderRadius: '12px',
                            padding: '20px',
                            marginBottom: '20px',
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                flexWrap: 'wrap', 
                                marginBottom: '15px',
                                paddingBottom: '12px',
                                borderBottom: '2px solid #088178'
                            }}>
                                <h4 style={{ margin: 0, color: '#088178' }}>Order #{order.id}</h4>
                                <p style={{ margin: 0, color: '#666' }}>
                                    <strong>Date:</strong> {new Date(order.created_at).toLocaleDateString('en-IN')}
                                </p>
                                <p style={{ margin: 0, color: '#088178', fontWeight: 'bold' }}>
                                    Total: ${parseFloat(order.total).toFixed(2)}
                                </p>
                            </div>
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                                gap: '12px' 
                            }}>
                                <p style={{ margin: 0 }}><strong>Name:</strong> {order.name}</p>
                                <p style={{ margin: 0 }}><strong>Email:</strong> {order.email}</p>
                                <p style={{ margin: 0 }}><strong>Phone:</strong> {order.phone}</p>
                                <p style={{ margin: 0 }}><strong>Address:</strong> {order.address}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderHistoryPage;