var fs= require('fs'); //adds additonal functionality

// var file;
// var buf = new Buffer(100000);
fs.open(
  'info.txt', 'r',
  function(err, handle) {
<<<<<<< HEAD
    if(err){
      console.log("ERROR: " + err.code + " ( " + err.message +" )")
    }
=======
>>>>>>> 9ad6b0ab823d92f9794df74c7923e7ae234e7545
    var buf = new Buffer(100000);
      // file = handle;
      fs.read(
        handle, buf, 0, 100000, null,
        function (err, length) {
          console.log(buf.toString('utf8', 0, length));
          fs.close(handle, function () {
          });
        }
      );
  }
);


// fs.read(
//   file, buf, 0, 100000, null,
//   function () {
//     console.log(buf.toString());
//     file.close(file, function(){})
//   }
// );
