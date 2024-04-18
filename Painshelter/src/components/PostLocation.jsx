import { useEffect, useState } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase/firebase.jsx";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const PostsLocation = () => {
  const [locations, setLocations] = useState([]);
  const [titles, setTitles] = useState([]);
  const center = [23.604799, 120.7976256];

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
        console.log(e);
      }
    }
    getStories();
  }, []);

  // console.log(locations);
  const comebinedArray = locations.map((data, index) => {
    const title = titles[index];
    return {
      ...data,
      title,
    };
  });

  console.log(comebinedArray);

  return (
    <div>
      <MapContainer
        center={center}
        zoom={7}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {comebinedArray.map((item, index) => {
          return (
            <div key={index}>
              <Marker position={[item.lat, item.lon]}>
                <Popup>
                  <p className="bg-yellow-300">{item.name}</p>
                  <button>{item.title}</button>
                </Popup>
              </Marker>
            </div>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default PostsLocation;
