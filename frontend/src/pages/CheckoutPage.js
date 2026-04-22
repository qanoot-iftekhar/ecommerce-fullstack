import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CheckoutPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        pincode: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        const sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/cart/?session_id=${sessionId}`);
            const data = await response.json();
            setCartItems(data);
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    const getTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = parseFloat(item.product_detail?.price) || 0;
            return total + (price * item.quantity);
        }, 0);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const clearCart = async () => {
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) {
            try {
                await fetch(`http://localhost:8000/api/cart/clear_cart/?session_id=${sessionId}`, {
                    method: 'DELETE',
                });
                localStorage.removeItem('sessionId');
                window.dispatchEvent(new Event('cartUpdated'));
                window.dispatchEvent(new Event('userLoggedIn'));
            } catch (error) {
                console.error('Error clearing cart:', error);
            }
        }
    };

    const placeOrder = async () => {
        //const sessionId = localStorage.getItem('sessionId');
        const orderData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: `${formData.address}, ${formData.city}, ${formData.pincode}`,
            total: getTotal()
        };

        try {
            const orderResponse = await fetch('http://localhost:8000/api/orders/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            if (orderResponse.ok) {
                await clearCart();
                alert('✅ Order placed successfully!');
                navigate('/');
            } else {
                alert('❌ Error placing order');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Failed to place order');
        }
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        const total = getTotal();
        
        try {
            const response = await fetch('http://localhost:8000/api/payment/create_order/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: total })
            });
            
            const order = await response.json();
            
            const options = {
                key: 'rzp_test_SfpVCfrWmj6BGu',
                amount: order.amount,
                currency: 'INR',
                name: 'Ecommerce Store',
                description: 'Order Payment',
                order_id: order.id,
                handler: async (paymentResponse) => {
                    const verifyResponse = await fetch('http://localhost:8000/api/payment/verify_payment/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(paymentResponse)
                    });
                    
                    const verifyData = await verifyResponse.json();
                    
                    if (verifyData.status === 'success') {
                        await placeOrder();
                    } else {
                        alert('Payment verification failed!');
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: {
                    color: '#088178',
                },
            };
            
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment failed!');
        }
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        
        if (cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        setSubmitting(true);
        
        const scriptLoaded = await loadRazorpayScript();
        if (scriptLoaded) {
            await handlePayment();
        } else {
            alert('Failed to load payment gateway');
            await placeOrder(); // Fallback: without payment
        }
        
        setSubmitting(false);
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
    }

    if (cartItems.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '80px', minHeight: '60vh' }}>
                <h2>Your cart is empty</h2>
                <p>Add some products to your cart before checkout.</p>
                <a href="/shop" className="normal" style={{
                    display: 'inline-block',
                    marginTop: '20px',
                    padding: '15px 30px',
                    background: '#088178',
                    color: '#fff',
                    textDecoration: 'none'
                }}>Continue Shopping</a>
            </div>
        );
    }

    return (
        <div style={{ padding: '80px', minHeight: '60vh' }}>
            <h2 style={{ marginBottom: '30px' }}>Checkout</h2>
            
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1.5', minWidth: '300px' }}>
                    <h3>Shipping Details</h3>
                    <form onSubmit={handleSubmitOrder}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Full Name *</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                        </div>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Email *</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                        </div>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Phone *</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleInputChange}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                        </div>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Address *</label>
                            <textarea
                                name="address"
                                required
                                rows="3"
                                value={formData.address}
                                onChange={handleInputChange}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                        </div>
                        
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div style={{ flex: 1, marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    required
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                            <div style={{ flex: 1, marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Pincode *</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    required
                                    value={formData.pincode}
                                    onChange={handleInputChange}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="normal"
                            style={{
                                width: '100%',
                                padding: '15px',
                                background: '#088178',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '16px',
                                borderRadius: '4px'
                            }}
                        >
                            {submitting ? 'Processing Payment...' : 'Proceed to Payment'}
                        </button>
                    </form>
                </div>
                
                <div style={{ flex: '1', background: '#f9f9f9', padding: '20px', borderRadius: '10px', position: 'sticky', top: '100px' }}>
                    <h3>Order Summary</h3>
                    {cartItems.map(item => (
                        <div key={item.id} style={{ display: 'flex', gap: '15px', marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                            <img 
                                src={item.product_detail?.image} 
                                alt=""
                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px' }}
                            />
                            <div style={{ flex: 1 }}>
                                <h5 style={{ margin: '0 0 5px 0' }}>{item.product_detail?.name}</h5>
                                <p style={{ margin: 0 }}>Qty: {item.quantity}</p>
                                <p style={{ margin: 0, fontWeight: 'bold' }}>${((item.product_detail?.price || 0) * item.quantity).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                    <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '2px solid #088178' }}>
                        <h4>Total: ${getTotal().toFixed(2)}</h4>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;