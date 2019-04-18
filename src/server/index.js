/* eslint-disable indent */
const express = require('express');
const os = require('os');

const app = express();

app.use(express.static('dist'));
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));

app.get('/api/getData', (req, res) => {
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
    console.log('starting sql');

    const pool = new sql.ConnectionPool(config);
    pool.connect().then(() => {
        pool.request().query('select top 10 Store,Terminal,Vendor,Server,TransactionActionCode from transactiondetail', (err, result) => {
              if (err) { res.send(err); } else {
                  res.send({
                      data: result.recordset
                  });
              }
          });
          sql.close();
    });
    console.log('ending sql');
});


app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
