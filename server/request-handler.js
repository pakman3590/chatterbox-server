/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
let data = {
  counter: 0,
  storage: [
    // {
    //   message_id: 0,
    //   username: 'Chell',
    //   text: 'The cake is a lie',
    //   roomname: 'lobby',
    //   createdAt: new Date()
    // }
  ]
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10 // Seconds.
};

var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  const writeHeaders = (statusCode) => {
    let headers = defaultCorsHeaders;
    headers['Content-Type'] = 'application/JSON';
    if (statusCode === '404') {
      headers['Content-Type'] = 'text/plain';
    }
    response.writeHead(statusCode, headers);
  };

  // check url path
  if (request.url === '/classes/messages') {
    // REQUEST METHOD: GET
    // if request method is get
    if (request.method === 'GET') {
      // set headers + status code
      writeHeaders(200);
      // stringify data storage array into response end
      response.end(JSON.stringify(data.storage));
    }

    // REQUEST METHOD: POST
    // if request method is post
    if (request.method === 'POST') {
      // extract data from request end
      let message = '';
      request.on('data', chunk => {
        message += chunk;
      });
      // response body object
      let resObj = {};
      request.on('end', () => {
        let newDate = new Date();
        message = JSON.parse(message);
        // add message ID + timestamp
        // eslint-disable-next-line camelcase
        message.message_id = data.counter;
        message.createdAt = newDate;
        // add message into top of storage
        data.storage.unshift(message);
        // eslint-disable-next-line camelcase
        resObj.message_id = data.counter;
        resObj.createdAt = newDate;
        data.counter ++;
        // write response
        // set headers + status code
        writeHeaders(201);
        response.end(JSON.stringify([resObj]));
      });
    }

    // REQUEST METHOD: OPTIONS?
    if (request.method === 'OPTIONS') {
      writeHeaders(200);
      response.end('options response');
    }
  } else {
    // return error code
    writeHeaders(404);
    response.end('Not Found');
  }

};

exports.requestHandler = requestHandler;
exports.data = data;//data?

