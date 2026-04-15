from typing import Optional

from db import supabase
from PointsParse import parse_shot_sequence, SERVE_DIRECTIONS, SHOT_TYPES, OUTCOMES
from fastapi import FastAPI, Query
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

def _normalize_surface(surface: str) -> str:
    s = surface.strip().lower()
    if not s:
        return ""
    return s[0].upper() + s[1:] if len(s) > 1 else s.upper()


@app.get("/getPlayerMatches/{player_name}")
def get_player_matches(
    player_name: str,
    surface: Optional[str] = Query(None),
):
    """Matches rows match loadData.py: player1, player2, tournament, round, surface (Hard/Clay/Grass)."""
    query = (
        supabase.table("matches")
        .select("match_id, player1, player2, tournament, round, surface")
        .or_(f"player1.eq.{player_name}, player2.eq.{player_name}")
    )

    if surface:
        query = query.eq("surface", _normalize_surface(surface))

    result = query.execute()
    return {"matches": result.data or []}


@app.get("/getPlayerServes/{match_id}/{player_name}")
def get_match_points(match_id: str, player_name: str):

    ourPlayer = 0

    playerResult = supabase.table("matches").select("player1").eq("match_id", match_id).execute()

    if (player_name == playerResult.data[0]["player1"]):
        ourPlayer = 1
    else:
        ourPlayer = 2
    query = (
        supabase.table("points")
        .select("point_number, server, serve_direction, serve_outcome, point_end, had_fault")
        .eq("match_id", match_id).eq("server", ourPlayer)
    )

    result = query.execute()
    return {"points": result.data or []}


@app.get("/getPlayerReturns/{match_id}")
def get_player_returns(match_id: str):
    query = ()