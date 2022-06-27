#!/usr/bin/env node

const program = require('commander')
const Command = require('./commands')

program.command('buy')
    .description('Place a buy order & fill spreadsheet')
    .option('-s, --symbol <symbol>', 'Symbol to buy, e.g. BTC/EUR')
    .option('-q, --quantity <quantity>', 'Quote order quantity to buy')
    .option('-d, --dataSpreadsheet <dataSpreadsheet>', 'Google spreadsheet to save data to')
    .action(async (args) => {
        const data = await Command.buy(args);
        if(undefined == data.code && undefined == data.error) {
            console.log("[%s] - %s - Bought %s $%s with %s $%s at %s $%s"
                , new Date(data.transactTime).toLocaleString()
                , data.clientOrderId
                , data.fills[0].qty
                , args.symbol.split('/')[0]
                , data.cummulativeQuoteQty
                , args.symbol.split('/')[1]
                , data.fills[0].price
                , args.symbol.split('/')[1]);

                Command.updateSheets(args
                    , new Date(data.transactTime).toLocaleDateString()
                    , data.clientOrderId
                    , data.fills[0].price
                    , data.cummulativeQuoteQty
                    , data.fills[0].qty);
        } else {
            console.log("[%s] - ERROR - Code: %d, msg: %s"
            , new Date().toLocaleString()
            , data.code, data.msg);
        }
    });

program.command('trade')
    .description('Trade using MCDA & BB indicators')
    .option('-s, --symbol <symbol>', 'Symbol to buy, e.g. BTC/EUR')
    .action(async (args) => {
        Command.trade(args);
    });

program.parse(process.argv);