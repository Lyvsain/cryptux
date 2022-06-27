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

module.exports = {
    authenticateGoogle
}