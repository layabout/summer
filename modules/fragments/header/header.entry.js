require('./header.less');

document.write("this is a header js. hoho");
$(".desc").html('jquery plugin test ...');

require.ensure([], function(){
  $("#testButton").on('click',function(){
    var Math = require('./hello.js');
    alert(Math.pi);
  })
});
