import styled from "styled-components";
import Buttons from "@/components/Buttons";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { getAllFirebasePosts } from "@/utils/firebase/firebaseService";
import { useState, useEffect, useRef } from "react";

//#region
const HighlightWrapper = styled.div`
  width: 100vw;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 20px;
  grid-row-gap: 1rem;
  gap: 3rem;
  justify-items: center;
  align-items: center;

  @media screen and (max-width: 1279px) {
    display: flex;
    flex-direction: column;
  }
`;

const HighlightPost = styled.div`
  padding: 30px;
  height: 300px;
  width: 400px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: white;
  box-shadow: 3px 3px 15px 3px rgba(255, 238, 3, 0.2);
  border-radius: 20px;
  font-size: 18px;
  h1 {
    font-size: 50px;
    font-weight: 800;
  }

  h2 {
    font-size: 15px;
    color: #000d15;
    font-weight: 400;
    opacity: 80%;
  }

  p {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 15px;
  }

  &:hover {
    background: linear-gradient(
      315deg,
      rgba(219, 180, 0, 1) 0%,
      rgba(233, 212, 148, 1) 69%,
      rgba(238, 235, 174, 1) 100%
    );
    cursor: pointer;
    transform: scale(1.1);
    color: white;
  }
`;

const MoreButton = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 60px;
`;
//#endregion

export default function HighLights({ highlight }) {
  const [randomStories, setRandomStories] = useState([]);
  const [stories, setStories] = useState([]);
  const [displayCount, setDisplayCount] = useState(6);
  const [loadedIndices, setLoadedIndices] = useState(new Set());
  const navigate = useNavigate();
  const highlightRefs = useRef([]);

  useEffect(() => {
    async function fetchStoryData() {
      const data = await getAllFirebasePosts();
      if (data.length > 0) {
        const userStoryList = data.map((doc) => ({
          title: doc.title,
          time: doc.time,
          location: doc.location,
          type: doc.type,
          figure: doc.figure,
          story: doc.story,
          userId: doc.storyId,
        }));
        setStories(userStoryList);
      }
    }
    fetchStoryData();
  }, []);

  const handleShowMore = () => {
    setDisplayCount((prevState) => prevState + 6);
  };

  const handleVisitAthor = (id) => {
    navigate("/visit", { state: { data: id } });
    window.scrollTo(0, 0);
  };

  function getRandomStories(arr, size, excludedIndices) {
    const result = [];
    const useIndex = new Set();
    while (
      result.length < size &&
      useIndex.size + excludedIndices.size < arr.length
    ) {
      const index = Math.floor(Math.random() * arr.length);
      if (!useIndex.has(index) && !excludedIndices.has(index)) {
        result.push(arr[index]);
        useIndex.add(index);
      }
    }
    return [result, useIndex];
  }

  useEffect(() => {
    if (stories.length < 1) return;
    if (displayCount === 6) {
      const [newStories, newIndices] = getRandomStories(
        stories,
        6,
        loadedIndices
      );
      setRandomStories(newStories);
      setLoadedIndices(newIndices);
    } else {
      const [newStories, newIndices] = getRandomStories(
        stories,
        6,
        loadedIndices
      );
      setRandomStories((prev) => [...prev, ...newStories]);
      setLoadedIndices((prev) => new Set([...prev, ...newIndices]));
    }
  }, [stories, displayCount]);

  const addToRefs = (el) => {
    if (el && !highlightRefs.current.includes(el)) {
      highlightRefs.current.push(el);
    }
  };

  useEffect(() => {
    highlightRefs.current.forEach((el, index) => {
      gsap.fromTo(
        el,
        {
          autoAlpha: 0,
          y: 30,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.3,
        }
      );
    });
  }, [stories]);

  return (
    <>
      <HighlightWrapper ref={highlight}>
        {randomStories.map((story, index) => {
          return (
            <HighlightPost
              ref={addToRefs}
              onClick={() => handleVisitAthor(story.userId)}
              key={index}
            >
              <h1>{index + 1}</h1>
              <h2>疼痛暗號：{story.title}</h2>
              <h2>@{story.location.name}</h2>
              <p>{story.story}</p>
            </HighlightPost>
          );
        })}
      </HighlightWrapper>
      <MoreButton>
        <Buttons onClick={handleShowMore} text="更多" />
      </MoreButton>
    </>
  );
}
