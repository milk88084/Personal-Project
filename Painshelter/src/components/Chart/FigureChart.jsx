import { useEffect, useState } from "react";
import { db } from "../../utils/firebase/firebase.jsx";
import { collection, query, getDocs } from "firebase/firestore";
import { XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";

export default function FigureChart() {
  const [typeData, setTypeData] = useState();
  const [types, setTypes] = useState([]);
  useEffect(() => {
    async function getType() {
      try {
        const data = collection(db, "posts");
        const q = query(data);
        const querySnapshot = await getDocs(q);
        const userStoryList = querySnapshot.docs.map((doc) => ({
          figure: doc.data().figure,
        }));
        setTypeData(userStoryList);
      } catch (e) {
        console.log(e);
      }
    }
    getType();
  }, []);
  //   console.log(typeData);

  //扁平化物件裡面的type內容，變成陣列
  useEffect(() => {
    if (typeData) {
      const newTypesArray = typeData.map((item) => item.figure).flat();
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
  const chartData = Object.entries(total_count).map(([name, pv]) => {
    return {
      name,
      pv,
    };
  });

  // console.log(chartData);

  return (
    <div>
      <BarChart
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#c2f800" />
        <YAxis />
        <Tooltip wrapperStyle={{ width: 100, backgroundColor: "#0d00ff" }} />

        <Bar dataKey="pv" fill="#ff0000" />
      </BarChart>
    </div>
  );
}
