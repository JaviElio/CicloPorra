#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://www.letour.fr"
LIST_URL = f"{BASE_URL}/es/corredores"

OUTPUT_PATH = Path(__file__).resolve().parent.parent / "src" / "data" / "ciclistas.json"

DEFAULT_LOGROS = {
    "victorias_etapa": 0,
    "etapa_reina": False,
    "posicion_general": None,
    "farolillo_rojo": False,
    "abandono": False,
    "maillot_amarillo": False,
    "maillot_verde": False,
    "maillot_polka": False,
    "maillot_blanco": False,
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; TourScraper/1.0; +https://github.com)"
}


def get_soup(url: str) -> BeautifulSoup:
    response = requests.get(url, headers=HEADERS, timeout=30)
    response.raise_for_status()
    return BeautifulSoup(response.text, "html.parser")


def parse_nacionalidad(li: Any) -> str:
    flag = li.select_one("span.flag")
    if not flag:
        return ""

    data_class = flag.get("data-class", "")
    match = re.search(r"flag--([A-Za-z0-9_-]+)", data_class)
    return match.group(1).upper() if match else ""


def parse_dorsal(li: Any, href: str) -> int:
    bib = li.select_one("span.bib")
    if bib:
        bib_text = bib.get_text(strip=True)
        if bib_text.isdigit():
            return int(bib_text)

    match = re.search(r"/corredor/(\d+)", href)
    if match:
        return int(match.group(1))

    raise ValueError(f"No dorsal found for runner: {href}")


def parse_runner_item(li: Any, team_name: str) -> dict[str, Any]:
    link_el = li.select_one("a.runner__link")
    if not link_el:
        raise ValueError("Runner link missing")

    relative_link = link_el.get("href", "").strip()
    href = relative_link if relative_link.startswith("http") else f"{BASE_URL}{relative_link}"
    nombre = link_el.get_text(strip=True)
    dorsal = parse_dorsal(li, href)
    nacionalidad = parse_nacionalidad(li)

    return {
        "dorsal": dorsal,
        "nombre": nombre,
        "equipo": team_name,
        "nacionalidad": nacionalidad,
        "link": href,
        "participante_id": "",
        "puntos": 0,
        "logros": DEFAULT_LOGROS.copy(),
    }


def scrape_riders() -> list[dict[str, Any]]:
    soup = get_soup(LIST_URL)
    riders: list[dict[str, Any]] = []

    for team_heading in soup.select("h3"):
        team_name = team_heading.get_text(strip=True)
        team_list = team_heading.find_next_sibling("div", class_="list__box")
        if not team_list:
            continue

        for li in team_list.select("li.list__box__item"):
            runner = parse_runner_item(li, team_name)
            riders.append(runner)

    return riders


def save_riders(riders: list[dict[str, Any]]) -> None:
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_PATH.open("w", encoding="utf-8") as handle:
        json.dump(riders, handle, ensure_ascii=False, indent=2)
    print(f"Saved {len(riders)} riders to {OUTPUT_PATH}")


def main() -> None:
    riders = scrape_riders()
    save_riders(riders)


if __name__ == "__main__":
    main()
