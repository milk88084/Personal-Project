import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

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

export const landingPAgeGSAPAnimations = (imgRef, buttonRef, enterIconRef) => {
  gsap.fromTo(
    imgRef.current,
    { scale: 0.2, opacity: 0 },
    { scale: 1, opacity: 1, duration: 5, ease: "elastic.out(1, 0.3)" }
  );

  gsap.fromTo(
    buttonRef.current,
    { x: 100, opacity: 0 },
    { x: 0, opacity: 1, duration: 3, ease: "expo.out" }
  );

  gsap.to(enterIconRef.current, {
    scale: 1.5,
    opacity: 1,
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
  });
};

export const musicHealPageGSAPAnimations = (
  titleRef1,
  titleRef2,
  titleRef3,
  paragraphRef1,
  paragraphRef2,
  paragraphRef3
) => {
  gsap.from(titleRef1.current, {
    x: -300,
    ease: "back.out",
    duration: 4,
    opacity: 0,
  });
  gsap.from(titleRef2.current, {
    x: -300,
    ease: "back.out",
    duration: 4,
    opacity: 0,
    scrollTrigger: {
      trigger: titleRef2.current,
      start: "top 70%",
      end: "bottom 50%",
      scrub: 1,
    },
  });
  gsap.from(titleRef3.current, {
    x: 300,
    ease: "back.out",
    duration: 4,
    opacity: 0,
    scrollTrigger: {
      trigger: titleRef3.current,
      start: "top 70%",
      end: "bottom 50%",
      scrub: 1,
    },
  });
  gsap.from(paragraphRef1.current, {
    y: -300,
    ease: "back.out",
    duration: 4,
    opacity: 0,
  });
  gsap.from(paragraphRef2.current, {
    y: 300,
    ease: "back.out",
    duration: 4,
    opacity: 0,
    scrollTrigger: {
      trigger: titleRef2.current,
      start: "top 50%",
      end: "bottom 50%",
      scrub: 1,
    },
  });
  gsap.from(paragraphRef3.current, {
    y: 300,
    ease: "back.out",
    duration: 4,
    opacity: 0,
    scrollTrigger: {
      trigger: titleRef3.current,
      start: "top 80%",
      end: "bottom 50%",
      scrub: 1,
    },
  });
};

export const bannerPageGSAPAnimations = (
  firstRef,
  thirdRef,
  fifthRef,
  seventhRef,
  imageRef,
  logoRef
) => {
  gsap.to(firstRef.current, { duration: 1, x: 50 });
  gsap.to(thirdRef.current, { duration: 1, x: 50 });
  gsap.to(fifthRef.current, { duration: 1, x: 70 });
  gsap.to(seventhRef.current, { duration: 1, x: 5 });
  gsap.to(imageRef.current, {
    duration: 0.7,
    scale: 1.2,
    filter: "drop-shadow(0 0 20px rgba(0, 0, 0, 0.8))",
  });
  gsap.to(
    firstRef.current,
    {
      skewX: -3,
      skewY: 0,
    },
    {
      skewX: 3,
      skewY: 0,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.1,
    }
  );
  gsap.to(logoRef.current, {
    duration: 3,
    rotation: 360,
    scale: 1.2,
    ease: "power4.inOut",
    repeat: -1,
    yoyo: true,
  });
};

export const aboutPainGSAPAnimations = (about, about2) => {
  gsap.from(about.current, {
    x: -300,
    duration: 4,
    opacity: 0,
    scrollTrigger: {
      trigger: about.current,
      start: "top 70%",
      end: "bottom 80%",
      scrub: 1,
    },
  });
  gsap.from(about2.current, {
    x: 300,
    duration: 4,
    opacity: 0,
    scrollTrigger: {
      trigger: about2.current,
      start: "top 70%",
      end: "bottom 90%",
      scrub: 1,
    },
  });
};
