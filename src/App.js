import logo from './logo.svg';
import './App.css';
import SideBar from "./component/SideBar";
import { Route, Routes } from 'react-router-dom';

// import {
//   AppBridgeProvider,
//   QueryProvider,
//   PolarisProvider,
// } from "./component/providers";

import { BrowserRouter } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreateNFT from './pages/CreateNFT';
import ManageNFTs from './pages/Manage-NFTs';
import ContactUs from './pages/Contact-us';
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';
import ImportNFT from './pages/ImportNFT';


function App() {
  return (
    <div className="App">
      {/* <PolarisProvider> */}
      <AuthProvider>
        <BrowserRouter>
          {/* <AppBridgeProvider> */}
          {/* <QueryProvider> */}
          <SideBar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/manage-nfts" element={<ManageNFTs />} />
            <Route path="/create-nft" element={<CreateNFT />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/import-nft" element={<ImportNFT />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          {/* </QueryProvider> */}
          {/* </AppBridgeProvider> */}
        </BrowserRouter>
      </AuthProvider>
      {/* </PolarisProvider> */}
    </div>
  );
}

export default App;
