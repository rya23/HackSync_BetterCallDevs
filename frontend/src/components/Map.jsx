import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';

const MapScreen = () => {
    const mapTilerAPIKey = '9ws7zL8sYfzoK6c45hVV'; // Replace with your MapTiler API key
    const [showIncidents, setShowIncidents] = useState(true);
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(false);

    // Define bounds for Mumbai region (approximately)
    const southWest = [18.8, 72.7]; // Bottom-left coordinates
    const northEast = [19.3, 73.0]; // Top-right coordinates
    const bounds = [southWest, northEast];

    useEffect(() => {
        const fetchIncidents = async () => {
            setLoading(true);
            try {
                // const response = await axios.get(
                //   "https://qd1v2drq-8000.inc1.devtunnels.ms/api/posts/get-post"
                // );

                // const data = response.data.map(({ latitude, longitude, ...rest }) => ({
                //   latitude,
                //   longitude,
                //   ...rest,
                // }));

                const dummyIncidents = [
                    {
                        latitude: 19.076,
                        longitude: 72.8777,
                        type: 'Dummy Incident 1',
                        description: 'Description for dummy incident 1',
                    },
                ];

                setIncidents([...dummyIncidents]);
            } catch (error) {
                console.error('Error fetching incidents:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchIncidents();
    }, []);

    return (
        // <div className="relative w-full h-screen">
        //     {/* Map */}
        //     <MapContainer
        //         center={[19.076, 72.8777]}
        //         zoom={13}
        //         className="w-full h-full rounded-lg shadow-lg"
        //         maxBounds={bounds}
        //         maxZoom={18}
        //         minZoom={11}
        //         boundsOptions={{ padding: [50, 50] }}
        //     >
        //         {/* Option 1: Use OpenStreetMap (free, no API key needed) */}
        //         {/* <TileLayer
        //             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        //             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        //         /> */}

        //         {/* Option 2: If you want to use MapTiler, use this instead: */}
        //         <TileLayer
        //             url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${mapTilerAPIKey}`}
        //             attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        //         />

        //         {showIncidents &&
        //             incidents.map((incident, index) => (
        //                 <Marker
        //                     key={index}
        //                     position={[incident.latitude, incident.longitude]}
        //                     icon={L.icon({
        //                         iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png', // Example marker icon
        //                         iconSize: [25, 41],
        //                         iconAnchor: [12, 41],
        //                     })}
        //                 >
        //                     <Popup>
        //                         <strong>{incident.type}</strong>
        //                         <br />
        //                         {incident.description}
        //                     </Popup>
        //                 </Marker>
        //             ))}
        //     </MapContainer>

        //     {/* Buttons */}
        //     <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 space-x-4">
        //         <button
        //             onClick={() => setShowIncidents(!showIncidents)}
        //             className={`px-4 py-2 text-white rounded-lg shadow-md ${
        //                 showIncidents ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
        //             }`}
        //         >
        //             {showIncidents ? 'Hide Incidents' : 'Show Incidents'}
        //         </button>
        //     </div>

        //     {/* Loading Spinner */}
        //     {loading && (
        //         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        //             <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        //         </div>
        //     )}
        // </div>
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[19.076, 72.8777]}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default MapScreen;
