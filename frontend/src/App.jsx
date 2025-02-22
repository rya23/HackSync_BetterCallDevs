import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TripPlanner from './pages/TripPlanner';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Itenary from './pages/Itenary';
const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path='/trip-planner' element={<TripPlanner/>}/>
                <Route path='/blog' element={<Blog/>}/>
                <Route path='blog/:id' element={<BlogPost/>}/>
                <Route path='/itenary' element={<Itenary/>}/>
            </Routes>
          <Footer/>
        </Router>
        
    );
};

export default App;