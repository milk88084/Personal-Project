import { useFormInput } from "@/utils/hooks/useFormInput";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useLoginState } from "../utils/zustand";
import "leaflet/dist/leaflet.css";

const EditLocationSearch = ({ location }) => {
  const { setLocationSearch } = useLoginState();
  const [locationState, setLocationState] = useState();
  const storyLocation = useFormInput(location);
  const locationArray = [];

  const handleSearch = async () => {
    if (!storyLocation.value) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      storyLocation.value
    )}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.length > 0) {
        const { name, lat, lon } = data[0];
        locationArray.push({ name, lat, lon });
        setLocationState({ name, lat, lon });
        setLocationSearch(locationArray);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    storyLocation.setValue(location);
  }, [location, storyLocation]);

  return (
    <div>
      <input
        type="text"
        value={storyLocation.value}
        onChange={storyLocation.onChange}
        placeholder="請輸入地點，如：花蓮市美崙"
      />
      <button
        className="bg-gray-800 p-1 rounded-md  text-white hover:bg-red-900  mr-6 ml-2"
        onClick={handleSearch}
      >
        搜尋
      </button>

      {locationState &&
        !isNaN(locationState.lat) &&
        !isNaN(locationState.lon) && (
          <MapContainer
            center={[locationState.lat, locationState.lon]}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[locationState.lat, locationState.lon]}>
              <Popup>{storyLocation.value}</Popup>
            </Marker>
          </MapContainer>
        )}
    </div>
  );
};
export default EditLocationSearch;
