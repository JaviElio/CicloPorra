#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://www.letour.fr"
STAGE_URL_TEMPLATE = f"{BASE_URL}/es/clasificaciones/etapa-{{numero}}"

CONFIG_PATH = Path(__file__).resolve().parent.parent / "src" / "data" / "config.json"
OUTPUT_PATH = Path(__file__).resolve().parent.parent / "src" / "data" / "ganadores_etapas.json"
CICLISTAS_PATH = Path(__file__).resolve().parent.parent / "src" / "data" / "ciclistas.json"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; TourScraper/1.0; +https://github.com)"
}


def get_soup(url: str) -> BeautifulSoup:
    response = requests.get(url, headers=HEADERS, timeout=30)
    response.raise_for_status()
    return BeautifulSoup(response.text, "html.parser")


def load_config() -> dict[str, Any]:
    with CONFIG_PATH.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def touch_ultima_actualizacion(config: dict[str, Any]) -> None:
    config["ultima_actualizacion"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    with CONFIG_PATH.open("w", encoding="utf-8") as handle:
        json.dump(config, handle, ensure_ascii=False, indent=2)
        handle.write("\n")
    print(f"Updated ultima_actualizacion to {config['ultima_actualizacion']} in {CONFIG_PATH}")


def parse_dorsal_ganador(soup: BeautifulSoup) -> int | None:
    bib = soup.select_one("span[data-bib]")
    if not bib:
        return None

    match = re.search(r"\d+", bib.get("data-bib", ""))
    return int(match.group()) if match else None


def scrape_ganador(numero_etapa: int) -> dict[str, Any] | None:
    url = STAGE_URL_TEMPLATE.format(numero=numero_etapa)
    soup = get_soup(url)
    dorsal = parse_dorsal_ganador(soup)
    if dorsal is None:
        return None

    return {"etapa": numero_etapa, "dorsal": dorsal}


def scrape_ganadores(total_etapas: int) -> list[dict[str, Any]]:
    ganadores: list[dict[str, Any]] = []
    for numero_etapa in range(1, total_etapas + 1):
        ganador = scrape_ganador(numero_etapa)
        if ganador is None:
            print(f"Sin resultado todavia para la etapa {numero_etapa}")
            continue
        ganadores.append(ganador)
    return ganadores


def save_ganadores(ganadores: list[dict[str, Any]]) -> None:
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_PATH.open("w", encoding="utf-8") as handle:
        json.dump(ganadores, handle, ensure_ascii=False, indent=2)
    print(f"Saved {len(ganadores)} winners to {OUTPUT_PATH}")


def update_victorias_etapa(ganadores: list[dict[str, Any]]) -> None:
    victorias_por_dorsal = Counter(g["dorsal"] for g in ganadores)

    with CICLISTAS_PATH.open("r", encoding="utf-8") as handle:
        ciclistas = json.load(handle)

    for ciclista in ciclistas:
        ciclista["logros"]["victorias_etapa"] = victorias_por_dorsal.get(ciclista["dorsal"], 0)

    with CICLISTAS_PATH.open("w", encoding="utf-8") as handle:
        json.dump(ciclistas, handle, ensure_ascii=False, indent=2)
    print(f"Updated victorias_etapa for {len(ciclistas)} riders in {CICLISTAS_PATH}")


def main() -> None:
    config = load_config()
    ganadores = scrape_ganadores(int(config["total_etapas"]))
    save_ganadores(ganadores)
    update_victorias_etapa(ganadores)
    touch_ultima_actualizacion(config)


if __name__ == "__main__":
    main()
