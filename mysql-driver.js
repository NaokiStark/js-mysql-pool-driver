const mysql = require('mysql');

/**
 * Class MySqlDriver
 * 
 * This class is a mysql's wrapper to promises to avoid callbacks that everyone hates
 */
class MySqlDriver {
    constructor(connection) {
        this.pool = mysql.createPool(connection);
        this.cachedConn = null;
    }

    /**
     * Returns a pool connection
     * @returns {Promise<mysql.PoolConnection>} connection resolution
     */
    connection() {
        return new Promise(async (resolve, rejects) => {

            // recycle connection
            if (this.cachedConn) {

                let disconnected = await new Promise(resolve => {
                    this.cachedConn.ping(err => {
                        resolve(err);
                    });
                });

                if (!disconnected) {
                    resolve(this.cachedConn);
                }
                else {
                    this.pool.getConnection((err, conn) => {
                        if (err) rejects(err);
                        this.cachedConn = conn;
                        resolve(conn);
                    });
                }
            }
            else {
                this.pool.getConnection((err, conn) => {
                    if (err) rejects(err);
                    this.cachedConn = conn;
                    resolve(conn);
                });
            }
        });
    }

    /**
     * Makes MySQL query
     * @param {String} q Query string
     * @param {Array<String>} values Values to be escaped (not required, but recommended)
     * @returns {Promise<any>} Query Result
     */
    query(q, values = null) {
        return new Promise((resolve, rejects) => {
            // get connection
            this.connection().then(conn => {
                if (values == null) {

                    // makes query without value escaping
                    conn.query(q, (err, res) => {
                        if (err) {
                            rejects(err);
                        }
                        resolve(res);
                    });
                }
                else {

                    // makes query with value escaping
                    conn.query(q, values, (err, res) => {
                        if (err) {
                            rejects(err);
                        }
                        resolve(res);
                    });
                }
            }).catch(err => rejects(err));
        });
    }
    /**
     * Ends pool
     */
    end() {
        this.pool.end();
    }
}

module.exports = {
    /**
     * Returns a new MySqlDriver connection with a pool
     * @param {object} connection 
     * @returns {MySqlDriver} connection instance
     */
    newInstance: function (connection) {
        return new MySqlDriver(connection);
    }
}