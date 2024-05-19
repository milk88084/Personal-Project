import styled from "styled-components";
import PostsLocation from "@/components/PostLocation.jsx";

const MapSectionWrapper = styled.div`
  width: 1280px;
  margin: 0 auto;
  height: 100vh;
  z-index: 1000;

  @media screen and (max-width: 1279px) {
    width: 100%;
  }
`;

export default function MapSection() {
  return (
    <MapSectionWrapper>
      <PostsLocation />
    </MapSectionWrapper>
  );
}
