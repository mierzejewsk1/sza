const { instances } = require("./mysqlConfig");
const mysql = require("mysql2");
const { highlight } = require("sql-highlight");

class Connector {
  name;
  #writerPool;
  #readerPool;

  constructor(name, writers, readers) {
    this.name = name;

    this.#writerPool = mysql.createPoolCluster();
    for (let writer of writers) this.#writerPool.add(writer);

    this.#readerPool = mysql.createPoolCluster();
    for (let reader of readers) this.#readerPool.add(reader);
  }

  select(sql, values, dump) {
    return new Promise((resolve, reject) => {
      this.#readerPool.getConnection((error, connection) => {
        if (error) return reject(error);
        let query = connection.query(
          {
            sql: sql,
            values: values,
            timeout: 30000,
          },
          (error, result, fields) => {
            connection.release();
            if (dump) console.log(highlight(query.sql));
            if (error) return reject(error);
            return resolve(result);
          }
        );
      });
    });
  }

  update(sql, values, dump) {
    return new Promise((resolve, reject) => {
      this.#writerPool.getConnection((error, connection) => {
        if (error) return reject(error);
        let query = connection.query(
          {
            sql: sql,
            values: values,
            timeout: 30000,
          },
          (error, result, fields) => {
            connection.release();
            if (dump) console.log(highlight(query.sql));
            if (error) return reject(error);
            return resolve(result);
          }
        );
      });
    });
  }

  insert(sql, values, dump) {
    return new Promise((resolve, reject) => {
      this.#writerPool.getConnection((error, connection) => {
        if (error) return reject(error);
        let query = connection.query(
          {
            sql: sql,
            values: values,
            timeout: 30000,
          },
          (error, result, fields) => {
            connection.release();
            if (dump) console.log(highlight(query.sql));
            if (error) return reject(error);
            return resolve(result);
          }
        );
      });
    });
  }

  delete(sql, values, dump) {
    return new Promise((resolve, reject) => {
      this.#writerPool.getConnection((error, connection) => {
        if (error) return reject(error);
        let query = connection.query(
          {
            sql: sql,
            values: values,
            timeout: 30000,
          },
          (error, result, fields) => {
            connection.release();
            if (dump) console.log(highlight(query.sql));
            if (error) return reject(error);
            return resolve(result);
          }
        );
      });
    });
  }
}

let connectors = {};

for (let instance of instances) {
  let connector = new Connector(
    instance.name,
    instance.writers,
    instance.readers
  );
  connectors[connector.name] = connector;
}

const sql = (strings, ...expr) =>
  strings
    .map((str, index) => str + (expr.length > index ? String(expr[index]) : ""))
    .join("");

module.exports = {
  mysql: connectors,
  sql,
};
