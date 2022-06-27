const { google } = require('googleapis')
const fs = require('fs')
const path = require('path')

const googleApiKey = process.env.GOOGLE_API_JSON_KEY

const authenticateGoogle = async () => {

    if(googleApiKey && fs.existsSync(googleApiKey)) {
        const auth = new google.auth.GoogleAuth({
            keyFilename: googleApiKey, 
            scopes: 'https://www.googleapis.com/auth/spreadsheets'
        })
        const client = await auth.getClient();
        const service = google.sheets({version: 'v4', auth: client});

        return service
    } else {
        console.error("Plese set GOOGLE_API_JSON_KEY to Google API json file")
    }

    return undefined;
}

const updateSheets = async ({dataSpreadsheet, symbol}, date, orderId, price, quote, quantity) => {

    const service = await authenticateGoogle()
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

module.exports = {
    updateSheets
}