import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/context/AuthContext";
import Login from "@/components/pages/Login";
import Register from "@/components/pages/Register";
import Profile from "@/components/pages/Profile";
import Header from "@/components/organisms/Header";
import AddArtwork from "@/components/pages/AddArtwork";
import ArtworkGallery from "@/components/pages/ArtworkGallery";
import EditArtwork from "@/components/pages/EditArtwork";
import Collections from "@/components/pages/Collections";
function App() {
  return (
    <AuthProvider>
    <div className="min-h-screen bg-background">
        <Header />
        <main className="pb-8">
            <Routes>
                <Route path="/" element={<ArtworkGallery />} />
                <Route path="/add" element={<AddArtwork />} />
                <Route path="/edit/:id" element={<EditArtwork />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </main>
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            style={{
                zIndex: 9999
            }} />
    </div></AuthProvider>
  );
}

export default App;