module.exports = {
  instances: [
    {
      name: "app",
      writers: [
        {
          connectionLimit: 5,
          host: process.env.MYSQL_URL,
          port: process.env.MYSQL_PORT,
          user: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DATABASE,
          charset: "utf8mb4",
        },
      ],
      readers: [
        {
          connectionLimit: 5,
          host: process.env.MYSQL_URL,
          port: process.env.MYSQL_PORT,
          user: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DATABASE,
          charset: "utf8mb4",
        },
      ],
    },
  ],
};
