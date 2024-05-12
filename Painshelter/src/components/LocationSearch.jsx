import { useFormInput } from "../utils/hooks/useFormInput";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useLoginState } from "../utils/zustand";
import styled from "styled-components";
import icon from "../assets/img/logoImg3.png";
import { Search } from "lucide-react";
import Buttons from "./Buttons";

const Input = styled.div`
  width: 100%;
  border-radius: 7px;
  display: flex;
  justify-content: center;
  align-items: center;

  input {
    border: 2px solid black;
    border-radius: 7px;
    padding-left: 10px;
  }
  button {
    margin-left: 10px;
    margin-bottom: 15px;
  }
`;

const painIcon = L.icon({
  iconUrl: icon,
  iconSize: [35, 45], //icon大小
  iconAnchor: [25, 20], //圖標中心點位置
  popupAnchor: [0, 0], //popup視窗位置
});

const LocationSearch = () => {
  const { locationSerach, setLocationSearch } = useLoginState();
  const [locationState, setLocationState] = useState();
  const storyLocation = useFormInput();
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

  console.log(locationSerach);

  return (
    <div>
      <Input>
        <input
          type="text"
          value={storyLocation.value}
          onChange={storyLocation.onChange}
          placeholder="請輸入地點，如：花蓮市美崙"
        />
        <Buttons
          onClick={handleSearch}
          type="button"
          icon={<Search />}
          title={"搜尋地點"}
        />
      </Input>

      {locationState &&
        !isNaN(locationState.lat) &&
        !isNaN(locationState.lon) && (
          <MapContainer
            center={[locationState.lat, locationState.lon]}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={[locationState.lat, locationState.lon]}
              icon={painIcon}
            >
              <Popup>{storyLocation.value}</Popup>
            </Marker>
          </MapContainer>
        )}
    </div>
  );
};
export default LocationSearch;
