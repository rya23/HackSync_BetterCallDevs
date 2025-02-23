import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TripPlanner from './pages/TripPlanner';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Itenary from './pages/Itenary';
import MapComponent from './components/TestMap';
import Intro from './components/Intro';

const App = () => {
    const [showIntro, setShowIntro] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Start fade out after 3 seconds
        const fadeTimer = setTimeout(() => {
            setFadeOut(true);
        }, 4000);

        // Hide intro after fade animation
        const hideTimer = setTimeout(() => {
            setShowIntro(false);
        }, 4000); // 3000ms + 500ms for fade animation

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    return (
        <div className="app-container">
            {showIntro && (
                <div className={`intro-wrapper ${fadeOut ? 'fade-out' : ''}`}>
                    <Intro />
                </div>
            )}
            <div className={`main-content ${!showIntro ? 'fade-in' : 'hidden'}`}>
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/trip-planner" element={<TripPlanner />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="blog/:id" element={<BlogPost />} />
                        <Route path="/itenary" element={<Itenary />} />
                        <Route path="/map" element={<MapComponent />} />
                    </Routes>
                    <Footer />
                </Router>
            </div>
        </div>
    );
};

export default App;
