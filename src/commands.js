const { Spot } = require('@binance/connector')

const apiKey = process.env.BINANCE_API_KEY
const apiSecret = process.env.BINANCE_API_SECRET

const client = new Spot(apiKey, apiSecret)

const buy = async ({ symbol, quantity}) => {
    if(apiKey && apiSecret) {
        if(symbol) {
            let parameters = {
                quoteOrderQty: quantity,
                newOrderRespType: "RESULT"
            }

            client.newOrder(symbol, "BUY", "MARKET", parameters)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                return {error: error};
            })
        } else {
            console.error("-s, --symbol <symbol> is required")
            return {error: true};
        }

    } else {
        console.error("Please set BINANCE_API_KEY and/or BINANCE_API_SECRET");
        return {error: true};
    }
}

const updateSheets = async (data, {symbol, id}) => {

}

module.exports = {
    buy
}