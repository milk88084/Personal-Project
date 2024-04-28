import { useEffect, useState } from "react";
import { db } from "../../utils/firebase/firebase.jsx";
import { collection, query, getDocs } from "firebase/firestore";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ScatterChart,
  Scatter,
  Cell,
} from "recharts";

export default function TypeChart() {
  const [typeData, setTypeData] = useState();
  const [types, setTypes] = useState([]);
  useEffect(() => {
    async function getType() {
      try {
        const data = collection(db, "posts");
        const q = query(data);
        const querySnapshot = await getDocs(q);
        const userStoryList = querySnapshot.docs.map((doc) => ({
          type: doc.data().type,
          figure: doc.data().figure,
        }));
        setTypeData(userStoryList);
      } catch (e) {
        console.log(e);
      }
    }
    getType();
  }, []);
  // console.log(typeData);

  //扁平化物件裡面的type內容，變成陣列

  useEffect(() => {
    if (typeData) {
      const newTypesArray = typeData.map((item) => item.type).flat();
      setTypes(newTypesArray);
    }
  }, [typeData]);
  // console.log(types);

  //統計文章類型的資料function
  const total_count = types.reduce((obj, item) => {
    if (item in obj) {
      obj[item] += 1;
    } else {
      obj[item] = 1;
    }
    return obj;
  }, {});

  // console.log(total_count);
  const chartData = Object.entries(total_count).map(([name, count]) => {
    return {
      name,
      count,
    };
  });

  // console.log(chartData);

  //監聽視窗大小，去調整地圖的寬度
  const [width, setWidth] = useState(520);
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth <= 1279 ? 480 : 520);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const COLORS = [
    "#FFF0AC",
    "#FFED97",
    "#FFBB28",
    "#FFFF93",
    "#FFD306",
    "pink",
  ];

  return (
    <div>
      <ScatterChart
        width={width}
        height={350}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 10,
        }}
      >
        <CartesianGrid />
        <XAxis type="category" dataKey="name" name="關係人" />
        <YAxis type="number" dataKey="count" name="數量" />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Scatter name="people" data={chartData} fill="#8884d8">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Scatter>
      </ScatterChart>
    </div>
  );
}
