import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom hook to jump to specific location
const JumpToMap = ({ center }) => {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.flyTo(center, 13, { animate: true, duration: 1 });
        }
    }, [map, center]);

    return null;
};

const MapComponent = ({ itineraryData }) => {
    const [selectedDay, setSelectedDay] = useState(1);
    
    // Get initial center from first day's morning activity
    const initialCenter = itineraryData?.itinerary[0]?.morning?.location?.coordinates
        ? [
              itineraryData.itinerary[0].morning.location.coordinates.latitude,
              itineraryData.itinerary[0].morning.location.coordinates.longitude,
          ]
        : [19.076, 72.8777]; // Default to Mumbai

    // Helper function to get locations with coordinates for the selected day
    const getDayLocations = (day) => {
        const locations = [];
        
        // Add activity locations if they exist
        ['morning', 'afternoon', 'evening'].forEach(timeOfDay => {
            if (day[timeOfDay]?.location?.coordinates) {
                locations.push({
                    ...day[timeOfDay].location,
                    title: `${timeOfDay}: ${day[timeOfDay].activity}`,
                    time: timeOfDay
                });
            }
        });

        // Add meal locations
        ['breakfast', 'lunch', 'dinner'].forEach(meal => {
            if (day.meals[meal]?.coordinates) {
                locations.push({
                    name: day.meals[meal].name,
                    coordinates: day.meals[meal].coordinates,
                    title: `${meal}: ${day.meals[meal].name}`,
                    time: meal
                });
            }
        });

        return locations;
    };

    const selectedDayData = itineraryData?.itinerary.find(day => day.day === selectedDay);
    const locations = selectedDayData ? getDayLocations(selectedDayData) : [];

    return (
        <div className="h-full">
            {/* Day selector */}
            <div className="mb-4">
                <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(Number(e.target.value))}
                    className="p-2 border rounded"
                >
                    {itineraryData?.itinerary.map((day) => (
                        <option key={day.day} value={day.day}>
                            Day {day.day}
                        </option>
                    ))}
                </select>
            </div>

            <MapContainer center={initialCenter} zoom={13} style={{ height: 'calc(100vh - 200px)', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {locations.map((loc, index) => (
                    <Marker
                        key={index}
                        position={[loc.coordinates.latitude, loc.coordinates.longitude]}
                    >
                        <Popup>
                            <div>
                                <h3 className="font-bold">{loc.title}</h3>
                                <p>{loc.name}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
