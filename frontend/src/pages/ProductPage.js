import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/products/${id}/`);
      const data = await response.json();
      setProduct(data);
      setMainImage(data.image);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddToCart = async () => {
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
          quantity: parseInt(quantity)
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ ${product.name} added to cart!`);
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        alert('❌ Error: ' + JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Failed to add to cart. Check console for details.');
    }
  };

  if (!product) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;

  return (
    <div>
      <section id="prodetails" className="section-p1">
        <div className="single-pro-image">
          <img src={mainImage} width="100%" id="MainImg" alt="" />
          <div className="small-img-group">
            {[1, 2, 3, 4].map(i => (
              <div className="small-img-col" key={i}>
                <img
                  src={product.image}
                  width="100%"
                  className="small-img"
                  alt=""
                  onClick={() => setMainImage(product.image)}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="single-pro-details">
          <h6>Home / T-Shirt</h6>
          <h4>{product.name}</h4>
          <h2>${product.price}</h2>
          <select>
            <option>Select Size</option>
            <option>XL</option>
            <option>XXL</option>
            <option>Small</option>
            <option>Large</option>
          </select>
          <input 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)} 
            min="1"
          />
          <button className="normal" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <h4>Product Details</h4>
          <span>{product.description}</span>
        </div>
      </section>
    </div>
  );
}

export default ProductPage;