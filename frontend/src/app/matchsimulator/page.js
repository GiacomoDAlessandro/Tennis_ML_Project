"use client";
import Header from "../components/header";
import TennisCourt from "../components/TennisCourt";
import {useState, useEffect} from "react";
import OnePlayerBox from "../components/onePlayerBox";
import TwoPlayerBox from "../components/TwoPlayerBox";

export default function MatchSimulatorPage() {
    const [players, setPlayers] = useState([]);
    const [playersLoading, setPlayersLoading] = useState(true);
    const [playerOne, setPlayerOne] = useState(null);
    const [playerTwo, setPlayerTwo] = useState(null);
    const [queryOne, setQueryOne] = useState("");
    const [queryTwo, setQueryTwo] = useState("");
    const [clicked, setClicked] = useState(false);
    const [onePlayer, setOnePlayer] = useState(false);
    const [twoPlayers, setTwoPlayers] = useState(false);
    const [tennisCourt, setTennisCourt] = useState(false);
    const surfaces = ["clay", "hard", "grass"];
    const [selectedSurfaceOne, setSelectedSurfaceOne] = useState(null);
    const [selectedSurfaceTwo, setSelectedSurfaceTwo] = useState(null);
    const [selectedNameOne, setSelectedNameOne] = useState("");
    const [selectedNameTwo, setSelectedNameTwo] = useState("");

    //Getting all players
    useEffect(() => {
        const CACHE_KEY = "tennis_players_cache_v1";
        const cached = window.sessionStorage.getItem(CACHE_KEY);
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setPlayers(parsed);
                    setPlayersLoading(false);
                }
            } catch {
                // ignore invalid cache and fetch fresh data
            }
        }

        fetch("http://localhost:8000/getAllPlayers")
            .then((res) => res.json())
            .then((data) => {
                const nextPlayers = data.players ?? [];
                setPlayers(nextPlayers);
                window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(nextPlayers));
            })
            .catch(() => setPlayers([]))
            .finally(() => setPlayersLoading(false));
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-zinc-100 text-zinc-900">
            <Header/>
            <main className="flex flex-1 flex-col items-center px-4 py-8 sm:px-6 sm:py-10">
                <div
                    className={`relative w-full flex-col min-h-[180px] gap-5 rounded-2xl border border-zinc-200/90 flex justify-center items-center bg-white p-4 shadow-sm sm:p-6 ${
                        twoPlayers && tennisCourt ? "max-w-[1180px]" : "max-w-[520px]"
                    }`}>
                    {clicked && (
                        //Button to go back from selecting players to selecting whether to view one player or two players*
                        <button
                            type="button"
                            aria-label="Go back"
                            className="absolute left-4 top-3 flex h-4 w-6 items-center justify-center rounded text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                            onClick={() => {
                                setClicked(false)
                                setOnePlayer(false)
                                setTwoPlayers(false)
                                setTennisCourt(false)
                                setPlayerOne(null)
                                setPlayerTwo(null)
                                setQueryOne("")
                                setQueryTwo("")
                                setSelectedSurfaceOne(null)
                                setSelectedSurfaceTwo(null)
                                setSelectedNameOne("")
                                setSelectedNameTwo("")
                            }}>
                            <span className="text-sm leading-none">←</span>
                        </button>
                    )}
                    {!clicked && (
                        <div className={"flex gap-3"}>
                            <button
                                onClick={() => {
                                    setOnePlayer(true)
                                    setClicked(true)
                                }}
                                className="flex h-11 w-50 justify-center items-center rounded-lg bg-zinc-900 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800">
                                View One Player
                            </button>
                            <button onClick={() => {
                                setTwoPlayers(true)
                                setClicked(true)
                            }}
                                    className="flex h-11 w-50 justify-center items-center rounded-lg bg-zinc-900 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800">
                                Compare Players
                            </button>
                        </div>
                    )}
                    {/*When two players are viewed*/}
                    {twoPlayers && !tennisCourt && (
                        <TwoPlayerBox
                            players={players}
                            playerOne={playerOne}
                            playerTwo={playerTwo}
                            setPlayerTwo={setPlayerTwo}
                            setPlayerOne={setPlayerOne}
                            queryTwo={queryTwo}
                            setQueryTwo={setQueryTwo}
                            queryOne={queryOne}
                            setQueryOne={setQueryOne}
                            surfaces={surfaces}
                            playersLoading={playersLoading}
                            onView={({ playerOne, playerTwo, surfaceOne, surfaceTwo }) => {
                                setSelectedNameOne(playerOne);
                                setSelectedNameTwo(playerTwo);
                                setSelectedSurfaceOne(surfaceOne);
                                setSelectedSurfaceTwo(surfaceTwo);
                                setTennisCourt(true);
                            }}
                        />
                    )}

                    {(twoPlayers && tennisCourt) && (
                        <div className="grid w-full gap-5 md:grid-cols-2">
                            <div className="flex flex-col items-center rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                                <h3 className="mb-2 text-sm font-semibold text-zinc-800">
                                    {selectedNameOne}
                                </h3>
                                <TennisCourt surface={selectedSurfaceOne} courtScale={0.62}/>
                            </div>
                            <div className="flex flex-col items-center rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                                <h3 className="mb-2 text-sm font-semibold text-zinc-800">
                                    {selectedNameTwo}
                                </h3>
                                <TennisCourt surface={selectedSurfaceTwo} courtScale={0.62}/>
                            </div>
                        </div>
                    )}
                    {/*When only one player is viewed*/}
                    {onePlayer && !tennisCourt && (
                        <OnePlayerBox
                            players={players}
                            playerOne={playerOne}
                            setPlayerOne={setPlayerOne}
                            queryOne={queryOne}
                            setQueryOne={setQueryOne}
                            surfaces={surfaces}
                            playersLoading={playersLoading}
                            onView={(surface) => {
                                setSelectedNameOne(playerOne);
                                setSelectedSurfaceOne(surface);
                                setTennisCourt(true)
                            }}
                        />
                    )}
                    {onePlayer && tennisCourt && (
                        <div className="pt-10 w-full max-w-[560px]">
                            <div className="flex flex-col items-center rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                                <h3 className="mb-2 text-sm font-semibold text-zinc-800">
                                    {selectedNameOne}
                                </h3>
                                <TennisCourt surface={selectedSurfaceOne} courtScale={0.62}/>
                            </div>
                        </div>
                    )}


                </div>
            </main>
        </div>
    )
}
