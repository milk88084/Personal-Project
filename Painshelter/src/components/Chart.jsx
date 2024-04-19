import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  {
    name: "成長軌跡",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "情感關係",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "人際交流",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "生命經歷",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "職場發展",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
];
export default function chart() {
  return (
    <div>
      <LineChart
        width={1500}
        height={300}
        data={data}
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
        <Line type="monotone" dataKey="uv" stroke="#d1980a" />
      </LineChart>
    </div>
  );
}
