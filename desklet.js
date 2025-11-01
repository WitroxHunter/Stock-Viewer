const Desklet = imports.ui.desklet;
const St = imports.gi.St;
const Mainloop = imports.mainloop;

const DeskletDir = imports.ui.deskletManager.deskletMeta["stock-viewer@Wiktor-ThinkPad-E480"].path;
imports.searchPath.push(DeskletDir);
const API = imports.api;

function StockDesklet(metadata, desklet_id) {
    this._init(metadata, desklet_id);
}

StockDesklet.prototype = {
    __proto__: Desklet.Desklet.prototype,

    _init: function(metadata, desklet_id) {
        Desklet.Desklet.prototype._init.call(this, metadata, desklet_id);

        this.container = new St.BoxLayout({
            vertical: true,
            style_class: "stock-container",
        });

        this.setContent(this.container);

        this.loadingLabel = new St.Label({
            text: "Loading tickers...",
        });
        this.container.add_child(this.loadingLabel);

        this._loadData();
    },

    _loadData: function() {
        API.fetchStocks(DeskletDir, (err, stocks) => {
            this.container.destroy_all_children();

            if (err) {
                this.container.add_child(new St.Label({ text: "Błąd: " + err }));
                return;
            }

            stocks.forEach(stock => {
                let row = new St.BoxLayout({ vertical: false, style: "spacing: 8px;" });

                // TICKER
                let nameLabel = new St.Label({
                    text: stock.name,
                    style: "min-width: 50px; font-weight: bold;"
                });

                // %
                let changeLabel = new St.Label({
                    text: stock.changePercent,
                    style: `color: ${stock.change.startsWith('-') ? 'red' : 'limegreen'};`
                });

                // PRICE
                let priceLabel = new St.Label({
                    text: stock.price,
                    style: "min-width: 60px;"
                });

                row.add_child(nameLabel);
                row.add_child(changeLabel);
                row.add_child(priceLabel);

                this.container.add_child(row);
            });
        });

        // REFRESH (EVERY 5 MINUTES)
        Mainloop.timeout_add_seconds(300, () => {
            this._loadData();
            return true;
        });
    }
};

function main(metadata, desklet_id) {
    return new StockDesklet(metadata, desklet_id);
}
