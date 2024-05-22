import styled from "styled-components";
import aboutpainsectionimg from "@/assets/img/aboutpainsection1.jpg";
import aboutpainsectionimg2 from "@/assets/img/aboutpainsection2.jpg";
import { useGSAP } from "@gsap/react";
import { aboutPainGSAPAnimations } from "@/utils/gsapAnimations";

//#region
const AboutPain = styled.div`
  color: white;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media screen and (max-width: 1279px) {
    height: 100%;
    width: 100%;
    margin-top: 100px;
  }
`;

const AboutPainTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-style: oblique;
  h1 {
    margin-left: 50px;
    font-size: 80px;
    font-weight: 600;
  }
  h2 {
    margin-right: 50px;
    font-size: 80px;
    font-weight: 600;
  }
  p {
    font-size: 50px;
    margin-right: 50px;
    opacity: 50%;
  }
  span {
    font-size: 50px;
    margin-left: 50px;
    opacity: 50%;
  }
  @media screen and (max-width: 1279px) {
    flex-direction: column;
    align-items: start;
    margin-top: 50px;
    h1 {
      margin-left: 15px;
      font-size: 60px;
      font-weight: 500;
    }
    h2 {
      margin-right: 0px;
      font-size: 60px;
      font-weight: 500;
      margin-left: 15px;
    }
    p {
      font-size: 30px;
      margin-right: 0px;
      margin-left: 15px;
    }
    span {
      font-size: 30px;
      margin-left: 15px;
    }
  }
`;

const AboutPaintContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  p {
    width: 600px;
    margin-left: 50px;
    opacity: 65%;
    font-size: 18px;
  }
  span {
    opacity: 65%;
    font-size: 50px;
    font-weight: 300;
  }
  img {
    margin-right: 50px;
    margin-left: 50px;
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
  }
  @media screen and (max-width: 1279px) {
    flex-direction: column;
    align-items: flex-end;
    position: relative;
    p {
      width: 100%;
      margin-left: 0px;
      padding: 15px;
    }
    span {
      display: none;
    }

    img {
      margin: 0 auto;
      width: 100%;
    }
  }
`;
//#endregion

export default function AboutPainSection({ about, about2 }) {
  useGSAP(() => {
    aboutPainGSAPAnimations(about, about2);
  }, []);

  return (
    <>
      <AboutPain ref={about}>
        <AboutPainTitle>
          <h1>關於疼痛</h1>
          <p>About Pain</p>
        </AboutPainTitle>
        <AboutPaintContent>
          <span>「</span>
          <p>
            疼痛讓我們揭開了生活的另一面，那裡沒有華麗的掩飾，只有原始的、真實的自我。我們學會在這悲傷的碎片中找尋意義。
          </p>
          <span>」</span>
          <img src={aboutpainsectionimg} alt="Monochrome img" />
        </AboutPaintContent>
      </AboutPain>

      <AboutPain ref={about2}>
        <AboutPainTitle>
          <span>About Shelter</span>
          <h2>關於收容所</h2>
        </AboutPainTitle>
        <AboutPaintContent>
          <img src={aboutpainsectionimg2} alt="Monochrome img" />
          <span>「</span>
          <p>
            疼痛收容所是一個放置任意程度大小疼痛的故事空間，在這裡將不問對錯、不批判，期待達成自我療癒
            / 你可以在這裡分享任何大小的疼痛故事、不能說的秘密到平台上 /
            我們期待在這個微小的樹洞中，可以安置你的故事，或在瀏覽或傾聽他人的故事中，讓悲傷的故事或許不會那麼令人心碎。
          </p>
          <span>」</span>
        </AboutPaintContent>
      </AboutPain>
    </>
  );
}
