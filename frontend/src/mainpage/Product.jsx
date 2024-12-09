// import { Link } from "react-router-dom";
// import Rating from "./Rating";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { useContext } from "react";
// import { Store } from "../Store";

// function Product(props) {
//   const { product } = props;

//   const { state, dispatch: ctxDispatch } = useContext(Store);
//   const {
//     cart: { cartItems },
//   } = state;

//   const addToCartHandler = async () => {
//     const existItem = cartItems.find((x) => x._id === product._id);
//     const quantity = existItem ? existItem.quantity + 1 : 1;
//     const { data } = await axios.get(`/api/product/${product._id}`);

//     if (data.countInStock < quantity) {
//       toast.error("Sorry, product is out of stock");
//       return;
//     }

//     ctxDispatch({
//       type: "CART_ADD_ITEM",
//       payload: { ...product, quantity },
//     });

//     console.log("Product added to cart:", { ...product, quantity }); // Log added product
//     toast.success("Product Added To Cart");
//   };

//   return (
//     <>
//       <div className="card w-full max-w-sm rounded-lg shadow-md border border-gray-200">
//         <Link to={`/product/${product.slug}`}>
//           <img
//             src={product.image}
//             className="w-full h-48 object-cover rounded-t-lg"
//             alt={product.name}
//           />
//         </Link>
//         <div className="p-4">
//           <Link to={`/product/${product.slug}`}>
//             <h2 className="text-lg font-semibold">{product.name}</h2>
//           </Link>
//           <Rating rating={product.rating} numReviews={product.numReviews} />
//           <p className="text-lg font-bold">₦{product.price}</p>
//           {/* <p className="text-sm text-gray-500 mt-1">
//             Category:{" "}
//             {product.category.charAt(0).toUpperCase() +
//               product.category.slice(1)}
//           </p> */}
//           <p className="text-sm text-gray-600">{product.description}</p>
//           {product.countInStock === 0 ? (
//             <button
//               className="w-full mt-4 py-2 bg-gray-300 text-gray-700 rounded-md"
//               disabled
//             >
//               Out of stock
//             </button>
//           ) : (
//             <button
//               onClick={addToCartHandler}
//               className="w-full mt-4 py-2 bg-amber-500 text-white rounded-md hover:bg-black transition"
//             >
//               Add to cart
//             </button>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// export default Product;



import { Link } from "react-router-dom";
import Rating from "./Rating";
import toast from "react-hot-toast";
import axios from "axios";
import { useContext } from "react";
import { Store } from "../Store";

function Product(props) {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async () => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/product/${product._id}`);

    if (data.countInStock < quantity) {
      toast.error("Sorry, product is out of stock");
      return;
    }

    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });

    console.log("Product added to cart:", { ...product, quantity }); // Log added product
    toast.success("Product Added To Cart");
  };

  return (
    <div className="card w-full rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow">
      <Link to={`/product/${product.slug}`}>
        <div className="relative pt-[100%]">
          <img
            src={product.image}
            className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg"
            alt={product.name}
          />
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.slug}`}>
          <h2 className="text-sm font-medium line-clamp-2 mb-1 hover:text-amber-500">
            {product.name}
          </h2>
        </Link>
        <div className="mb-1">
          <Rating rating={product.rating} numReviews={product.numReviews} />
        </div>
        <p className="text-lg font-bold text-amber-500">₦{product.price}</p>
        <p className="text-xs text-gray-600 line-clamp-2 mb-3">{product.description}</p>
        {product.countInStock === 0 ? (
          <button
            className="w-full py-2 bg-gray-300 text-gray-700 rounded-md"
            disabled
          >
            Out of stock
          </button>
        ) : (
          <button
            onClick={addToCartHandler}
            className="w-full py-2 bg-amber-500 text-white rounded-md hover:bg-black transition"
          >
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
}

export default Product;

