const Soup = imports.gi.Soup;
const GLib = imports.gi.GLib;
const ByteArray = imports.byteArray;

// THIS WORKS ON FINNHUB'S FREE API - GET YOUR KEY AT https://finnhub.io/
const API_KEY = "";

// Loads tickers from tickers.json
function loadTickers(deskletPath) {
    try {
        global.log(deskletPath);
        const filePath = GLib.build_filenamev([deskletPath, "tickers.json"]);
        const [ok, contents] = GLib.file_get_contents(filePath);
        if (!ok) throw new Error("Couldn't reach tickers.json");

        const text = ByteArray.toString(contents);
        const data = JSON.parse(text);

        if (!Array.isArray(data.tickers))
            throw new Error("Wrong format in tickers.json");
        return data.tickers;

    } catch (e) {
        global.logError("Couldn't reach tickers.json" + e);
        return ["NVDA", "AMZN", "GOOG"];
    }
}

// Loads single stock data
function fetchStock(ticker) {
    return new Promise((resolve, reject) => {
        const session = new Soup.Session();
        const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${API_KEY}`;
        const message = Soup.Message.new("GET", url);

        session.send_and_read_async(message, GLib.PRIORITY_DEFAULT, null, (src, res) => {
            try {
                const bytes = session.send_and_read_finish(res);
                const data = ByteArray.toString(bytes.get_data());
                const json = JSON.parse(data);

                if (json && json.c !== undefined) {
                    resolve({
                        name: ticker,
                        price: `${json.c.toFixed(2)}$`,
                        change: `${json.d >= 0 ? "+" : ""}${json.d.toFixed(2)}`,
                        changePercent: `${json.dp.toFixed(2)}%`
                    });
                } else {
                    reject("Brak danych");
                }
            } catch (e) {
                reject(e);
            }
        });
    });
}

// Loads multiple stocks data
async function fetchStocks(deskletPath, callback) {
    try {
        const tickers = loadTickers(deskletPath);
        const results = await Promise.all(
            tickers.map(ticker =>
                fetchStock(ticker)
                    .catch(() => ({ name: ticker, price: "N/A", change: "Error" }))
            )
        );
        results.sort((a, b) => a.name.localeCompare(b.name));
        callback(null, results);
    } catch (e) {
        callback(e);
    }
}
