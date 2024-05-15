import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver({
  showProgress: true,
  //   overlayColor: "white",
  steps: [
    {
      element: "#categories",
      popover: {
        title: "功能列表",
        description: "不同功能可以點選。",
      },
    },
    {
      element: "#joinedTime",
      popover: {
        title: "加入時間",
        description: "使用者加入收容所的時間。",
      },
    },
    {
      element: "#statistics",
      popover: {
        title: "數據統計",
        description: "最近一次壓力測量指數、目前關注作者數量。",
      },
    },
    {
      element: "#storySection",
      popover: {
        title: "投稿/查看故事",
        description: "進行文章撰寫，與查看歷史文章。",
      },
    },
  ],
});

export default driverObj;
