





import { useEffect, useReducer, useRef, useState } from "react";
import axios from "axios";
import Product from "../mainpage/Product";
import LoadingBox from "../mainpage/LoadingBox";
import MessageBox from "../mainpage/MessageBox";
import download from "../assets/images/shopping2.avif";
import download1 from "../assets/images/shopping.avif";
import download2 from "../assets/images/shopping1.avif";

const banners = [
  {
    image: download,
    title: "Discover Amazing Deals",
    subtitle: "Up to 70% Off on Premium Products"
  },
  {
    image: download1,
    title: "Shop the Latest Trends",
    subtitle: "Free Shipping on Orders Over ₦50,000"
  },
  {
    image: download2,
    title: "New Arrivals Daily",
    subtitle: "Exclusive Collections Just for You"
  }
];

const reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true };
        case "FETCH_SUCCESS":
            return { ...state, products: action.payload, loading: false };
        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

function HomeScreen() {
    const [{ loading, error, products }, dispatch] = useReducer(reducer, {
        products: [],
        loading: true,
        error: "",
    });
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [currentSlide, setCurrentSlide] = useState(0);
    const featuredProductsRef = useRef(null);
    
    // Add this scroll function
    const scrollToProducts = () => {
        featuredProductsRef.current?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get("/api/product/getProduct");
                dispatch({ type: "FETCH_SUCCESS", payload: result.data });
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: err.message });
            }
        };
        fetchData();
    }, []);

    const categories = ["all", "electronics", "clothing", "books", "accessories", "beauty", "other"];
    
    const filteredProducts = selectedCategory === "all"
        ? products
        : products.filter(product => product.category === selectedCategory);

    return (
        <div className="container mx-auto">
            <div className="relative w-full h-96 mb-8 overflow-hidden">
                <div 
                    className="flex transition-transform duration-500 ease-out h-full"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {banners.map((banner, index) => (
                        <div key={index} className="w-full h-full flex-shrink-0 relative">
                            <img
                                src={banner.image}
                                alt={banner.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white">
                            <h2 className="text-2xl md:text-4xl font-bold mb-4">{banner.title}</h2>
<p className="text-lg md:text-xl">{banner.subtitle}</p>

                                <button 
    className="mt-6 px-8 py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition"
    onClick={scrollToProducts}
>
    Shop Now
</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                                currentSlide === index ? 'bg-amber-500' : 'bg-white'
                            }`}
                        />
                    ))}
                </div>

                <button
  onClick={() => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)}
  className="btn btn-circle absolute left-4 top-1/2 transform -translate-y-1/2 p-2 md:p-3"
>
  ❮
</button>
<button
  onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
  className="btn btn-circle absolute right-4 top-1/2 transform -translate-y-1/2 p-2 md:p-3"
>
  ❯
</button>


            </div>

            <div className="p-4">
                {/* Rest of your existing code */}
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
  {categories.map((category) => (
    <button
      key={category}
      onClick={() => setSelectedCategory(category)}
      className={`px-3 py-1 md:px-4 md:py-2 rounded-full ${
        selectedCategory === category
          ? "bg-amber-500 text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      } transition-colors text-sm md:text-base`}
    >
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </button>
  ))}
</div>


                <main ref={featuredProductsRef}>
    <h1 className="text-2xl font-bold mb-4 justify-center text-center">
        {selectedCategory === "all"
            ? "Featured Products"
            : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products`}
    </h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">

                        {loading ? (
                            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center text-center min-h-[50vh]">
                                <LoadingBox />
                            </div>
                        ) : error ? (
                            <MessageBox variant="danger">{error}</MessageBox>
                        ) : (
                            filteredProducts.map((product) => (
                                <div key={product.slug} className="flex justify-center">
                                    <Product product={product}></Product>
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default HomeScreen;


  