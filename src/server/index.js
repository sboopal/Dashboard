/* eslint-disable no-useless-escape */
/* eslint-disable indent */
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('dist'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// eslint-disable-next-line global-require
const sql = require('mssql/msnodesqlv8');

// config for your database
const config = {
    database: 'rts_prd',
    server: 'hbc-ms-sql801',
    // driver: 'msnodesqlv8',
    options: {
        trustedConnection: true
    }
};

app.post('/api/getCount', (req, res) => {
    const {
 selectedBanner, selectedStoreType, selectedVendor, startDate, endDate, startTime, endTime
} = req.body;

    let serverNames = '';
    let sqlQuery = '';

    if (selectedBanner === 'Saks') {
        serverNames = '(\'RTSP05\',\'RTSP06\',\'RTSP07\')';
        sqlQuery = `select TransactionActionCode ,count(*) as TranCount from transactiondetail 
                        where SourceLogDateTime >= '${startDate} ${startTime}' and SourceLogDateTime <= '${endDate} ${endTime}' 
                        and server in ${serverNames} and Vendor = '${selectedVendor}'
                        group by transactionactioncode
                        order by transactionactioncode`;
    } else {
        serverNames = '(\'RTS1\',\'RTS2\')';
        if (selectedStoreType === 'Online') {
            const storeNumber = selectedBanner === 'Bay' ? '91963' : '9199';
            sqlQuery = `select TransactionActionCode ,count(*) as TranCount from transactiondetail 
            where SourceLogDateTime >= '${startDate} ${startTime}' and SourceLogDateTime <= '${endDate} ${endTime}'
                        and server in ${serverNames} and Vendor = '${selectedVendor}' and store = '${storeNumber}'
                        group by transactionactioncode
                        order by transactionactioncode`;
        } else {
            const storeNumber = '(\'91963\',\'9199\')';
            sqlQuery = `select TransactionActionCode ,count(*) as TranCount from transactiondetail 
                        where SourceLogDateTime >= '${startDate} ${startTime}' and SourceLogDateTime <= '${endDate} ${endTime}'
                        and server in ${serverNames} and Vendor = '${selectedVendor}' and store not in ${storeNumber}
                        group by transactionactioncode
                        order by transactionactioncode`;
        }
    }
    const pool = new sql.ConnectionPool(config);
    pool.connect().then(() => {
        pool.request().query(sqlQuery, (err, result) => {
              if (err) { res.send(err); } else {
                //   console.log(result.recordset);
                  res.send({
                      data: result.recordset
                  });
              }
          });
          sql.close();
    }).catch((error) => {
        // console.log(`connection isse ${error}`);
        sql.close();
        res.status(600).send(error);
      });
});

app.post('/api/getStoreCount', (req, res) => {
    const {
 store, terminal, account, amount, invoice, startDate, endDate, startTime, endTime
} = req.body;

    let sqlQuery = '';

    if (store !== '') {
        let queryConditionLine = `store = '${store}'`;
        if (terminal !== '') {
            queryConditionLine = `${queryConditionLine} and terminal = '${terminal}'`;
        }
        if (account !== '') {
            queryConditionLine = `${queryConditionLine} and accountdisplay like '%${account}'`;
        }
        if (amount !== '') {
            queryConditionLine = `${queryConditionLine} and amount = '${amount}'`;
        }
        sqlQuery = `select TransactionActionCode ,count(*) as TranCount from transactiondetail 
                        where SourceLogDateTime >= '${startDate} ${startTime}' and SourceLogDateTime <= '${endDate} ${endTime}' 
                        and ${queryConditionLine}
                        group by transactionactioncode
                        order by transactionactioncode`;
    } else {
        sqlQuery = `select TransactionActionCode ,count(*) as TranCount from transactiondetail 
                        where SourceLogDateTime >= '${startDate} ${startTime}' and SourceLogDateTime <= '${endDate} ${endTime}' 
                        and invoicenumber = '${invoice}'
                        group by transactionactioncode
                        order by transactionactioncode`;
    }
    console.log(sqlQuery);
    const pool = new sql.ConnectionPool(config);
    pool.connect().then(() => {
        pool.request().query(sqlQuery, (err, result) => {
              if (err) { res.send(err); } else {
                  // console.log(result.recordset);
                  res.send({
                      data: result.recordset
                  });
              }
          });
          sql.close();
    }).catch((error) => {
        // console.log(`connection isse ${error}`);
        sql.close();
        res.status(600).send(error);
      });
});

app.post('/api/getTranDetails', (req, res) => {
    const {
 selectedBanner, selectedStoreType, selectedVendor, selectedTranStatus,
 startDate, endDate, startTime, endTime
} = req.body;

    let serverNames = '';
    let sqlQuery = '';

    if (selectedBanner === 'Saks') {
        serverNames = '(\'RTSP05\',\'RTSP06\',\'RTSP07\')';
        sqlQuery = `select Store,Terminal,TransactionDomain,TransactionType,AccountType,Amount,TransactionActionCode,TransactionIsoResponse,AccountDisplay,SourceLogDateTime,Server,InvoiceNumber,AuthCode from transactiondetail 
                        where SourceLogDateTime >= '${startDate} ${startTime}' and SourceLogDateTime <= '${endDate} ${endTime}' 
                        and server in ${serverNames} and Vendor = '${selectedVendor}' and TransactionActionCode='${selectedTranStatus}'
                        order by transactionactioncode`;
    } else {
        serverNames = '(\'RTS1\',\'RTS2\')';
        if (selectedStoreType === 'Online') {
            const storeNumber = selectedBanner === 'Bay' ? '91963' : '9199';
            sqlQuery = `select Store,Terminal,TransactionDomain,TransactionType,AccountType,Amount,TransactionActionCode,TransactionIsoResponse,AccountDisplay,SourceLogDateTime,Server,InvoiceNumber,AuthCode from transactiondetail 
            where SourceLogDateTime >= '${startDate} ${startTime}' and SourceLogDateTime <= '${endDate} ${endTime}'
                        and server in ${serverNames} and Vendor = '${selectedVendor}' and store = '${storeNumber}' and TransactionActionCode='${selectedTranStatus}'
                        order by transactionactioncode`;
        } else {
            const storeNumber = '(\'91963\',\'9199\')';
            sqlQuery = `select Store,Terminal,TransactionDomain,TransactionType,AccountType,Amount,TransactionActionCode,TransactionIsoResponse,AccountDisplay,SourceLogDateTime,Server,InvoiceNumber,AuthCode from transactiondetail 
                        where SourceLogDateTime >= '${startDate} ${startTime}' and SourceLogDateTime <= '${endDate} ${endTime}'
                        and server in ${serverNames} and Vendor = '${selectedVendor}' and store not in ${storeNumber} and TransactionActionCode='${selectedTranStatus}'
                        order by transactionactioncode`;
        }
    }
    const pool = new sql.ConnectionPool(config);
    pool.connect().then(() => {
        pool.request().query(sqlQuery, (err, result) => {
              if (err) { res.send(err); } else {
                  // console.log(result.recordset);
                  res.send({
                      data: result.recordset
                  });
              }
          });
          sql.close();
    }).catch((error) => {
        sql.close();
        // console.log(`connection isse ${error}`);
        res.status(400).send({
            error
        });
      });
});

app.post('/api/getStoreTranDetails', (req, res) => {
    const {
 store, terminal, account, amount, invoice, startDate, endDate, startTime, endTime
} = req.body;

    let sqlQuery = '';

    if (store !== '') {
        let queryConditionLine = `store = '${store}'`;
        if (terminal !== '') {
            queryConditionLine = `${queryConditionLine} and terminal = '${terminal}'`;
        }
        if (account !== '') {
            queryConditionLine = `${queryConditionLine} and accountdisplay like '%${account}'`;
        }
        if (amount !== '') {
            queryConditionLine = `${queryConditionLine} and amount = '${amount}'`;
        }
        sqlQuery = `select Store,Terminal,TransactionDomain,TransactionType,AccountType,Amount,TransactionActionCode,TransactionIsoResponse,AccountDisplay,SourceLogDateTime,Server,InvoiceNumber,AuthCode from transactiondetail 
                        where SourceLogDateTime >= '${startDate} ${startTime}' and SourceLogDateTime <= '${endDate} ${endTime}' 
                        and ${queryConditionLine}`;
    } else {
        sqlQuery = `select Store,Terminal,TransactionDomain,TransactionType,AccountType,Amount,TransactionActionCode,TransactionIsoResponse,AccountDisplay,SourceLogDateTime,Server,InvoiceNumber,AuthCode from transactiondetail 
                        where SourceLogDateTime >= '${startDate} ${startTime}' and SourceLogDateTime <= '${endDate} ${endTime}' 
                        and invoicenumber = '${invoice}'`;
    }
    console.log(sqlQuery);
    const pool = new sql.ConnectionPool(config);
    pool.connect().then(() => {
        pool.request().query(sqlQuery, (err, result) => {
              if (err) { res.send(err); } else {
                  // console.log(result.recordset);
                  res.send({
                      data: result.recordset
                  });
              }
          });
          sql.close();
    }).catch((error) => {
        // console.log(`connection isse ${error}`);
        sql.close();
        res.status(600).send(error);
      });
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
