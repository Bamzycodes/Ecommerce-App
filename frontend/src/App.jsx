
import { Route, Routes} from 'react-router-dom'
import Header from './headers/Header';
import CartScreen from './screen/CartSreen';
import HomeSreen from "./screen/HomeSreen";
import PaymentMethodScreen from './screen/PaymentMethodScreen';
import PlaceOrderScreen from './screen/PlaceOrderScreen';
import ProductSreen from "./screen/ProductSreen";
import ShippingAddressScreen from './screen/ShippingAddressScreen';
import SigninScreen from './screen/SigninScreen';
import SignupScreen from './screen/SignupScreen';
import AdminProductScreen from './screen/AdminProductSreen';
import AdminUserScreen from './screen/AdminUserSreen';
import AdminOrderSreen from './screen/AdminOrderSreen';
import UserEditScreen from './screen/UserEditScreen';
import AdminProductCreate from './screen/AdminProductCreate';
import ProfileScreen from './screen/ProfileScreen';
import { Toaster } from "react-hot-toast";
import OrderScreen from './screen/OrderScreen';
import OrderHistoryScreen from './screen/OrderHistoryScreen';
import SearchScreen from './screen/SearchScreen';
import AdminDashboardScreen from './screen/AdminDashboardSreen';
import ForgotPasswordScreen from './screen/ForgotPassword';
import ResetPasswordScreen from './screen/ResetPassowrd';
import AdministratorScreen from './screen/AdministratorScreen';
import ProtectedAdminRoute from './mainpage/ProtectedAdminRoute';


function App() {
  
    return (
<>
  <div className="site-container">
    <Toaster />

    <Header />

    <main>
      <div className="mt-5 container mx-auto">
        <Routes>
          <Route path="/product/:slug" element={<ProductSreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/" element={<HomeSreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/search" element={<SearchScreen />} />
          <Route
  path="/admin"
  element={
    <ProtectedAdminRoute>
      <AdministratorScreen />
    </ProtectedAdminRoute>
  }
>
  <Route index element={<AdminDashboardScreen />} />
  <Route path="products" element={<AdminProductScreen />} />
  <Route path="orders" element={<AdminOrderSreen />} />
  <Route path="users" element={<AdminUserScreen />} />
</Route>

          <Route path="/signin" element={<SigninScreen />} />
          <Route path="/shipping" element={<ShippingAddressScreen />} />
          <Route path="/placeorder" element={<PlaceOrderScreen />} />
          <Route path="/payment" element={<PaymentMethodScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/createproduct" element={<AdminProductCreate />} />
          <Route path="/order/:id" element={<OrderScreen />} />
          <Route path="/orderhistory" element={<OrderHistoryScreen />} />
          <Route path="/admin/user/:id" element={<UserEditScreen />} />
        </Routes>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-8 text-center">
              <p>© 2023 E-STOCKS. All rights reserved.</p>
            </div>
    </main>
  </div>
</>

    )

  }

export default App
