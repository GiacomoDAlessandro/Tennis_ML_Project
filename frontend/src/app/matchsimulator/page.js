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
    ComboboxList
} from "../../components/ui/combobox";

/** Label: "Tournament Round vs. opponent" (matches `matches` table from loadData.py). */
function formatMatchDisplay(match, viewerName) {
    const tournament =
        (match.tournament && String(match.tournament).trim()) || "Unknown tournament";
    const round = (match.round && String(match.round).trim()) || "";
    const p1 = match.player1;
    const p2 = match.player2;
    let opponent = null;
    if (p1 === viewerName) opponent = p2;
    else if (p2 === viewerName) opponent = p1;
    else opponent = p1 || p2;
    const head = [tournament, round].filter(Boolean).join(" ");
    return `${head} vs. ${opponent ?? "Unknown"}`;
}

function getTennisAbstractPlayerUrl(playerName) {
    const slug = String(playerName || "")
        .trim()
        .replace(/[\s-]+/g, "");
    return `https://www.tennisabstract.com/cgi-bin/player.cgi?p=${encodeURIComponent(slug)}`;
}

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
    const [selectedMatchOne, setSelectedMatchOne] = useState([]);
    const [selectedMatchTwo, setSelectedMatchTwo] = useState([]);
    const [selectedOnePlayerMatch, setSelectedOnePlayerMatch] = useState(null);
    const [selectedTwoPlayerMatchOne, setSelectedTwoPlayerMatchOne] = useState(null);
    const [selectedTwoPlayerMatchTwo, setSelectedTwoPlayerMatchTwo] = useState(null);

    //Getting matches from supabase
    async function fetchPlayerMatches(playerName, surface, matchNum) {
        const encName = encodeURIComponent(playerName);
        const qs =
            surface != null && surface !== ""
                ? `?surface=${encodeURIComponent(surface)}`
                : "";
        const res = await fetch(
            `http://localhost:8000/getPlayerMatches/${encName}${qs}`
        );
        const data = await res.json();

        //matches
        const matches = Array.isArray(data?.matches) ? data.matches : [];

        //Initially match selected is every match until user selects a specific match
        if (matchNum === "One") {
            setSelectedMatchOne(matches);
        } else if (matchNum === "Two") {
            setSelectedMatchTwo(matches);
        }
    }


    useEffect(() => {
        const saved = sessionStorage.getItem("devState");
        if (saved) {
            const s = JSON.parse(saved);
            setClicked(s.clicked);
            setOnePlayer(s.onePlayer);
            setTennisCourt(s.tennisCourt);
            setSelectedNameOne(s.selectedNameOne);
            setSelectedSurfaceOne(s.selectedSurfaceOne);

            if (s.selectedNameOne) {
                fetchPlayerMatches(s.selectedNameOne, s.selectedSurfaceOne, "One");
            }

        }
    }, []);

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

    useEffect(() => {
        const prevBodyOverflow = document.body.style.overflow;
        const prevHtmlOverflow = document.documentElement.style.overflow;

        if (tennisCourt) {
            document.body.style.overflow = "auto";
            document.documentElement.style.overflow = "auto";
        } else {
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
        }

        return () => {
            document.body.style.overflow = prevBodyOverflow;
            document.documentElement.style.overflow = prevHtmlOverflow;
        };
    }, [tennisCourt]);

    useEffect(() => {
        setSelectedOnePlayerMatch(null);
    }, [selectedMatchOne]);


    const onePlayerMatchOptions = useMemo(() => {
        if (!Array.isArray(selectedMatchOne)) return [];
        return selectedMatchOne.map((m) => ({
            label: formatMatchDisplay(m, selectedNameOne),
            value: String(m.match_id),
        }));
    }, [selectedMatchOne, selectedNameOne]);

    const twoPlayerMatchOptionsOne = useMemo(() => {
        if (!Array.isArray(selectedMatchOne)) return [];
        return selectedMatchOne.map((m) => ({
            label: formatMatchDisplay(m, selectedNameOne),
            value: String(m.match_id),
        }));
    }, [selectedMatchOne, selectedNameOne]);

    const twoPlayerMatchOptionsTwo = useMemo(() => {
        if (!Array.isArray(selectedMatchTwo)) return [];
        return selectedMatchTwo.map((m) => ({
            label: formatMatchDisplay(m, selectedNameTwo),
            value: String(m.match_id),
        }));
    }, [selectedMatchTwo, selectedNameTwo]);
    return (
        <div className="flex min-h-screen flex-col bg-zinc-100 text-zinc-900">
            <Header/>
            <main className="flex flex-1 flex-col items-center px-4 py-8 sm:px-6 sm:py-10">
                <div
                    className={`relative w-full flex-col min-h-[180px] gap-5 rounded-2xl border border-zinc-200/90 flex justify-center items-center bg-white p-4 shadow-sm sm:p-6 ${
                        twoPlayers && tennisCourt
                            ? "max-w-[1180px]"
                            : onePlayer && tennisCourt
                                ? "max-w-[640px]"
                                : "max-w-[520px]"
                    }`}>
                    {clicked && (
                        //Button to go back from selecting players to selecting whether to view one player or two players*
                        <button
                            type="button"
                            aria-label={
                                tennisCourt ? "Back to player selection" : "Back to main menu"
                            }
                            className="absolute left-4 top-3 flex h-4 w-6 items-center justify-center rounded text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                            onClick={() => {
                                if (tennisCourt) {
                                    setTennisCourt(false);
                                    setSelectedOnePlayerMatch(null);
                                    return;
                                }
                                setClicked(false);
                                setOnePlayer(false);
                                setTwoPlayers(false);
                                setTennisCourt(false);
                                setPlayerOne(null);
                                setPlayerTwo(null);
                                setQueryOne("");
                                setQueryTwo("");
                                setSelectedSurfaceOne(null);
                                setSelectedSurfaceTwo(null);
                                setSelectedNameOne("");
                                setSelectedNameTwo("");
                                setSelectedMatchOne([]);
                                setSelectedMatchTwo([]);
                                setSelectedOnePlayerMatch(null);
                                setSelectedTwoPlayerMatchOne(null);
                                setSelectedTwoPlayerMatchTwo(null);
                            }}>
                            <span className="text-sm leading-none">←</span>
                        </button>
                    )}
                    {!clicked && (
                        <div className="flex w-full flex-col items-center justify-center gap-5">
                            <h2 className="text-center text-xl font-semibold tracking-tight text-zinc-900">
                                Match simulator
                            </h2>
                            <div className="flex flex-wrap justify-center gap-3">
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
                            onView={({playerOne, playerTwo, surfaceOne, surfaceTwo}) => {
                                setSelectedNameOne(playerOne);
                                setSelectedNameTwo(playerTwo);
                                setSelectedSurfaceOne(surfaceOne);
                                setSelectedSurfaceTwo(surfaceTwo);
                                fetchPlayerMatches(playerOne, surfaceOne, "One");
                                fetchPlayerMatches(playerTwo, surfaceTwo, "Two");
                                setSelectedTwoPlayerMatchOne(null);
                                setSelectedTwoPlayerMatchTwo(null);
                                setTennisCourt(true);
                            }}
                        />
                    )}

                    {(twoPlayers && tennisCourt) && (
                        <div className="pt-6 grid w-full gap-5 md:grid-cols-2">
                            <div
                                className="flex flex-col items-center rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                                <h3 className="mb-2 text-sm font-semibold text-zinc-800">
                                    <a
                                        href={getTennisAbstractPlayerUrl(selectedNameOne)}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="hover:text-zinc-900"
                                    >
                                        {selectedNameOne}
                                    </a>
                                </h3>
                                <Combobox
                                    key={`${selectedNameOne}-${selectedSurfaceOne}-compare`}
                                    items={twoPlayerMatchOptionsOne}
                                    value={selectedTwoPlayerMatchOne}
                                    onValueChange={setSelectedTwoPlayerMatchOne}>
                                    <ComboboxInput
                                        placeholder="Select a match"
                                        className="mb-2 w-full min-w-0"
                                    />
                                    <ComboboxContent>
                                        <ComboboxEmpty>
                                            No matches found on this surface
                                        </ComboboxEmpty>
                                        <ComboboxList>
                                            {(item) => (
                                                <ComboboxItem key={item.value} value={item}>
                                                    {item.label}
                                                </ComboboxItem>
                                            )}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                                <TennisCourt
                                    surface={selectedSurfaceOne}
                                    playerName={selectedNameOne}
                                    matchId={selectedTwoPlayerMatchOne?.value}
                                    courtScale={0.62}
                                />
                            </div>
                            <div
                                className="flex flex-col items-center rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                                <h3 className="mb-2 text-sm font-semibold text-zinc-800">
                                    <a
                                        href={getTennisAbstractPlayerUrl(selectedNameTwo)}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="hover:text-zinc-900"
                                    >
                                        {selectedNameTwo}
                                    </a>
                                </h3>
                                <Combobox
                                    key={`${selectedNameTwo}-${selectedSurfaceTwo}-compare`}
                                    items={twoPlayerMatchOptionsTwo}
                                    value={selectedTwoPlayerMatchTwo}
                                    onValueChange={setSelectedTwoPlayerMatchTwo}>
                                    <ComboboxInput
                                        placeholder="Select a match"
                                        className="mb-2 w-full min-w-0"
                                    />
                                    <ComboboxContent>
                                        <ComboboxEmpty>
                                            No matches found on this surface
                                        </ComboboxEmpty>
                                        <ComboboxList>
                                            {(item) => (
                                                <ComboboxItem key={item.value} value={item}>
                                                    {item.label}
                                                </ComboboxItem>
                                            )}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                                <TennisCourt
                                    surface={selectedSurfaceTwo}
                                    playerName={selectedNameTwo}
                                    matchId={selectedTwoPlayerMatchTwo?.value}
                                    courtScale={0.62}
                                />
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
                                fetchPlayerMatches(playerOne, surface, "One");
                                setTennisCourt(true)
                                sessionStorage.setItem("devState", JSON.stringify({
                                    clicked: true,
                                    onePlayer: true,
                                    tennisCourt: true,
                                    selectedNameOne: playerOne,
                                    selectedSurfaceOne: surface,
                                }));
                            }}
                        />
                    )}
                    {onePlayer && tennisCourt && (
                        <div className="flex w-full max-w-[600px] flex-col gap-3 pt-10 pb-10">
                            <Combobox
                                key={`${selectedNameOne}-${selectedSurfaceOne}`}
                                items={onePlayerMatchOptions}
                                value={selectedOnePlayerMatch}
                                onValueChange={(val) => {
                                    console.log(val);
                                    setSelectedOnePlayerMatch(val);
                                }}>
                                <ComboboxInput
                                    placeholder="Select a match"
                                    className="w-full min-w-0"
                                />
                                <ComboboxContent>
                                    <ComboboxEmpty>
                                        No matches found on this surface
                                    </ComboboxEmpty>
                                    <ComboboxList>
                                        {(item) => (
                                            <ComboboxItem key={item.value} value={item}>
                                                {item.label}
                                            </ComboboxItem>
                                        )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                            <div
                                className="flex flex-col items-center rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                                <h3 className="mb-2 text-sm font-semibold text-zinc-800">
                                    <a
                                        href={getTennisAbstractPlayerUrl(selectedNameOne)}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="hover:text-zinc-900"
                                    >
                                        {selectedNameOne}
                                    </a>
                                </h3>
                                <TennisCourt surface={selectedSurfaceOne} playerName={selectedNameOne} matchId={selectedOnePlayerMatch?.value} courtScale={0.62}/>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
