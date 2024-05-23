import { useEffect, useState } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase/firebase.jsx";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Modal from "./Modal.jsx";
import { useLoginState } from "@/utils/zustand.js";
import icon from "@/assets/img/logoImg3.png";
import { MapPin } from "lucide-react";
import styled from "styled-components";
import L from "leaflet";
import { toastAlert } from "@/utils/toast.js";
import { ToastContainer } from "react-toastify";

const painIcon = L.icon({
  iconUrl: icon,
  iconSize: [24, 32],
  iconAnchor: [10, 20],
  popupAnchor: [0, 0],
});

//#region
const TopSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BottomSection = styled.div`
  display: flex;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;

  button:hover {
    transform: scale(1.2);
    color: #021166;
  }

  button:active {
    transform: scale(0.95);
    transition: box-shadow 0.2s;
  }
`;
//#endregion

const PostsLocation = () => {
  const [locations, setLocations] = useState([]);
  const [titles, setTitles] = useState([]);
  const [clickTitle, setClickTitle] = useState("");
  const center = [23.604799, 120.7976256];
  const { showModal } = useLoginState();

  useEffect(() => {
    async function getStories() {
      try {
        const data = collection(db, "posts");
        const q = query(data);
        const querySnapshot = await getDocs(q);
        const storyList = querySnapshot.docs.map((doc) => doc.data().location);
        const storyTitle = querySnapshot.docs.map((doc) => doc.data().title);
        setLocations(storyList);
        setTitles(storyTitle);
      } catch (e) {
        toastAlert("error", e, 2000);
      }
    }
    getStories();
  }, []);

  const comebinedArray = locations.map((data, index) => {
    const title = titles[index];
    return {
      ...data,
      title,
    };
  });

  const groupLocation = (array) => {
    const groups = {};
    array.forEach((item) => {
      const lat = parseFloat(item.lat);
      const lon = parseFloat(item.lon);
      const locationName = item.name;
      const key = `${lat}-${lon}`;
      if (!groups[key]) {
        groups[key] = {
          lat,
          lon,
          locationName,
          title: [],
        };
      }
      groups[key].title.push(item.title);
    });
    return Object.values(groups);
  };
  const sameNameLocation = groupLocation(comebinedArray);

  const openModal = (title) => {
    showModal();
    setClickTitle(title);
  };

  return (
    <div>
      <Modal comebinedArray={comebinedArray} clickTitle={clickTitle} />
      <MapContainer
        center={center}
        zoom={7}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png" />
        {sameNameLocation.map((item, index) => (
          <Marker key={index} position={[item.lat, item.lon]} icon={painIcon}>
            <Popup>
              <TopSection>
                <MapPin />
                <p className=" text-center text-base font-bold">
                  {item.locationName}
                </p>
              </TopSection>
              <BottomSection>
                {item.title.map((item, index) => (
                  <button
                    className="block text-center"
                    key={index}
                    onClick={() => openModal({ item })}
                  >
                    {item}
                  </button>
                ))}
              </BottomSection>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <ToastContainer />
    </div>
  );
};

export default PostsLocation;
