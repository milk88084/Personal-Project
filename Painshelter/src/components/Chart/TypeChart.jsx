import { useEffect, useState } from "react";
import getFirebasePosts from "@/utils/firebase/firebaseService.js";
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
    const dataMapper = (docs) => [
      docs.map((doc) => ({
        type: doc.data().type,
        figure: doc.data().figure,
      })),
    ];
    getFirebasePosts("posts", dataMapper, [setTypeData]);
  }, [setTypeData]);

  useEffect(() => {
    if (typeData) {
      const newTypesArray = typeData.map((item) => item.type).flat();
      setTypes(newTypesArray);
    }
  }, [typeData]);

  const total_count = types.reduce((obj, item) => {
    if (item in obj) {
      obj[item] += 1;
    } else {
      obj[item] = 1;
    }
    return obj;
  }, {});

  const chartData = Object.entries(total_count).map(([name, count]) => {
    return {
      name,
      count,
    };
  });

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
        <CartesianGrid stroke="transparent" />
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
