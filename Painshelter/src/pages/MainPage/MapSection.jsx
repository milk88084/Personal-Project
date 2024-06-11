import styled from "styled-components";

import PostsLocation from "@/components/PostLocation.jsx";

const MapSectionWrapper = styled.div`
  width: 1280px;
  margin: 0 auto;
  height: 100vh;
  z-index: 1000;

  @media screen and (max-width: 1279px) {
    width: 100%;
    height: 100%;
    margin-bottom: 100px;
  }
`;

export default function MapSection() {
  return (
    <MapSectionWrapper>
      <PostsLocation />
    </MapSectionWrapper>
  );
}
