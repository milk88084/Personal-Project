import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver({
  showProgress: true,
  //   overlayColor: "white",
  steps: [
    {
      element: "#profileImg",
      popover: {
        title: "大頭照更換",
        description: "點擊頭像可以更換大頭照。",
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
