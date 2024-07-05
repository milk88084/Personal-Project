import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";

import { debounce } from "@/utils/debounce";
import { useLyric } from "@/utils/zustand.js";

const SearchBar = styled.div`
  margin-top: 30px;
  input {
    width: 100%;
    height: 30px;
    border-radius: 7px;
    color: black;
    padding-left: 7px;
  }
`;

const SongList = styled.div`
  margin-top: 20px;
`;

const SongItem = styled.div`
  margin: 10px 0;
  cursor: pointer;
  &:hover {
    color: blue;
  }
`;

const Lyrics = styled.div`
  margin-top: 20px;
  white-space: pre-wrap;
`;

function LyricSearch() {
  const [songs, setSongs] = useState([]);
  const [lyrics, setLyrics] = useState("");
  const [selectedSong, setSelectedSong] = useState(null);
  const { title, searchStatus, setStatusfalse } = useLyric();

  const handleSearch = useCallback(
    debounce(async () => {
      const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
      const cx = "130af128a09214343";
      const url = `https://www.googleapis.com/customsearch/v1?cx=${cx}&key=${apiKey}&q=${title}&siteSearch=mojim.com`;
      try {
        const response = await axios.get(url);
        setSongs(response.data.items);
        setStatusfalse();
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    }, 1000),
    [title, setStatusfalse]
  );

  useEffect(() => {
    if (searchStatus) {
      handleSearch();
    }
  }, [searchStatus, handleSearch]);

  const handleSongClick = (song) => {
    setSelectedSong(song);
    setLyrics(song.snippet);
  };

  return (
    <div>
      <SearchBar>
        <form>
          <input type="text" placeholder="输入歌手或歌曲名称" value={title} />
        </form>
      </SearchBar>
      <SongList>
        {songs.map((song, index) => (
          <SongItem key={index} onClick={() => handleSongClick(song)}>
            {song.title}
          </SongItem>
        ))}
      </SongList>
      {selectedSong && (
        <div>
          <h3>{selectedSong.title}</h3>
          <Lyrics>{lyrics}</Lyrics>
        </div>
      )}
    </div>
  );
}

export default LyricSearch;
