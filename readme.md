# MySQL Pool Driver for Nodejs

I made this ugly wrapper in a migration project, use promises instead *caLLBacKS*

## How to use

**Require**

```javascript
const dbDriver = require('./mysql-driver.js');
const conn = dbDriver.newInstance(connection_data);
```

**Making a query**

```javascript
(async () => {
    // Example getting user and password
    const user = 'XxXGaMeRXxX';
    let result;

    try{
        // escaping suport
        result = await conn.query('SELECT id, username, password FROM users WHERE username = ?', [user]);       

    }
    catch(ex){
        //Catching an error
        console.log(ex);
    }

    console.log(result);
})();


/* 
* Or use then-catch
*/

const user = 'XxXGaMeRXxX';

conn.query('SELECT id, username, password FROM users WHERE username = ?', [user])
    .then( result => console.log(result) )
    .catch( error => console.log(error) );

```

## Pool info

This use one connection to try to save resources, if instance is disconnected it opens a new connection

## Suggestions 

Are open for now