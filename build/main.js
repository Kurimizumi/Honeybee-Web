//Import the honeybee module
const honeybee = require('../index.js');

//Define key
const key = '-----BEGIN PUBLIC KEY-----\r\n' +
'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA8O9RtFl/fzWr3YgVk0Jq\r\n' +
'YyrWYe5v03NMgxsBpK3VStl0chc7BAdAm4nNT2JoRbL4Q3EvODsYOGzqwr3iphHD\r\n' +
'XATkMyWiKX1fh9yl+qZB2cz0O7heSIEYOt4fbdebPn5G2xU1gZuluBVHHK+czEml\r\n' +
'ZOv/5iV2JyXt4v++4wKIW+cja2bm8x6bI+e5PRMXYpGw7JCqReuK2fUhswzM8mod\r\n' +
'IoE+tA2YBcaCuYtZ2Ak+DhxzBkHfdmTc/RPHDN2a8JZ8PUC7BgAzCiHUOYM0gFQr\r\n' +
'+qXr0CbHuSyyDbTRALTPG+qqyWDRbhRhiCHHLx4lxD2tclnpX4U+dSo60didkOT8\r\n' +
'EwIDAQAB\r\n' +
'-----END PUBLIC KEY-----';

//Define settings
const settings = {
  encryption: {
    key: key
  }
};
console.log('started');
//Call the honeybee function
honeybee(settings, function(eventHandler) {
  //Define our submission handler, to handle what happens once we submit work
  const submitHandler = function(error, success) {
    if(error) {
      //If we errored, tell the client
      console.log(error.toString());
      return;
    }
    //Tell the client the status of our submission
    console.log('Submission ' + (success ? 'succeeded' : 'failed'));
    //Request more work, and pass it to the work handler
    eventHandler.request(workHandler);
  };
  //Define our work handler, to handle what happens when we receive work
  const workHandler = function(error, work) {
    //If we errored, tell the client
    if(error) {
      console.log(error.toString());
      return;
    }
    //Define our piSection variable, to store the part of pi we calculated
    let piSection = 0;
    //Define n for Leibniz's formula, and calculate current position in it
    let n = 1 + (4*10000*work.counter);
    //Loop from 0 (incl) to 1000000000 (excl)
    for(let i=0; i < 10000; i++) {
      //Do the current pair of the series
      piSection += (4/n)-(4/(n+2));
      //Add 4 to n
      n += 4;
    }
    //Log the piSection we just calculated to the console
    console.log('Calculated PiSection: ' + piSection);
    //Submit the work and callback to the submitHandler
    eventHandler.submit(piSection, submitHandler);
  };
  //Callback once we know the client is registered and ready
  eventHandler.once('registered', function() {
    //Request our first piece of work
    eventHandler.request(workHandler);
  });
});
