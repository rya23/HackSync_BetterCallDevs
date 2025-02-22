import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TripPlanner from './pages/TripPlanner';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Itenary from './pages/Itenary';
import MapComponent from './components/TestMap';
import MyItineraries from './pages/MyItineraries';
import ItineraryDetails from './pages/ItineraryDetails';

// Protected Route component
const ProtectedRoute = ({ children }) => {
    return auth.currentUser ? children : <Navigate to="/" />;
};

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/trip-planner"
                    element={
                        <ProtectedRoute>
                            <TripPlanner />
                        </ProtectedRoute>
                    }
                />
                <Route path="/blog" element={<Blog />} />
                <Route path="blog/:id" element={<BlogPost />} />
                <Route
                    path="/itenary"
                    element={
                        <ProtectedRoute>
                            <Itenary />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-itineraries"
                    element={
                        <ProtectedRoute>
                            <MyItineraries />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/itinerary/:id"
                    element={
                        <ProtectedRoute>
                            <ItineraryDetails />
                        </ProtectedRoute>
                    }
                />
                <Route path="/map" element={<MapComponent />} />
            </Routes>
            <Footer />
        </Router>
    );
};

export default App;
