// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function SearchBox() {
//   const navigate = useNavigate();
//   const [query, setQuery] = useState('');
  
//   const submitHandler = (e) => {
//     e.preventDefault();
//     navigate(query ? `/search/?query=${query}` : '/search');
//   };

//   return (
    
//     <form className="flex" onSubmit={submitHandler}>
//       <div className="form-control w-full max-w-6xl">
//         <input
//           type="text"
//           name="q"
//           id="q"
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search products..."
//           aria-label="Search Products"
//           className="input input-bordered "
//         />
//       </div>
//       <button type="submit" className="btn btn-outline ml-2">
//         <i className="fas fa-search"></i>
//       </button>
//     </form>
//   );
// }


// export default function SearchBox() {
//   const navigate = useNavigate();
//   const [query, setQuery] = useState('');
 
//   const submitHandler = (e) => {
//     e.preventDefault();
//     navigate(query ? `/search/?query=${query}` : '/search');
//   };

//   return (
//     <form className="flex w-full max-w-2xl" onSubmit={submitHandler}>
//       <div className="form-control flex-1">
//         <input
//           type="text"
//           name="q"
//           id="q"
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search products..."
//           aria-label="Search Products"
//           className="input input-bordered w-full"
//         />
//       </div>
//       <button type="submit" className="btn btn-outline ml-2">
//         <i className="fas fa-search"></i>
//       </button>
//     </form>
//   );
// }


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
 
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : '/search');
  };

  return (
    <form className="flex w-full max-w-4xl" onSubmit={submitHandler}>
      <div className="form-control flex-1">
        <input
          type="text"
          name="q"
          id="q"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          aria-label="Search Products"
          className="input input-bordered w-full"
        />
      </div>
      <button type="submit" className="btn btn-outline ml-2">
        <i className="fas fa-search"></i>
      </button>
    </form>
  );
}
