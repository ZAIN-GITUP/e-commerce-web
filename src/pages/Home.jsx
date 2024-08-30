import { useEffect, useState } from 'react';
import { add } from '../Redux/Cartslice';
import { useDispatch, useSelector } from 'react-redux';
import { STATUSES, fetchproducts } from '../Redux/ProductSlice';
import { FaEye, FaShoppingCart } from 'react-icons/fa'; //using react-icons
 import close from "../assets/close.png"
 import winterbanner from '../assets/wintercollection.jpg';
 import "../../src/App.css";
import Footer from '../component/Footer';
const Home = () => {
    const dispatch = useDispatch();
    const { data: products, status } = useSelector((state) => state.product);
    const cartItems = useSelector((state) => state.cart);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [category, setCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showNavbar, setShowNavbar] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const itemsPerPage = 3;

    useEffect(() => {
        dispatch(fetchproducts());
    }, [dispatch]);

    useEffect(() => {
        setFilteredProducts(
            products.filter((product) =>
                product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (category ? product.category === category : true)
            )
        );
    }, [searchTerm, products, category]);

    const handleAdd = (product) => {
        dispatch(add(product));
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const paginatedProducts = category === '' 
        ? filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) 
        : filteredProducts;

    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

    if (status === STATUSES.Loading) {
        return <h2 className="font-bold m-16 text-center">Loading...</h2>;
    }

    return (
        <div className=" mobile bg-cyan-50 p-1   mx-auto">
              <div>
                {/* png  */}
                <img src={winterbanner} alt="Banner" className="w-full h-auto mb-0" />
            </div>
            <div className=" mobile bg-cyan-100 p-4   mx-auto">
            {!selectedProduct && (
                <div className="searchWrapper  mt-4  flex flex-col items-center">
                    {/* Search Bar */}
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border bg-cyan-50 text-cyan-600 p-2 mb-4 w-full max-w-md rounded"
                    />
                    {/* Category Buttons */}
                    <div className="categoryButtons flex flex-wrap justify-center gap-1">
                        <button
                            onClick={() => setCategory('')}
                            className={`bg-cyan-400 text-cyan-600 px-4 py-2 rounded ${category === '' ? 'bg-blue-700' : ''}`}
                        >
                            All
                        </button>
                        {['men\'s clothing', 'women\'s clothing', 'electronics', 'jewelery'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`bg-cyan-400 text-cyan-600 px-4 py-2 rounded ${category === cat ? 'bg-blue-700' : ''}`}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Single Product View */}
            {selectedProduct ? (
                <div className="singleProductCard bg-cyan-50 p-4 rounded-lg shadow-lg relative max-w-xs mx-auto md:max-w-md lg:max-w-lg">
                    <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-auto max-h-48 object-cover mb-4 rounded"/>
                    <h2 className="text-lg font-bold mb-2">{selectedProduct.category}</h2>
                    <h4 className="text-md mb-2">{selectedProduct.title}</h4>
                    <h5 className="text-sm font-semibold mb-4">${selectedProduct.price}</h5>
                    <p className="text-sm font-semibold mb-4  opacity-50 font-timmana">{selectedProduct.description}</p>
                    <button
                        className="bg-cyan-400 text-cyan-600 px-4 py-2 rounded"
                        onClick={() => handleAdd(selectedProduct)}
                    >
                        Add to Cart
                    </button>
                    <button
                        className="text rounded-full p-1 absolute -top-4 right-4 "
                        onClick={() => setSelectedProduct(null)}
                    >
                    <img  className ="w-6 h-6 " src={close} alt="" />
                    </button>
                </div>
            ) : (
                <>
                    {/* Product Cards */}
                    <div className="productsWrapper  -mt-6 grid grid-cols-1 custom:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {paginatedProducts.map((product) => (
    <div
      className="card relative border p-2 rounded-lg bg-cyan-50 shadow-lg group hover:shadow-xl transition-shadow duration-300"
      key={product.id}
    >
      <img src={product.image} alt={product.title} className="w-full h-auto max-h-48 object-cover mb-4 rounded" />
      <div>
        <h2 className="text-lg font-bold mb-2">{product.category}</h2>
        <h4 className="text-md mb-2">{product.title}</h4>
        <h5 className="text-sm font-semibold mb-4">${product.price}</h5>
      </div>
      <div className="absolute rounded-lg flex flex-col top-2 right-2 p-2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          className="bg-cyan-300 text-black font-extrabold p-2 rounded-full"
          onClick={() => setSelectedProduct(product)}
        >
          <FaEye />
        </button>
        <button
          className="bg-cyan-300 font-extrabold p-2 text-black rounded-full"
          onClick={() => handleAdd(product)}
        >
          +
        </button>
      </div>
    </div>
  ))}
</div>


                    
                    {/* Pagination */}
                    {category === '' && (
                        <div className="pagination   custom:grid-cols-2 sx:grid-cols-7  md:grid-cols-7 sm:grid-col-3 mt-4  justify-center space-x-2">
                            {Array.from({ length: Math.ceil(filteredProducts.length / itemsPerPage) }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={` btns px-4 py-2 border m-2 rounded-full ${currentPage === index + 1 ? 'bg-cyan-400 text-white' : 'bg-white'}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </>
                
            )}
            <div>
            <Footer/>
            </div>
        </div>
        </div>
    );
};

export default Home;
