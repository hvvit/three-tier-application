//set up dependencies
const express = require("express");
const redis = require("redis");
const bodyParser = require("body-parser");

//setup port constants
const port_redis = process.env.PORT || 6379;
const port = process.env.PORT || 5000;

//configure redis client on port 6379 and host in redis-server as it will be specified in the Docker-compose yaml
const redis_client = redis.createClient({
    host: 'redis-server',
    port: port_redis
});

//configure express server
const app = express();

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// function added for realtime wait for fetching data
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

//Middleware Function to Check Cache
checkCache = (req, res, next) => {
  const { name } = req.params;

  redis_client.get(name, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    }
    //if no match found
    if (data != null) {
      datanew=JSON.parse(data);
      res.json(datanew);
    } else {
      //proceed to next middleware function
      next();
    }
  });
};


// Endpoint: Get /name/:name

app.get("/name/:name", checkCache,async (req, res) => {
try {
  const { name } = req.params;
  greeting= "Hello Mr. " + name;
   await sleep(200);
  redis_client.setex(name, 60, JSON.stringify(greeting));
  return res.json(greeting);
}
catch (error) {
  console.log(error);
  return res.status(500).json(error);
}
});



//listen on port 5000;
app.listen(port, () => console.log(`Server running on Port ${port}`));