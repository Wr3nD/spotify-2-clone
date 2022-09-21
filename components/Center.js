import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { shuffle } from "lodash";
import { useRecoilValue, useRecoilState } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";
import Link from "next/link";
const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500",
];

const Center = () => {
    const { data: session } = useSession();
    const [color, setColor] = useState(null);
    const spotifyApi = useSpotify();
    const playlistsId = useRecoilValue(playlistIdState);
    const [playlist, setPlaylist] = useRecoilState(playlistState);
    useEffect(() => {
        setColor(shuffle(colors).pop());
    }, [playlistsId]);

    useEffect(() => {
        spotifyApi
            .getPlaylist(playlistsId)
            .then((data) => {
                setPlaylist(data.body);
            })
            .catch((err) => console.log("something went wrong !", err));
    }, [spotifyApi, playlistsId]);
    console.log(playlist);
    return (
        <div className="flex-grow   h-screen overflow-y-scroll scrollbar-hide">
            <header className="absolute top-5 right-8">
                <button>
                    <Link href="/login">
                        <div className="flex items-center bg-black space-x-3 text-white opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
                            <img
                                className="rounded-full w-10 h-10"
                                src={session?.user?.image}
                                alt="profile picture"
                            />
                            <h2>{session?.user?.name}</h2>

                            <ChevronDownIcon className="h-5 w-5" />
                        </div>
                    </Link>
                </button>
            </header>
            <section
                className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8 `}
            >
                <img
                    className="h-44 w-44 shadow-2xl "
                    src={playlist?.images?.[0]?.url}
                    alt=""
                />
                <div>
                    <p>Playlist</p>
                    <h1 className="text-2xl md:text-3xl xl:text-5xl ">
                        {playlist?.name}
                    </h1>
                </div>
            </section>
            <div>
                <Songs />
            </div>
        </div>
    );
};

export default Center;
