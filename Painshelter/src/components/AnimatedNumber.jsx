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
            setAnimate(true);
            observer.unobserve(ref.current);
          }
        });
      },
      { threshold: 0.5 }
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
