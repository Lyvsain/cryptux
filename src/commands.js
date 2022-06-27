const { Spot } = require('@binance/connector')
const Utils = require('./utils')

let client, apiKey, apiSecret;
if(!process.env.BINANCE_TESTNET) {
    apiKey = process.env.BINANCE_API_KEY
    apiSecret = process.env.BINANCE_API_SECRET

    client = new Spot(apiKey, apiSecret)
} else {
    apiKey = process.env.BINANCE_TESTNET_API_KEY
    apiSecret = process.env.BINANCE_TESTNET_API_SECRET

    client = new Spot(apiKey, apiSecret, { baseURL: 'https://testnet.binance.vision'})
}

const buy = async ({ symbol, quantity}) => {
    if(apiKey && apiSecret) {
        if(symbol && quantity) {
            let parameters = {
                quoteOrderQty: quantity,
                newOrderRespType: "FULL"
            }

            return client.newOrder(symbol.replace('/', ''), "BUY", "MARKET", parameters)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                return error.response.data;
            })
        } else {
            console.error("-s, --symbol <symbol> is required")
            return {error: true};
        }

    } else {
        console.error("Please set ev BINANCE_API_KEY and/or BINANCE_API_SECRET");
        return {error: true};
    }
}

const trade = ({symbol}) => {
    const callBacks = {
        open: () => console.log('open'),
        close: () => console.log('closed'),
        message: data => console.log('data: %o', JSON.parse(data))
    };
    const wsRef = client.aggTradeWS(symbol.replace('/', ''),  callBacks);
}

module.exports = {
    buy,
    trade
}