/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ShopPage() {
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/products/');
            const data = await response.json();
            setProducts(data);
            setAllProducts(data);
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    const handleSearch = async () => {
        setLoading(true);
        let url = 'http://localhost:8000/api/products/search/?';
        
        if (searchTerm) url += `q=${searchTerm}&`;
        if (selectedCategory) url += `category=${selectedCategory}&`;
        if (minPrice) url += `min_price=${minPrice}&`;
        if (maxPrice) url += `max_price=${maxPrice}&`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setMinPrice('');
        setMaxPrice('');
        setProducts(allProducts);
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

    const categories = ['', ...new Set(allProducts.map(p => p.category))].filter(Boolean);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
    }

    return (
        <div>
            <section id="page-header">
                <h2>#stayhome</h2>
                <p>Save more with coupons & up to 70% off!</p>
            </section>

            {/* Search Filters - Reduced padding */}
            <div style={{
                display: 'flex',
                gap: '15px',
                flexWrap: 'wrap',
                marginBottom: '20px',
                padding: '15px 80px',
                background: '#f9f9f9',
                borderRadius: '0'
            }}>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        flex: '2',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        fontSize: '14px'
                    }}
                />
                
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{
                        flex: '1',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        fontSize: '14px'
                    }}
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                    ))}
                </select>
                
                <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    style={{
                        flex: '1',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        fontSize: '14px'
                    }}
                />
                
                <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    style={{
                        flex: '1',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        fontSize: '14px'
                    }}
                />
                
                <button
                    onClick={handleSearch}
                    style={{
                        padding: '10px 20px',
                        background: '#088178',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Search
                </button>
                
                <button
                    onClick={handleClearFilters}
                    style={{
                        padding: '10px 20px',
                        background: '#ccc',
                        color: '#333',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Clear
                </button>
            </div>

            {/* Products Section - NO GAPS */}
            <div style={{ padding: '0 80px' }}>
                <p style={{ marginBottom: '15px' }}>Found {products.length} products</p>

                <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    justifyContent: 'flex-start',
                    gap: '20px',
                    marginBottom: 0,
                    paddingBottom: 0
                }}>
                    {products.length === 0 ? (
                        <p style={{ textAlign: 'center', width: '100%' }}>No products found.</p>
                    ) : (
                        products.map(product => (
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
                                        height: '180px',
                                        objectFit: 'cover'
                                    }} 
                                />
                                <div style={{ textAlign: 'start', padding: '8px 0' }}>
                                    <span style={{ color: '#606063', fontSize: '12px' }}>{product.brand}</span>
                                    <h5 style={{ paddingTop: '5px', color: '#1a1a1a', fontSize: '14px', margin: 0 }}>{product.name}</h5>
                                    <div style={{ margin: '3px 0' }}>
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className="fas fa-star" style={{ fontSize: '11px', color: 'rgb(243, 181, 25)' }}></i>
                                        ))}
                                    </div>
                                    <h4 style={{ paddingTop: '5px', fontSize: '15px', fontWeight: '700', color: '#088178', margin: 0 }}>${product.price}</h4>
                                </div>
                                <a 
                                    href="/x`" 
                                    onClick={(e) => handleAddToCart(e, product)}
                                    style={{ 
                                        cursor: 'pointer',
                                        width: '36px',
                                        height: '36px',
                                        lineHeight: '36px',
                                        borderRadius: '50px',
                                        backgroundColor: '#088178',
                                        color: '#fff',
                                        position: 'absolute',
                                        bottom: '12px',
                                        right: '12px',
                                        textAlign: 'center',
                                        textDecoration: 'none',
                                        fontSize: '18px'
                                    }}
                                >
                                    🛒
                                </a>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Pagination - Minimal spacing */}
            <div style={{ textAlign: 'center', padding: '20px 0', marginTop: '10px' }}>
                <a href="#" style={{ textDecoration: 'none', backgroundColor: '#088178', padding: '10px 15px', borderRadius: '4px', color: '#fff', margin: '0 5px' }}>1</a>
                <a href="#" style={{ textDecoration: 'none', backgroundColor: '#088178', padding: '10px 15px', borderRadius: '4px', color: '#fff', margin: '0 5px' }}>2</a>
                <a href="#" style={{ textDecoration: 'none', backgroundColor: '#088178', padding: '10px 15px', borderRadius: '4px', color: '#fff', margin: '0 5px' }}>→</a>
            </div>
        </div>
    );
}

export default ShopPage;