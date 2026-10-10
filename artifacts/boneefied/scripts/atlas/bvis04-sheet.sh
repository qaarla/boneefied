#!/bin/bash
# contact sheet: bash scripts/atlas/bvis04-sheet.sh out.png [pattern]
cd "$(dirname "$0")/../.."
magick montage ${2:-assets/images/anatomy/bvis04-atlas/*.png} -tile 3x -geometry 700x483+6+6 -background '#888' $1 2>/dev/null
