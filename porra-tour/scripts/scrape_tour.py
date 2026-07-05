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


def get_html(url: str) -> str:
    response = requests.get(url, headers=HEADERS, timeout=30)
    response.raise_for_status()
    return response.text


def load_config() -> dict[str, Any]:
    with CONFIG_PATH.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def update_etapa_actual(config: dict[str, Any], ganadores: list[dict[str, Any]]) -> None:
    if not ganadores:
        return

    etapa_actual = max(g["etapa"] for g in ganadores)
    config["etapa_actual"] = etapa_actual
    print(f"Updated etapa_actual to {etapa_actual}")


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


def scrape_ganador(numero_etapa: int) -> tuple[dict[str, Any], BeautifulSoup] | None:
    url = STAGE_URL_TEMPLATE.format(numero=numero_etapa)
    html = get_html(url)
    soup = BeautifulSoup(html, "html.parser")
    dorsal = parse_dorsal_ganador(soup)
    if dorsal is None:
        return None

    return {"etapa": numero_etapa, "dorsal": dorsal}, soup


def scrape_ganadores(total_etapas: int) -> tuple[list[dict[str, Any]], BeautifulSoup | None]:
    ganadores: list[dict[str, Any]] = []
    soup_ultima_etapa: BeautifulSoup | None = None
    for numero_etapa in range(1, total_etapas + 1):
        resultado = scrape_ganador(numero_etapa)
        if resultado is None:
            print(f"Sin resultado todavia para la etapa {numero_etapa}")
            continue
        ganador, soup_ultima_etapa = resultado
        ganadores.append(ganador)
    return ganadores, soup_ultima_etapa


def extraer_url_clasificacion_general(soup_etapa: BeautifulSoup) -> str | None:
    elemento = soup_etapa.select_one("span[data-ajax-stack]")
    if elemento is None:
        return None

    ajax_stack = json.loads(elemento["data-ajax-stack"])
    return ajax_stack.get("itg")


def parse_posiciones_generales(html: str) -> dict[int, int]:
    soup = BeautifulSoup(html, "html.parser")
    posiciones: dict[int, int] = {}

    for fila in soup.select("tr.rankingTables__row"):
        posicion_celda = fila.select_one("td.rankingTables__row__position span")
        bib = fila.select_one("span[data-bib]")
        if posicion_celda is None or bib is None:
            continue

        posicion_match = re.search(r"\d+", posicion_celda.get_text())
        dorsal_match = re.search(r"\d+", bib.get("data-bib", ""))
        if not posicion_match or not dorsal_match:
            continue

        posiciones[int(dorsal_match.group())] = int(posicion_match.group())

    return posiciones


def scrape_clasificacion_general(soup_ultima_etapa: BeautifulSoup) -> dict[int, int]:
    url_itg = extraer_url_clasificacion_general(soup_ultima_etapa)
    if url_itg is None:
        print("No se encontro la url de la clasificacion general en la etapa")
        return {}

    html = get_html(BASE_URL + url_itg)
    return parse_posiciones_generales(html)


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


def update_posicion_general(posiciones_por_dorsal: dict[int, int], config: dict[str, Any]) -> None:
    posiciones_con_puntos = {int(p) for p in config["puntuacion"]["clasificacion_general"]}

    with CICLISTAS_PATH.open("r", encoding="utf-8") as handle:
        ciclistas = json.load(handle)

    for ciclista in ciclistas:
        posicion = posiciones_por_dorsal.get(ciclista["dorsal"])
        ciclista["logros"]["posicion_general"] = posicion if posicion in posiciones_con_puntos else None

    with CICLISTAS_PATH.open("w", encoding="utf-8") as handle:
        json.dump(ciclistas, handle, ensure_ascii=False, indent=2)
    print(f"Updated posicion_general for {len(ciclistas)} riders in {CICLISTAS_PATH}")


def main() -> None:
    config = load_config()
    ganadores, soup_ultima_etapa = scrape_ganadores(int(config["total_etapas"]))
    save_ganadores(ganadores)
    update_victorias_etapa(ganadores)

    if soup_ultima_etapa is not None:
        posiciones_generales = scrape_clasificacion_general(soup_ultima_etapa)
        update_posicion_general(posiciones_generales, config)
    else:
        print("Sin etapas con resultado todavia, no se actualiza la clasificacion general")

    update_etapa_actual(config, ganadores)
    touch_ultima_actualizacion(config)


if __name__ == "__main__":
    main()
