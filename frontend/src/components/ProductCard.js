import React from 'react';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product }) {
    const navigate = useNavigate();

    const handleAddToCart = async (e) => {
        e.preventDefault();  // Page refresh rokta hai
        e.stopPropagation(); // Product click rokta hai
        
        // Get or create session ID
        let sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('sessionId', sessionId);
        }
        
        console.log('Adding to cart:', { sessionId, productId: product.id });
        
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
            
            const data = await response.json();
            console.log('Response:', data);
            
            if (response.ok) {
                alert(`✅ ${product.name} added to cart!`);
                // Update cart count in header (optional)
                window.dispatchEvent(new Event('cartUpdated'));
            } else {
                alert('❌ Error: ' + JSON.stringify(data));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Failed to add to cart. Check console for details.');
        }
    };

    const handleProductClick = () => {
        navigate(`/product/${product.id}`);
    };

    return (
        <div className="pro" onClick={handleProductClick} style={{ cursor: 'pointer' }}>
            <img src={product.image} alt={product.name} />
            <div className="des">
                <span>{product.brand}</span>
                <h5>{product.name}</h5>
                <div className="star">
                    {[...Array(5)].map((_, i) => (
                        <i key={i} className="fas fa-star"></i>
                    ))}
                </div>
                <h4>${product.price}</h4>
            </div>
            <a 
                href="#" 
                onClick={handleAddToCart}
                style={{ cursor: 'pointer' }}
            >
                <i className="fal fa-shopping-cart cart"></i>
            </a>
        </div>
    );
}

export default ProductCard;