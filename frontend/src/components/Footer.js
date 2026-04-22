import React from 'react';

function Footer() {
  return (
    <footer className="section-p1">
      <div className="col">
        <img className="logo" src="img/logo.png" alt="" />
        <h4>Contact</h4>
        <p><strong>Address: </strong> 525 Instambu Road, Street 25, London</p>
        <p><strong>Phone:</strong> 7805889587 / (91) 7859030603</p>
        <p><strong>Hour:</strong> 10:00 - 18:00, Mon - Sat</p>
        <div className="Follow">
          <h4>Follow Us</h4>
          <div className="icon">
            <i className="fab fa-facebook-f"></i>
            <i className="fab fa-twitter"></i>
            <i className="fab fa-instagram"></i>
            <i className="fab fa-pinterest-p"></i>
            <i className="fab fa-youtube"></i>
          </div>
        </div>
      </div>
      <div className="col">
        <h4>About</h4>
        <a href="#">About Us</a>
        <a href="#">Delivery Information</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms & conditions</a>
        <a href="#">Contact Us</a>
      </div>
      <div className="col">
        <h4>My Account</h4>
        <a href="#">Sign In</a>
        <a href="#">View Cart</a>
        <a href="#">My Wishlist</a>
        <a href="#">Track My Order</a>
        <a href="#">Help</a>
      </div>
      <div className="col install">
        <h4>Install App</h4>
        <p>From App Store Or Google Play</p>
        <div className="row">
          <img src="" alt="" />
          <img src="" alt="" />
        </div>
        <p>Secured Payment Gateways</p>
        <img src="" alt="" />
      </div>
      <div className="copyright">
        <p>© 2024, Tech525 etc - HTML CSS Ecommerce Template</p>
      </div>
    </footer>
  );
}

export default Footer;