import React, { useEffect, useState } from "react";
import useSpotify from "./useSpotify";
import { useRecoilValue, useRecoilState } from "recoil";
import { currentTrackIdState } from "../atoms/songAtom";
const useSongInfo = () => {
    const spotifyApi = useSpotify();
    const [songInfo, setSongInfo] = useState(null);
    const [currentTrackId, setCurrentTrackId] =
        useRecoilState(currentTrackIdState);
    useEffect(() => {
        const fetchSongInfo = async () => {
            if (currentTrackId) {
                const trackInfo = await fetch(
                    `https://api.spotify.com/v1/tracks/${currentTrackId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
                        },
                    }
                ).then((res) => res.json());
                setSongInfo(trackInfo);
            }
        };
        fetchSongInfo();
    }, [currentTrackId, spotifyApi]);
    return songInfo;
};

export default useSongInfo;
