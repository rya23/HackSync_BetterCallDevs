import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import MapComponent from '../components/TestMap';
import EmailModal from '../components/EmailModal';
import { motion } from 'framer-motion';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 30, backgroundColor: '#ffffff' },
    section: { marginBottom: 20, padding: 15 },
    header: {
        fontSize: 24,
        marginBottom: 15,
        color: '#1a365d',
        textAlign: 'center',
    },
    text: { fontSize: 12, marginBottom: 8, color: '#4a5568' },
});

const TravelPDF = ({ data }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.header}>Travel Itinerary</Text>
                <Text style={styles.text}>Destination: {data.destination.name}</Text>
                <Text style={styles.text}>Duration: {data.duration} days</Text>
                <Text style={styles.text}>Travel Dates: {data.travel_dates}</Text>
            </View>
        </Page>
    </Document>
);

export default function ItineraryDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [itinerary, setItinerary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

    useEffect(() => {
        const fetchItinerary = async () => {
            try {
                const docRef = doc(db, 'itineraries', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    // Verify the itinerary belongs to the current user
                    if (data.userId !== auth.currentUser?.uid) {
                        navigate('/my-itineraries');
                        return;
                    }
                    setItinerary(data);
                } else {
                    navigate('/my-itineraries');
                }
            } catch (error) {
                console.error('Error fetching itinerary:', error);
                navigate('/my-itineraries');
            } finally {
                setLoading(false);
            }
        };

        fetchItinerary();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!itinerary) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Itinerary not found</h2>
                    <Link to="/my-itineraries" className="mt-4 text-blue-600 hover:underline">
                        Return to My Itineraries
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-8">
                    <Link to="/my-itineraries" className="text-gray-600 hover:text-gray-900 flex items-center gap-2 mb-4">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to My Itineraries
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Trip to {itinerary.destination.name}</h1>
                    <p className="text-gray-600">
                        {itinerary.duration} days • {itinerary.travel_dates}
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Itinerary Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {itinerary.itinerary.map((day) => (
                            <motion.div
                                key={day.day}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-lg p-6"
                            >
                                <h2 className="text-2xl font-semibold mb-4">Day {day.day}</h2>
                                {['morning', 'afternoon', 'evening'].map((timeOfDay) => (
                                    <div key={timeOfDay} className="mb-6 last:mb-0">
                                        <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h3 className="text-lg font-medium capitalize mb-2">
                                                    {timeOfDay}: {day[timeOfDay].activity}
                                                </h3>
                                                <p className="text-gray-600 mb-2">{day[timeOfDay].location.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    Meal:{' '}
                                                    {
                                                        day.meals[
                                                            timeOfDay === 'morning'
                                                                ? 'breakfast'
                                                                : timeOfDay === 'afternoon'
                                                                ? 'lunch'
                                                                : 'dinner'
                                                        ].name
                                                    }
                                                </p>
                                            </div>
                                            <span className="text-gray-500">
                                                {timeOfDay === 'morning'
                                                    ? '09:00 AM'
                                                    : timeOfDay === 'afternoon'
                                                    ? '02:00 PM'
                                                    : '07:00 PM'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        ))}
                    </div>

                    {/* Map and Actions */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="h-[400px]">
                                    <MapComponent itineraryData={itinerary} />
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <PDFDownloadLink
                                    document={<TravelPDF data={itinerary} />}
                                    fileName="travel_itinerary.pdf"
                                    className="w-full bg-black text-white text-center py-3 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
                                </PDFDownloadLink>

                                <button
                                    onClick={() => setIsEmailModalOpen(true)}
                                    className="w-full border-2 border-black text-black py-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Email Itinerary
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <EmailModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} itineraryData={itinerary} />
        </div>
    );
}
