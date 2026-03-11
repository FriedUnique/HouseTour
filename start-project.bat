:: GEMINI CODE
@echo off
TITLE Python Local Server
:: Launch the default browser to the local address
start http://localhost:8000

:: Start the Python HTTP server
:: Using 'python -m http.server' for Python 3
echo Starting server on port 8000...
python -m http.server 8000
pause