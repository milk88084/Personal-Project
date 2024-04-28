import { useEffect, useState } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase/firebase.jsx";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Modal from "./Modal.jsx";
import { useLoginState } from "../utils/zustand.js";
import icon from "../assets/img/logoImg3.png";

//Adjust for invisible Marker after deploying due to webpack building
import L from "leaflet";
// import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
// import iconUrl from "leaflet/dist/images/marker-icon.png";
// import shadowUrl from "leaflet/dist/images/marker-shadow.png";
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl,
//   iconUrl,
//   shadowUrl,
// });

const painIcon = L.icon({
  iconUrl: icon,
  iconSize: [35, 45], //icon大小
  iconAnchor: [25, 20], //圖標中心點位置
  popupAnchor: [0, 0], //popup視窗位置
});

const PostsLocation = () => {
  const [locations, setLocations] = useState([]);
  const [titles, setTitles] = useState([]);
  const [clickTitle, setClickTitle] = useState("");
  const center = [23.604799, 120.7976256];
  const { showModal } = useLoginState();

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
  // console.log(locations);

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

  //click Popup button可以連到該作者頁面
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
        {sanmeNameLocation.map((item, index) => (
          <Marker key={index} position={[item.lat, item.lon]} icon={painIcon}>
            <Popup>
              <p className=" text-center text-base font-bold">
                {item.locationName}
              </p>
              {item.title.map((item, index) => (
                <button
                  className="block text-center"
                  key={index}
                  onClick={() => openModal({ item })}
                >
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
