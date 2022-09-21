import React, { useCallback, useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";
import { useRecoilValue, useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";

import {
    BackwardIcon,
    PauseCircleIcon,
    PlayIcon,
    SpeakerWaveIcon,
    SpeakerXMarkIcon,
    ForwardIcon,
    ArrowsRightLeftIcon,
    ArrowPathRoundedSquareIcon,
} from "@heroicons/react/24/solid";
import { debounce } from "lodash";
const Player = () => {
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [currentTrackId, setCurrentTrackId] =
        useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState(50);

    const songInfo = useSongInfo();

    const fetchCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then((data) => {
                console.log("Now Playing: ", data.body?.item);
                setCurrentTrackId(data.body?.item?.id);
                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing);
                });
            });
        }
    };
    const handlePlayPause = () => {
        spotifyApi
            .getMyCurrentPlaybackState()
            .then((data) => {
                if (data?.body?.is_playing) {
                    spotifyApi.pause();
                    setIsPlaying(false);
                } else {
                    spotifyApi.play();
                    setIsPlaying(true);
                }
            })
            .catch(() => {});
    };
    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong();
            setVolume(50);
        }
    }, [currentTrackId, spotifyApi, session]);

    useEffect(() => {
        if (volume > 0 && volume < 100) {
            debounceAdjustVolume(volume);
        }
    }, [volume]);

    const debounceAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch(() => {});
        }, 300),
        []
    );

    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
            {/* Left */}
            <div className="flex items-center space-x-4">
                <img
                    className="hidden md:inline h-10 w-10"
                    src={songInfo?.album?.images?.[0]?.url}
                    alt=""
                />
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>
            {/* center */}
            <div className="flex items-center justify-evenly">
                <ArrowsRightLeftIcon className="button" />

                <BackwardIcon
                    className="button"
                    onClick={() => spotifyApi.skipToPrevious()}
                />
                {isPlaying ? (
                    <PauseCircleIcon
                        className="button w-10 h-10"
                        onClick={handlePlayPause}
                    />
                ) : (
                    <PlayIcon
                        className="button w-10 h-10"
                        onClick={handlePlayPause}
                    />
                )}
                <ForwardIcon
                    className="button"
                    onClick={() => spotifyApi.skipToNext()}
                />
                <ArrowPathRoundedSquareIcon className="button" />
            </div>
            {/* right */}
            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <SpeakerXMarkIcon
                    className="button"
                    onClick={() => volume > 0 && setVolume(volume - 10)}
                />
                <input
                    className="w-14 md:w-28"
                    type="range"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    min={0}
                    max={100}
                />
                <SpeakerWaveIcon
                    className="button"
                    onClick={() => volume < 100 && setVolume(volume + 10)}
                />
            </div>
        </div>
    );
};

export default Player;
