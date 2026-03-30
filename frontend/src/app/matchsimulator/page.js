"use client";
import Header from "../components/header.jsx";
import TennisCourt from "../components/TennisCourt.jsx";
import {useState, useEffect, useMemo} from "react";

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

    useEffect(() => {
        fetch("http://localhost:8000/getAllPlayers")
            .then((res) => res.json())
            .then((data) => setPlayers(data.players ?? []))
            .catch(() => setPlayers([]));
    }, []);

    const filterByPrefix = (list, query) => {
        const q = query.trim().toLowerCase();
        if (!q) return list;
        return list.filter((name) => String(name).toLowerCase().startsWith(q));
    };

    const playerOneOptions = useMemo(
        () => filterByPrefix(players, queryOne),
        [players, queryOne]
    );

    const playerTwoOptions = useMemo(
        () => filterByPrefix(players, queryTwo),
        [players, queryTwo]
    );

    return (
        <div className="flex min-h-screen flex-col bg-zinc-100 text-zinc-900">
            <Header/>
            <main className="flex flex-1 flex-col items-center px-4 py-8 sm:px-6 sm:py-10">
                <div
                    className=" relative w-full flex-col min-h-[180px] gap-5 max-w-[520px] rounded-2xl border border-zinc-200/90 flex justify-center items-center bg-white p-4 shadow-sm sm:p-6">
                    {clicked && (
                        <button className={"top-2 left-4 absolute text-sm text-zinc-500 hover:text-zinc-900 font-semibold"}
                                onClick={() => {
                                    setClicked(false)
                                    setOnePlayer(false)
                                    setTwoPlayers(false)
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
                                className="flex h-11 w-50 items-center justify-center rounded-lg bg-zinc-900 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800">
                                View One Player
                            </button>
                            <button onClick={() => {
                                setTwoPlayers(true)
                                setClicked(true)
                            }}
                                    className="flex h-11 w-50 items-center justify-center rounded-lg bg-zinc-900 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800">
                                Compare Players
                            </button>
                        </div>
                    )}
                    {twoPlayers && (
                        <div className={"flex flex-col w-full pt-6 gap-3"}>
                            <Combobox
                                items={playerOneOptions}
                                value={playerOne}
                                onValueChange={setPlayerOne}
                                onInputValueChange={setQueryOne}
                            >
                                <ComboboxInput placeholder="Select Player One"/>
                                <ComboboxContent>
                                    <ComboboxList>
                                        {(item) => (
                                            <ComboboxItem key={item} value={item}>
                                                {item}
                                            </ComboboxItem>
                                        )}
                                    </ComboboxList>
                                    <ComboboxEmpty>No players found</ComboboxEmpty>
                                </ComboboxContent>
                            </Combobox>
                            <Combobox
                                items={playerTwoOptions}
                                value={playerTwo}
                                onValueChange={setPlayerTwo}
                                onInputValueChange={setQueryTwo}
                            >
                                <ComboboxInput placeholder="Select Player Two"/>
                                <ComboboxContent>
                                    <ComboboxList>
                                        {(item) => (
                                            <ComboboxItem key={item} value={item}>
                                                {item}
                                            </ComboboxItem>
                                        )}
                                    </ComboboxList>
                                    <ComboboxEmpty>No players found</ComboboxEmpty>
                                </ComboboxContent>
                            </Combobox>
                        </div>
                    )}
                    {onePlayer && (
                        <Combobox
                            items={playerTwoOptions}
                            value={playerTwo}
                            onValueChange={setPlayerTwo}
                            onInputValueChange={setQueryTwo}
                        >
                            <ComboboxInput placeholder="Select Player Two"/>
                            <ComboboxContent>
                                <ComboboxList>
                                    {(item) => (
                                        <ComboboxItem key={item} value={item}>
                                            {item}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                                <ComboboxEmpty>No players found</ComboboxEmpty>
                            </ComboboxContent>
                        </Combobox>
                    )}
                    {/*<TennisCourt surface="clay" fitViewport/>*/}
                </div>
            </main>
        </div>
    )
        ;
}
