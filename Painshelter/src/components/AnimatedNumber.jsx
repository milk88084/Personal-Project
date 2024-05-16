import { useRef, useEffect, useState } from "react";

const AnimatedNumber = ({ end }) => {
  const [count, setCount] = useState(0);
  const [animate, setAnimate] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimate(true); // 觸發動畫
            observer.unobserve(ref.current); // 動畫開始後取消觀察
          }
        });
      },
      { threshold: 0.5 } // 元素至少有50%在畫面上時觸發
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  useEffect(() => {
    if (!animate) return;

    let start = 0;
    const increment = end / 100;
    const timer = setInterval(() => {
      start += increment;
      if (start > end) {
        clearInterval(timer);
        start = end;
      }
      setCount(Math.ceil(start));
    }, 5);

    return () => clearInterval(timer);
  }, [animate, end]);

  return <div ref={ref}>{animate ? count : 0}</div>;
};

export default AnimatedNumber;
