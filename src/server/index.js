/* eslint-disable no-useless-escape */
/* eslint-disable indent */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
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
// const config = {
// eslint-disable-next-line max-len
//     connectionString: 'Driver=SQL Server;Server=hbc-ms-sql801;Database=rts_prd;username=intranet\\vndbsubramani;password=Kanikajun@24;Trusted_Connection=true;'
// };

app.get('/', (req, res) => {
    console.log('testing');
    res.send('Hello World!');
});

app.post('/api/getCount', (req, res) => {
    const {
 selectedBanner, selectedStoreType, selectedVendor, startDate, endDate, startTime, endTime
} = req.body;

    let serverNames = '';
    let sqlQuery = '';
    let queryConditionLine = '';
    if (selectedBanner === 'Saks') {
        serverNames = '(\'RTSP05\',\'RTSP06\',\'RTSP07\')';
    } else {
        serverNames = '(\'RTS1\',\'RTS2\')';
        if (selectedStoreType === 'Online') {
            const storeNumber = selectedBanner === 'Bay' ? '91963' : '9199';
            queryConditionLine = `and store = '${storeNumber}' `;
        } else {
            const storeNumber = '(\'91963\',\'9199\')';
            queryConditionLine = `and store not in ${storeNumber}`;
        }
    }
    sqlQuery = `select TransactionType,Vendor,TransactionActionCode ,count(*) as TranCount from transactiondetail 
                    where SourceLogDateTime >= '${startDate} ${startTime}' and SourceLogDateTime <= '${endDate} ${endTime}'
                    and server in ${serverNames} and Vendor = '${selectedVendor}' ${queryConditionLine} 
                    group by TransactionType,Vendor,transactionactioncode
                    order by TransactionType,Vendor,transactionactioncode `;
    console.log(sqlQuery);
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
        // console.log(`connection issue ${error}`);
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
        sqlQuery = `select TransactionType,Vendor,TransactionActionCode ,count(*) as TranCount from transactiondetail 
                        where SourceLogDateTime >= '${startDate} ${startTime}' and SourceLogDateTime <= '${endDate} ${endTime}' 
                        and ${queryConditionLine}
                        group by TransactionType,Vendor,transactionactioncode
                        order by TransactionType,Vendor,transactionactioncode`;
    } else {
        sqlQuery = `select TransactionType,Vendor,TransactionActionCode ,count(*) as TranCount from transactiondetail 
                        where SourceLogDateTime >= '${startDate} ${startTime}' and SourceLogDateTime <= '${endDate} ${endTime}' 
                        and invoicenumber = '${invoice}'
                        group by TransactionType,Vendor,transactionactioncode
                        order by TransactionType,Vendor,transactionactioncode`;
    }
    console.log(sqlQuery);
    const pool = new sql.ConnectionPool(config);
    // console.log(pool);
    pool.connect().then(() => {
        pool.request().query(sqlQuery, (err, result) => {
              if (err) { res.send(err); } else {
                  res.send({
                      data: result.recordset
                  });
              }
          });
          sql.close();
    }).catch((error) => {
        console.log(`connection isse ${error}`);
        sql.close();
        res.status(400).send(error);
      });
});

app.post('/api/getTranDetails', (req, res) => {
    const {
 selectedBanner, selectedStoreType, selectedVendor, selectedTranStatus,
 startDate, endDate, startTime, endTime
} = req.body;

    let serverNames = '';
    let sqlQuery = '';
    let transactionActionCode = '';
    let queryConditionLine = '';

    if (selectedTranStatus === '11') {
        transactionActionCode = 'TransactionActionCode not in (\'0\',\'1\',\'2\',\'10\')';
    } else {
        transactionActionCode = `TransactionActionCode = '${selectedTranStatus}'`;
    }

    if (selectedBanner === 'Saks') {
        serverNames = '(\'RTSP05\',\'RTSP06\',\'RTSP07\')';                        
    } else {
        serverNames = '(\'RTS1\',\'RTS2\')';
        if (selectedStoreType === 'Online') {
            const storeNumber = selectedBanner === 'Bay' ? '91963' : '9199';
            queryConditionLine = `store = '${storeNumber}'`;
        } else {
            const storeNumber = '(\'91963\',\'9199\')';
            queryConditionLine = `store not in ${storeNumber} `;
        }
    }
    sqlQuery = `select Store,Terminal,TransactionDomain,TransactionType,Vendor,VendorNode,AccountType,Amount,TransactionActionCode,TransactionIsoResponse,AccountDisplay,SourceLogDateTime,Server,InvoiceNumber,AuthCode from transactiondetail 
                    where SourceLogDateTime >= '${startDate} ${startTime}' and SourceLogDateTime <= '${endDate} ${endTime}' 
                    and server in ${serverNames} and Vendor = '${selectedVendor}' and ${transactionActionCode} and ${queryConditionLine}
                    order by transactionactioncode`;
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
        sqlQuery = `select Store,Terminal,TransactionDomain,TransactionType,Vendor,VendorNode,AccountType,Amount,TransactionActionCode,TransactionIsoResponse,AccountDisplay,SourceLogDateTime,Server,InvoiceNumber,AuthCode from transactiondetail 
                        where SourceLogDateTime >= '${startDate} ${startTime}' and SourceLogDateTime <= '${endDate} ${endTime}' 
                        and ${queryConditionLine}`;
    } else {
        sqlQuery = `select Store,Terminal,TransactionDomain,TransactionType,Vendor,VendorNode,AccountType,Amount,TransactionActionCode,TransactionIsoResponse,AccountDisplay,SourceLogDateTime,Server,InvoiceNumber,AuthCode from transactiondetail 
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
        res.status(400).send(error);
      });
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
