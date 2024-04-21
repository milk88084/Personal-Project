import { useEffect, useState } from "react";
import { db } from "../utils/firebase/firebase.jsx";
import { collection, query, getDocs } from "firebase/firestore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// const data1 = [
//   {
//     name: "成長軌跡",
//     pv: 2400,
//   },
//   {
//     name: "情感關係",
//     pv: 1398,
//   },
//   {
//     name: "人際交流",
//     pv: 9800,
//   },
//   {
//     name: "生命經歷",
//     pv: 3908,
//   },
//   {
//     name: "職場發展",
//     pv: 4800,
//   },
// ];
export default function Chart() {
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
  console.log(typeData);

  //扁平化物件裡面的type內容，變成陣列

  useEffect(() => {
    if (typeData) {
      const newTypesArray = typeData.map((item) => item.type).flat();
      setTypes(newTypesArray);
    }
  }, [typeData]);
  console.log(types);

  //統計文章類型的資料function
  const total_count = types.reduce((obj, item) => {
    if (item in obj) {
      obj[item] += 1;
    } else {
      obj[item] = 1;
    }
    return obj;
  }, {});

  console.log(total_count);
  const chartData = Object.entries(total_count).map(([name, pv]) => {
    return {
      name,
      pv,
    };
  });

  console.log(chartData);

  return (
    <div>
      <LineChart
        width={1500}
        height={300}
        data={chartData}
        margin={{
          top: 50,
          right: 300,
          left: 200,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          wrapperStyle={{
            backgroundColor: "#ff0000",
            border: "10px solid #6200ff",
          }}
          labelStyle={{ fontWeight: "bold" }}
          itemStyle={{ color: "#ff0000" }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="pv"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </div>
  );
}
