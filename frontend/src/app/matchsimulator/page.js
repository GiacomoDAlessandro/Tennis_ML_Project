"use client";
import Header from "../components/header";
import TennisCourt from "../components/TennisCourt";
import {useState, useEffect, useMemo} from "react";
import OnePlayerBox from "../components/onePlayerBox";
import TwoPlayerBox from "../components/TwoPlayerBox";

import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "../../components/ui/combobox";


export default function MatchSimulatorPage() {
    const [players, setPlayers] = useState([]);
    const [playerOne, setPlayerOne] = useState(null);
    const [playerTwo, setPlayerTwo] = useState(null);
    const [queryOne, setQueryOne] = useState("");
    const [queryTwo, setQueryTwo] = useState("");
    const [clicked, setClicked] = useState(false);
    const [onePlayer, setOnePlayer] = useState(false);
    const [twoPlayers, setTwoPlayers] = useState(false);
    const [tennisCourt, setTennisCourt] = useState(false);
    const [chooseSurface, setChooseSurface] = useState(false);
    const surfaces = ["clay", "hard", "grass"];
    const [selectedSurfaceOne, setSelectedSurfaceOne] = useState(null);
    const [selectedSurfaceTwo, setSelectedSurfaceTwo] = useState(null);

    //Getting all players
    useEffect(() => {
        fetch("http://localhost:8000/getAllPlayers")
            .then((res) => res.json())
            .then((data) => setPlayers(data.players ?? []))
            .catch(() => setPlayers([]));
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-zinc-100 text-zinc-900">
            <Header/>
            <main className="flex flex-1 flex-col items-center px-4 py-8 sm:px-6 sm:py-10">
                <div
                    className=" relative w-full flex-col min-h-[180px] gap-5 max-w-[520px] rounded-2xl border border-zinc-200/90 flex justify-center items-center bg-white p-4 shadow-sm sm:p-6">
                    {clicked && (
                        //Button to go back from selecting players to selecting whether to view one player or two players*
                        <button
                            className={"top-2 left-4 absolute text-sm text-zinc-500 hover:text-zinc-900 font-semibold"}
                            onClick={() => {
                                setClicked(false)
                                setOnePlayer(false)
                                setTwoPlayers(false)
                                setTennisCourt(false)
                                setPlayerOne(null)
                                setPlayerTwo(null)
                                setQueryOne("")
                                setQueryTwo("")
                            }}>
                            ←
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
                    {twoPlayers && (
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
                            setTennisCourt={setTennisCourt}
                        />
                    )}

                    {(twoPlayers && tennisCourt) && (
                        <div className={"flex gap-5 flex-col items-center justify-center"}>
                            <TennisCourt surface={selectedSurfaceOne}/>
                            <TennisCourt surface={selectedSurfaceTwo}/>
                        </div>
                    )}
                    {/*When only one player is viewed*/}
                    {onePlayer && (
                        <OnePlayerBox
                            players={players}
                            playerOne={playerOne}
                            setPlayerOne={setPlayerOne}
                            queryOne={queryOne}
                            setQueryOne={setQueryOne}
                            surfaces={surfaces}
                            onView={(surface) => {
                                setSelectedSurfaceOne(surface);
                                setTennisCourt(true)
                            }}
                        />
                    )}
                    {onePlayer && tennisCourt && (
                        <TennisCourt surface={selectedSurfaceOne}/>
                    )}


                </div>
            </main>
        </div>
    )
}
