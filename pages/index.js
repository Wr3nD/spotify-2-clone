import Head from "next/head";
import Center from "../components/Center";
import Sidebar from "../components/Sidebar";
import Player from "../components/Player";
import { getSession } from "next-auth/react";
const Home = () => {
    return (
        <div className="bg-black h-screen overflow-hidden">
            <Head>
                <title>Spotify 2.0</title>
                <base href="/" />
            </Head>

            <main className="flex">
                <Sidebar />
                <Center />
                {/* center */}
            </main>
            <div className="sticky bottom-0 ">
                <Player />
            </div>
        </div>
    );
};
export async function getServerSideProps(context) {
    const session = await getSession(context);

    return {
        props: {
            session,
        },
    };
}

export default Home;
