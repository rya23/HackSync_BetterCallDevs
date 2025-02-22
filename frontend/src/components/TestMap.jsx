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
    console.log(itineraryData);

    // Get initial center from first day's morning activity
    const initialCenter = itineraryData?.itinerary[0]?.morning?.location?.coordinates
        ? [
              itineraryData.itinerary[0].morning.location.coordinates.latitude,
              itineraryData.itinerary[0].morning.location.coordinates.longitude,
          ]
        : [19.076, 72.8777]; // Default to Mumbai

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

                <JumpToMap center={initialCenter} />

                {itineraryData?.itinerary
                    .filter((day) => day.day === selectedDay)
                    .map((day) => {
                        const locations = [
                            { time: 'Morning', ...day.morning, meal: day.meals.breakfast },
                            { time: 'Afternoon', ...day.afternoon, meal: day.meals.lunch },
                            { time: 'Evening', ...day.evening, meal: day.meals.dinner },
                        ];

                        return locations.map((loc, index) => {
                            const position = [loc.location.coordinates.latitude, loc.location.coordinates.longitude];

                            return (
                                <Marker key={index} position={position}>
                                    <Popup>
                                        <strong>
                                            {loc.time}: {loc.activity}
                                        </strong>
                                        <br />
                                        Location: {loc.location.name}
                                        <br />
                                        Nearby Restaurant: {loc.meal.name}
                                    </Popup>
                                </Marker>
                            );
                        });
                    })}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
