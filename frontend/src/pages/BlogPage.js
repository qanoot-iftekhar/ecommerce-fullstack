import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BlogPage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/blogs/')
      .then(res => setBlogs(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <section id="page-header" className="blog-header">
        <h2>#readmore</h2>
        <p>read all case studies about our product</p>
      </section>

      <section id="blog">
        {blogs.map((blog, index) => (
          <div className="blog-box" key={blog.id}>
            <div className="blog-img">
              <img src={blog.image} alt="" />
            </div>
            <div className="blog-details">
              <h4>{blog.title}</h4>
              <p>{blog.description}</p>
              <a href="#">continue reading</a>
            </div>
            <h1>{blog.date}</h1>
          </div>
        ))}
      </section>

      <section id="pagination" className="section-p1">
        <a href="#">1</a>
        <a href="#">2</a>
        <a href="#"><i className="fal fa-long-arrow-alt-right"></i></a>
      </section>
    </div>
  );
}

export default BlogPage;