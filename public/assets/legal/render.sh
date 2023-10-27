#!/usr/bin/env bash
# Render a Markdown file to PDF using Pandoc
# Usage: render.sh

PANDOC_OPTIONS="--table-of-contents --number-sections --shift-heading-level-by -1 -V colorlinks=true"

function check_for_pandoc() {
    if ! command -v pandoc &> /dev/null
    then
        echo "Pandoc could not be found"
        # Check distro
        if command -v apt &> /dev/null
        then
            echo "To install Pandoc, run: sudo apt install pandoc"
        elif command -v pacman &> /dev/null
        then
            echo "To install Pandoc, run: sudo pacman -S pandoc"
        elif command -v dnf &> /dev/null
        then
            echo "To install Pandoc, run: sudo dnf install pandoc"
        elif command -v yum &> /dev/null
        then
            echo "To install Pandoc, run: sudo yum install pandoc"
        elif command -v zypper &> /dev/null
        then
            echo "To install Pandoc, run: sudo zypper install pandoc"
        else
            echo "To install Pandoc, see https://pandoc.org/installing.html"
        fi
        echo "Alternatively, to know how to install Pandoc, see https://command-not-found.com/pandoc"
        exit 1
    fi
}


function render_to_format() {
    if pandoc ${PANDOC_OPTIONS} ${INPUT} -o "${OUTPUT}.${1}"
    then
        echo "Rendered ${INPUT} to ${OUTPUT}.${1}"
    else
        echo "Failed to render ${INPUT} to ${OUTPUT}.${1}"
    fi
}

function render() {
    render_to_format "pdf" &
    # render_to_format "docx"
    # render_to_format "odt"
    # render_to_format "html" &
}

function main() {
    check_for_pandoc
    for file in *.md
    do
        INPUT="${file}"
        OUTPUT="${file%.*}"
        echo "Rendering ${file}"
        render
    done
}

main "$@"

wait