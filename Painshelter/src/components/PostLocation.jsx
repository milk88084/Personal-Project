import { useEffect, useState } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase/firebase.jsx";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const PostsLocation = () => {
  const [locations, setLocations] = useState([]);
  const [titles, setTitles] = useState([]);
  const center = [23.604799, 120.7976256];

  //讀取firestore資料，並存到state當中
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

  //將title加到location array裡面
  const comebinedArray = locations.map((data, index) => {
    const title = titles[index];
    return {
      ...data,
      title,
    };
  });

  //進行相同地點不同文章的判斷
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
  const sanmeNameLocation = groupLocation(comebinedArray);
  console.log(sanmeNameLocation);

  //click Popup button可以連到該作者頁面

  return (
    <div>
      <MapContainer
        center={center}
        zoom={7}
        style={{ height: "400px", width: "80%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {sanmeNameLocation.map((item, index) => (
          <Marker key={index} position={[item.lat, item.lon]}>
            <Popup>
              <p className="bg-yellow-300 text-center">{item.locationName}</p>
              {item.title.map((item, index) => (
                <button className="block m-2 text-center" key={index}>
                  {item}
                </button>
              ))}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default PostsLocation;
