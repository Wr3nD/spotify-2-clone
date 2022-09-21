import React from "react";
import { getProviders, signIn } from "next-auth/react";
const login = ({ providers }) => {
    return (
        <div className="min-h-screen justify-center flex bg-black flex-col items-center ">
            <img
                className="w-52 mb-5"
                src="https://links.papareact.com/9xl"
                alt="logo"
            />

            {Object.values(providers).map((provider) => (
                <div key={provider.name}>
                    <button
                        className="bg-[#18D860] text-white p-5 rounded-full "
                        onClick={() =>
                            signIn(provider.id, { callbackUrl: "/" })
                        }
                    >
                        Login with {provider.name}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default login;

export async function getServerSideProps() {
    const providers = await getProviders();
    return {
        props: {
            providers,
        },
    };
}
