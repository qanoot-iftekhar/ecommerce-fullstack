import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/products/');
            const data = await response.json();
            setFeaturedProducts(data.filter(p => p.category === 'featured').slice(0, 8));
            setNewArrivals(data.filter(p => p.category === 'new').slice(0, 8));
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    const handleAddToCart = async (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        
        let sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('sessionId', sessionId);
        }
        
        try {
            const response = await fetch('http://localhost:8000/api/cart/add_to_cart/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session_id: sessionId,
                    product_id: product.id,
                    quantity: 1
                })
            });
            
            if (response.ok) {
                alert(`✅ ${product.name} added to cart!`);
                window.dispatchEvent(new Event('cartUpdated'));
            } else {
                alert('❌ Failed to add to cart');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Failed to add to cart');
        }
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
    }

    return (
        <div>
            <section id="hero">
                <h4>Trade-in-offer</h4>
                <h2>Super value deals</h2>
                <h1>On all product</h1>
                <p>Save more with coupons & up to 70% off!</p>
                <button>Shop now</button>
            </section>

            <section id="feature" className="section-p1">
                {['Free Shipping', 'Online Order', 'Save Money', 'Promotions', 'Happy Sell', '24/7 Support'].map((text, i) => (
                    <div className="fe-box" key={i}>
                        <img src={`/img/f${i+1}.png`} alt={text} />
                        <h6>{text}</h6>
                    </div>
                ))}
            </section>

            {/* Featured Products */}
            <section id="product1" className="section-p1">
                <h2>Featured Products</h2>
                <p>Summer Collection New Modern Design</p>
                <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    justifyContent: 'flex-start',
                    gap: '20px',
                    marginBottom: '0'
                }}>
                    {featuredProducts.map(product => (
                        <div 
                            key={product.id} 
                            onClick={() => handleProductClick(product.id)}
                            style={{ 
                                cursor: 'pointer',
                                width: '250px',
                                padding: '10px 12px',
                                border: '1px solid #cce7d0',
                                borderRadius: '25px',
                                backgroundColor: '#fff',
                                position: 'relative'
                            }}
                        >
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                style={{ 
                                    width: '100%', 
                                    borderRadius: '20px',
                                    height: '200px',
                                    objectFit: 'cover'
                                }} 
                            />
                            <div style={{ textAlign: 'start', padding: '10px 0' }}>
                                <span style={{ color: '#606063', fontSize: '12px' }}>{product.brand}</span>
                                <h5 style={{ paddingTop: '7px', color: '#1a1a1a', fontSize: '14px', margin: 0 }}>{product.name}</h5>
                                <div style={{ margin: '5px 0' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className="fas fa-star" style={{ fontSize: '12px', color: 'rgb(243, 181, 25)' }}></i>
                                    ))}
                                </div>
                                <h4 style={{ paddingTop: '7px', fontSize: '15px', fontWeight: '700', color: '#088178', margin: 0 }}>${product.price}</h4>
                            </div>
                            <a 
                                href="#" 
                                onClick={(e) => handleAddToCart(e, product)}
                                style={{ 
                                    cursor: 'pointer',
                                    width: '40px',
                                    height: '40px',
                                    lineHeight: '40px',
                                    borderRadius: '50px',
                                    backgroundColor: '#088178',
                                    color: '#fff',
                                    position: 'absolute',
                                    bottom: '15px',
                                    right: '15px',
                                    textAlign: 'center',
                                    textDecoration: 'none',
                                    fontSize: '20px'
                                }}
                            >
                                🛒
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            <section id="banner" className="section-m1">
                <h4>Repair Service</h4>
                <h2>Up to <span>70% Off</span> - All T-Shirts & Accessories</h2>
                <button>Explore More</button>
            </section>

            {/* New Arrivals */}
            <section id="product1" className="section-p1">
                <h2>New Arrivals</h2>
                <p>Summer Collection New Modern Design</p>
                <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    justifyContent: 'flex-start',
                    gap: '20px',
                    marginBottom: '0'
                }}>
                    {newArrivals.map(product => (
                        <div 
                            key={product.id} 
                            onClick={() => handleProductClick(product.id)}
                            style={{ 
                                cursor: 'pointer',
                                width: '250px',
                                padding: '10px 12px',
                                border: '1px solid #cce7d0',
                                borderRadius: '25px',
                                backgroundColor: '#fff',
                                position: 'relative'
                            }}
                        >
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                style={{ 
                                    width: '100%', 
                                    borderRadius: '20px',
                                    height: '200px',
                                    objectFit: 'cover'
                                }} 
                            />
                            <div style={{ textAlign: 'start', padding: '10px 0' }}>
                                <span style={{ color: '#606063', fontSize: '12px' }}>{product.brand}</span>
                                <h5 style={{ paddingTop: '7px', color: '#1a1a1a', fontSize: '14px', margin: 0 }}>{product.name}</h5>
                                <div style={{ margin: '5px 0' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className="fas fa-star" style={{ fontSize: '12px', color: 'rgb(243, 181, 25)' }}></i>
                                    ))}
                                </div>
                                <h4 style={{ paddingTop: '7px', fontSize: '15px', fontWeight: '700', color: '#088178', margin: 0 }}>${product.price}</h4>
                            </div>
                            <a 
                                href="#" 
                                onClick={(e) => handleAddToCart(e, product)}
                                style={{ 
                                    cursor: 'pointer',
                                    width: '40px',
                                    height: '40px',
                                    lineHeight: '40px',
                                    borderRadius: '50px',
                                    backgroundColor: '#088178',
                                    color: '#fff',
                                    position: 'absolute',
                                    bottom: '15px',
                                    right: '15px',
                                    textAlign: 'center',
                                    textDecoration: 'none',
                                    fontSize: '20px'
                                }}
                            >
                                🛒
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            <section id="sm-banner" className="section-p1">
                <div className="banner-box">
                    <h4>crazy deals</h4>
                    <h2>buy 1 get 1 free</h2>
                    <span>The best classic dress is on sale at cara</span>
                    <button className="white">Learn More</button>
                </div>
                <div className="banner-box banner-box2">
                    <h4>spring/summer</h4>
                    <h2>upcoming season</h2>
                    <span>The best classic dress is on sale at cara</span>
                    <button className="white">Collection</button>
                </div>
            </section>

            <section id="banner3">
                <div className="banner-box">
                    <h2>SEASONAL SALE</h2>
                    <h3>Winter Collection -50% OFF</h3>
                </div>
                <div className="banner-box banner-box2">
                    <h2>NEW FOOTWEAR COLLECTION</h2>
                    <h3>Spring/Summer 2024</h3>
                </div>
                <div className="banner-box banner-box3">
                    <h2>T-SHIRT</h2>
                    <h3>New Trendy Print</h3>
                </div>
            </section>
        </div>
    );
}

export default HomePage;