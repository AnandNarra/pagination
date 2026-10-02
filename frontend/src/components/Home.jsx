import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/users';

const Home = () => {
  const [user, setUser] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [productData, setProductData] = useState({ name: '', description: '', price: '' });
  const [productStatus, setProductStatus] = useState({ loading: false, error: '', success: '' });
  const navigate = useNavigate();

  // Get products with button preves and next buttons
  // const [data, setData] = useState(null);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [limit] = useState(5);


  // infinite/scroll pagination, like LinkedIn:

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef(null);


  // pagination prevs and next button 

  // // const getFetchedProducts = async () =>{

  //   // try {

  //      const response  = await axios.get(`${API_URL}/getTotalProducts?page=${currentPage}&limit=${limit}`, {

  //       withCredentials: true
  //      })

  //      console.log(response)
  //      setData(response.data)
  //   // } catch (error) {
  //   console.log(error)
  //   // }

  // // }


  const getFetchedProducts = async () => {

    try {

      setLoading(true)

      const response = await axios.get(`${API_URL}/getTotalProducts?page=${currentPage}&limit=${limit}`, {
        withCredentials: true
      })
      const newProducts = response.data.products;

      setProducts((prevProducts) => [
        ...prevProducts,
        ...newProducts
      ]);

      setTotalPages(response.data.pagination.totalPages);

    } catch (error) {
      console.log(error.message)
    } finally {
      setLoading(false);
    }

  }

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }

    // getFetchedProducts();
  }, [navigate]);

  // Get products with button preves and next buttons

  // useEffect(() => {
  //   getFetchedProducts();
  // }, [currentPage]);



  // infinite/scroll pagination, like LinkedIn: useEffect

  useEffect(() => {

    const observer = new IntersectionObserver(
      (entries) => {

        if (
          entries[0].isIntersecting &&
          !loading &&
          currentPage < totalPages
        ) {
          setCurrentPage((prevPage) => prevPage + 1);
        }

      },
      {
        threshold: 1
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };

  }, [loading, currentPage, totalPages]);

  useEffect(() => {
    getFetchedProducts();
  }, [currentPage]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleProductChange = (e) => {
    setProductData({ ...productData, [e.target.id]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setProductStatus({ loading: true, error: '', success: '' });

    try {
      await axios.post(`${API_URL}/addProduct`, {
        ...productData,
        price: Number(productData.price)
      }, {
        withCredentials: true // in case cookies/sessions are used later
      });
      setProductStatus({ loading: false, error: '', success: 'Product added successfully!' });
      setProductData({ name: '', description: '', price: '' });
      setTimeout(() => setShowProductModal(false), 2000);
    } catch (err) {
      setProductStatus({
        loading: false,
        error: err.response?.data?.message || 'Failed to add product',
        success: ''
      });
    }
  };

  if (!user) return null; // Or a loading spinner

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="logo">My App</div>
        <div className="nav-actions">
          <button onClick={() => setShowProductModal(true)} className="add-product-btn">
            + Add Product
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Sign Out
          </button>
        </div>
      </nav>


      <div>
        <h1>Fetched Data</h1>
        <div>

          {/* pagination for prves and next button */}
          {/* {data?.products ? (
            data.products.map((item, index) => (
              <div key={item._id || index} className="user-details" style={{ marginTop: '1rem' }}>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p><strong>${item.price}</strong></p>
              </div>
            ))
          ) : (
            <p>Loading products...</p>
          )} */}



          {products.length > 0 ? (
            products.map((item, index) => (
              <div
                key={item._id || index}
                className="user-details"
                style={{ marginTop: '1rem' }}
              >
                <h3>{item.name}</h3>

                <p>{item.description}</p>

                <p>
                  <strong>${item.price}</strong>
                </p>
              </div>
            ))
          ) : (
            <p>Loading products...</p>
          )}
        </div>
      </div>


      {/* pgation for prves and next nutton */}
      {/* {data?.pagination && (
        <div style={{ marginTop: "2rem" }}>

          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span style={{ margin: "0 1rem" }}>
            Page {data.pagination.currentPage} of{" "}
            {data.pagination.totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={
              currentPage === data.pagination.totalPages
            }
          >
            Next
          </button>

        </div>
      )} */}


      {/* Infinite scroll trigger */}
      <div ref={observerRef} style={{ height: "20px" }} />

      {loading && (
        <p style={{ textAlign: "center" }}>
          Loading more products...
        </p>
      )}

      {currentPage >= totalPages && products.length > 0 && (
        <p style={{ textAlign: "center" }}>
          No more products
        </p>
      )}



      {/* Add Product Modal */}
      {showProductModal && (
        <div className="modal-overlay">
          <div className="modal-content auth-card">
            <button className="close-btn" onClick={() => setShowProductModal(false)}>&times;</button>
            <h2>Add New Product</h2>

            {productStatus.error && <div className="auth-error">{productStatus.error}</div>}
            {productStatus.success && <div className="auth-success">{productStatus.success}</div>}

            <form onSubmit={handleAddProduct} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Product Name</label>
                <input
                  type="text"
                  id="name"
                  value={productData.name}
                  onChange={handleProductChange}
                  placeholder="e.g. Wireless Headphones"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  id="description"
                  value={productData.description}
                  onChange={handleProductChange}
                  placeholder="Short description of the product"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price ($)</label>
                <input
                  type="number"
                  id="price"
                  min="0"
                  step="0.01"
                  value={productData.price}
                  onChange={handleProductChange}
                  placeholder="29.99"
                  required
                />
              </div>

              <button type="submit" className="auth-button" disabled={productStatus.loading}>
                {productStatus.loading ? 'Adding...' : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
