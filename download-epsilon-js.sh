#!/usr/bin/env sh
# Download epsilon.js from Firebase Storage
url="https://firebasestorage.googleapis.com/v0/b/upsilon-binfiles.appspot.com/o/dev%2Fsimulator%2Fepsilon.js"
token=$(curl "${url}" | grep -oP '(?<="downloadTokens": ")[^"]+')
curl -L -o public/simulator/epsilon.js "${url}?alt=media&token=${token}"
