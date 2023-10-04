#!/usr/bin/env sh
# Download epsilon.js from Firebase Storage
url="https://firebasestorage.googleapis.com/v0/b/upsilon-binfiles.appspot.com/o/dev%2Fsimulator%2Fepsilon.js"
token=$(curl "${url}" | grep -oP '(?<="downloadTokens": ")[^"]+')
curl -L -o public/simulator/epsilon.js "${url}?alt=media&token=${token}"

# Downoad epsilon-casworks.js from Parisse's website
url="https://www-fourier.univ-grenoble-alpes.fr/~parisse/numworks/epsilon.js"
curl -L -o public/simulator/epsilon-casworks.js "${url}"

# Download xcas-ups.js from Parisse's website
url="https://www-fourier.univ-grenoble-alpes.fr/~parisse/numworks/xcas_ups.js"
curl -L -o public/simulator/xcas-ups.js "${url}"