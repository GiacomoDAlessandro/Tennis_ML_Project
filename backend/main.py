from db import supabase
from PointsParse import parse_shot_sequence, SERVE_DIRECTIONS, SHOT_TYPES, OUTCOMES
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok"}


@app.get("/getAllPlayers")
def get_players():
    players = set()
    page = 0
    page_size = 1000

    while True:
        result = supabase.table('matches') \
            .select('player1, player2') \
            .range(page * page_size, (page + 1) * page_size - 1) \
            .execute()

        for match in result.data:
            if match['player1']:
                players.add(match['player1'])
            if match['player2']:
                players.add(match['player2'])
        if len(result.data) < page_size:
            break

        page += 1

    return {"players": sorted(list(players))}
