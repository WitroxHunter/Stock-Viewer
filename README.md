# Stock Viewer Desklet for Linux Cinnamon

Hello and thank you for checking out my first Cinnamon desklet!
This is a simple stock ticker viewer designed to save you time checking the market.

![Stock Viewer](https://i.postimg.cc/sXLFd00D/Zrzut-ekranu-z-2025-11-01-21-22.png)

## Installation
1. Download or clone the repository into your Cinnamon desklets folder:

`~.local/share/cinnamon/desklets/stock-viewer@Wiktor-ThinkPad-E480`

2. Get your API key from Finnhub and insert it into the 6th line of api.js:

`const API_KEY = "YOUR_API_KEY_HERE";`

3. Set your tickers in tickers.json. Recommended: 3 - 7 tickers to avoid slow loading. Example:

`"tickers": ["AAPL", "GOOGL", "META", "MSFT", "AMZN"]`

## Usage
The desklet will automatically refresh every 5 minutes.
Changing the refresh rate may cause issues if the API request limit is exceeded.

If you see any loading errors, it’s probably due to API limits.
