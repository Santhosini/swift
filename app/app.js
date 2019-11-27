$(document).ready( function() {
  app.initialized()
  .then(function(_client) {
    var client = _client;
    // client.events.on('app.activated',
    //   function() {
    //     client.data.get('contact')
    //     .then(function(data) {
    //       $('#apptext').text("Hiiiii " + data.contact.name);
    //     })
    //     .catch(function(e) {
    //       console.log('Exception - ', e);
    //     });
    //   });
    function createData(userId, eventType, body, keyString) {
      let id = 1;
      let dataObj = {}
      dataObj[id] = {
        'body': body,
        'favorite': false,
      } 
      client.db.set(`${keyString}Ref`, dataObj).then(
      function(data) {
        console.log(data);
        client.db.set(`${keyString}:${id}`, { 'body': body })
      },
      function(error) {

      });
    }
    function updateData(keyString, body, dataObj) {
      let objectKeys = Object.keys(dataObj);
      let length = objectKeys.length;
      let id = length + 1
      if (length >= 10) {
        return;
      } else {
        dataObj[id] = {
          'body': body,
          'favorite': false,
        }
        client.db.set(`${keyString}Ref`, dataObj).then(
          function(data) {
            console.log(data);
            client.db.set(`${keyString}:${id}`, { 'body': body })
          },
          function(error) {

          });
      }
    }
    client.data.get("loggedInUser").then (
      function(data) {
        var replyCallback = function (event) {
          debugger;
          console.log(event.helper.getData());
          var userId = data.loggedInUser.id;
          var eventType = event.type;
          var body = event.data.body;
          console.log(body);
          var keyString = `${userId}:${eventType}`;
          client.db.get(`${keyString}Ref`).then(
            function(data) {
              console.log("If key present update record");
              updateData(keyString, body, data);
            },
            function(error) {
              console.log("If key not present create record");
              createData(userId, eventType, body, keyString);
            });
          client.db.get(`${userId}:${eventType}Ref`).then(
            function(data) {

              console.log(data);
            },
            function(error) {
              console.log(error);
            });
          client.db.get(`${userId}:${eventType}:1`).then(
            function(data) {
              console.log(data);
            },
            function(error) {
              console.log(error);
            });

        };
        client.events.on("ticket.sendReply", replyCallback);
        client.events.on("ticket.addNote", replyCallback);
        client.events.on("ticket.forward", replyCallback);
      },
      function(error) {
      // failure operation
    }
    );
    
  });
});
