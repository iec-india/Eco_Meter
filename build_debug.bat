@echo off
cd /d d:\Eco\eco-meterV2
npm run build > build-output.txt 2>&1
if exist build-output.txt (
  type build-output.txt
) else (
  echo no output file
)
pause
