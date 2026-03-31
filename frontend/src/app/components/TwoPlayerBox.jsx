import { useMemo } from "react"

import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList
} from "../../components/ui/combobox";

export default function TwoPlayerBox({
                                         players,
                                         playerOne,
                                         setPlayerOne,
                                         queryOne,
                                         setQueryOne,
                                         surfaces,
                                         setTennisCourt,
                                         playerTwo,
                                         setPlayerTwo,
                                         queryTwo,
                                         setQueryTwo
                                     }) {

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
        <div className={"flex flex-col w-4/5 pt-6 gap-3"}>
            <div className={"flex gap-3 w-full"}>
                {/*Player One*/}
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

                {/*Surface*/}
                <Combobox
                    items={surfaces}>
                    <ComboboxInput placeholder={"Select Surface"}/>
                    <ComboboxContent>
                        <ComboboxList>
                            {(item) => (
                                <ComboboxItem key={item} value={item}>
                                    {item}
                                </ComboboxItem>
                            )}
                        </ComboboxList>
                        <ComboboxEmpty>Select a valid surface</ComboboxEmpty>
                    </ComboboxContent>
                </Combobox>
            </div>

            {/*Player Two*/}
            <div className={"flex flex-col gap-3 flex-1"}>
                <div className={"flex gap-3 w-full"}>

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

                    {/*Surface*/}
                    <Combobox
                        items={surfaces}
                    >
                        <ComboboxInput placeholder={"Select Surface"}/>
                        <ComboboxContent>
                            <ComboboxList>
                                {(item) => (
                                    <ComboboxItem key={item} value={item}>
                                        {item}
                                    </ComboboxItem>
                                )}
                            </ComboboxList>
                            <ComboboxEmpty>Select a valid surface</ComboboxEmpty>
                        </ComboboxContent>
                    </Combobox>
                </div>
            </div>

            {/* */}
            <div className={"flex items-center justify-center flex-col"}>
                <button
                    className={"flex h-11 justify-center items-center w-25 rounded-lg bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-800"}
                    onClick={() => {
                        setTennisCourt(true)
                    }}>
                    View
                </button>
            </div>
        </div>
    )
}