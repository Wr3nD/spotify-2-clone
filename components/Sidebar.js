import React, { useEffect, useState } from "react";
import {
    HomeIcon,
    MagnifyingGlassIcon,
    BuildingLibraryIcon,
    HeartIcon,
    RssIcon,
    PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import useSpotify from "../hooks/useSpotify";
const Sidebar = () => {
    const { data: session, status } = useSession();
    const spotifyApi = useSpotify();
    console.log("SES", session);
    const [playlists, setPlaylists] = useState([]);
    const [playlistsId, setPlaylistsId] = useRecoilState(playlistIdState);
    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi?.getUserPlaylists()?.then((data) => {
                setPlaylists(data.body.items);
            });
        }
    }, [session, spotifyApi]);
    console.log(playlistsId);
    return (
        <div className="text-gray-500 p-5 text-xs sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex lg:text-sm border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide pb-36">
            <div className="space-y-4">
                {/* <button
                    className="flex items-center space-x-2 hover:text-white"
                    // onClick={() => signOut()}
                >
                    <Link href="/login">Log out</Link>
                </button> */}
                <button className="flex items-center space-x-2 hover:text-white">
                    <HomeIcon className="h-5 w-5" />
                    <p>Home</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <MagnifyingGlassIcon className="h-5 w-5" />
                    <p>Search</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <BuildingLibraryIcon className="h-5 w-5" />
                    <p>Your Library</p>
                </button>
                <hr className="border-t-[0.1px] border-gray-900 " />

                <button className="flex items-center space-x-2 hover:text-white">
                    <PlusCircleIcon className="h-5 w-5" />
                    <p>Create Playlist</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <HeartIcon className="h-5 w-5 text-blue-500" />
                    <p>Liked Songs</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <RssIcon className="h-5 w-5 text-green-500" />
                    <p>Your episodes</p>
                </button>
                <hr className="border-t-[0.1px] border-gray-900 " />
                {/* playlist */}
                {playlists.map((playlist) => (
                    <p
                        key={playlist.id}
                        className="cursor-pointer hover:text-white"
                        onClick={() => setPlaylistsId(playlist.id)}
                    >
                        {playlist.name}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
