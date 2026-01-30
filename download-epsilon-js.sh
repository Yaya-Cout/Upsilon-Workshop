#!/usr/bin/env sh
# # Download epsilon.js from Firebase Storage
# url="https://firebasestorage.googleapis.com/v0/b/upsilon-binfiles.appspot.com/o/dev%2Fsimulator%2Fepsilon.js"
# token=$(curl "${url}" | grep -oP '(?<="downloadTokens": ")[^"]+')
# curl -L -o public/simulator/epsilon.js "${url}?alt=media&token=${token}"

# Download epsilon.js from Upsilon binfiles
url="https://raw.githubusercontent.com/Yaya-Cout/Upsilon-binfiles/refs/heads/main/binaries/dev/simulator/epsilon.js"
curl -L -o public/simulator/epsilon.js "${url}"

if [ $CASWORKS_FALLBACK_TO_CURRENT_VERSION ]
then
# Downoad epsilon-casworks.js from current Upsilon Workshop deployment
url="https://yaya-cout.github.io/Upsilon-Workshop/simulator/epsilon-casworks.js"
curl -L -o public/simulator/epsilon-casworks.js "${url}"

# Download xcas-ups.js from current Upsilon Workshop deployment
url="https://yaya-cout.github.io/Upsilon-Workshop/simulator/xcas-ups.js"
curl -L -o public/simulator/xcas-ups.js "${url}"
else
# Downoad epsilon-casworks.js from Parisse's website
url="https://www-fourier.univ-grenoble-alpes.fr/~parisse/numworks/epsilon.js"
curl -L -o public/simulator/epsilon-casworks.js "${url}"

# Download xcas-ups.js from Parisse's website
url="https://www-fourier.univ-grenoble-alpes.fr/~parisse/numworks/xcas_ups.js"
curl -L -o public/simulator/xcas-ups.js "${url}"
fi
