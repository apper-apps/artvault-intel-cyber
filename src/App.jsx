import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from '@/components/organisms/Header';
import ArtworkGallery from '@/components/pages/ArtworkGallery';
import AddArtwork from '@/components/pages/AddArtwork';
import EditArtwork from '@/components/pages/EditArtwork';
import Collections from '@/components/pages/Collections';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-8">
        <Routes>
          <Route path="/" element={<ArtworkGallery />} />
          <Route path="/add" element={<AddArtwork />} />
          <Route path="/edit/:id" element={<EditArtwork />} />
          <Route path="/collections" element={<Collections />} />
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
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default App;