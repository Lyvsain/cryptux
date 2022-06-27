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

const updateSheets = async ({dataSpreadsheet, symbol}, date, orderId, price, quote, quantity) => {

    const service = await Utils.authenticateGoogle()
    if(service) {        
        try {
            const result = await service.spreadsheets.values.get({spreadsheetId: dataSpreadsheet, range: `'${symbol}'!A:G`})

            if(result.data) {
                const lastLine = result.data.values.length ;
                const newLine = lastLine + 1
                const update = await service.spreadsheets.values.update({
                    spreadsheetId: dataSpreadsheet,
                    range: `'${symbol}'!A${newLine}:G${newLine}`,
                    valueInputOption: "USER_ENTERED",
                    resource: {
                        values: [
                            [date, orderId
                            , price.replace('.', ',')
                            , quote.replace('.', ',')
                            , quantity.replace('.', ',')
                            , `=D${newLine}+F${lastLine}`
                            , `=E${newLine}+G${lastLine}`]]
                    }
                })
            }
        }catch(e) {
            console.error('Error: %o', e);
        }
    } else { 
        console.error("Google service not set up")
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
    updateSheets, 
    trade
}