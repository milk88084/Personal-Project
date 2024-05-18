import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(useGSAP);

export const helpPAgeGSAPAnimations = (
  imgTextRef,
  titleSection1Ref,
  titleSection2Ref,
  titleSection3Ref
) => {
  gsap.to(imgTextRef.current, {
    duration: 3,
    scale: 1.2,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
  });

  gsap.from(imgTextRef.current, {
    duration: 1,
    y: 100,
    opacity: 0,
    ease: "power1.out",
  });

  gsap.from(titleSection1Ref.current, {
    x: -200,
    ease: "back.out",
    duration: 4,
    opacity: 0,
    scrollTrigger: {
      trigger: titleSection1Ref.current,
      start: "top 80%",
      end: "bottom 50%",
      scrub: 1,
    },
  });

  gsap.from(titleSection2Ref.current, {
    x: 200,
    ease: "back.out",
    duration: 4,
    opacity: 0,
    scrollTrigger: {
      trigger: titleSection2Ref.current,
      start: "top 60%",
      end: "bottom 50%",
      scrub: 1,
    },
  });

  gsap.from(titleSection3Ref.current, {
    x: -500,
    ease: "back.out",
    duration: 4,
    opacity: 0,
    scrollTrigger: {
      trigger: titleSection3Ref.current,
      start: "top 100%",
      end: "bottom 70%",
      scrub: 1,
    },
  });
};
