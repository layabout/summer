var path = require('path');
var fs = require('fs');

var entries = {};

function traverse(dir, callback) {
    fs.readdirSync(dir).forEach(function (file) {
        var pathname = path.join(dir, file);

        if (fs.statSync(pathname).isDirectory()) {
            traverse(pathname, callback);
        } else {
            callback(pathname);
        }
    });
}

//扫描入口文件
function getEntries() {
  traverse('modules', function(pathname) {
    if (pathname.match(/(.+)\.js$/)) {
      var path = frontSlash('./' + pathname);
      var strs = path.split('/');
      //约定最后一层目录名作为文件名
      var filename = strs[strs.length - 2];
      entries[filename] = path;
      console.log('****** find entry: ' + path);
    }
  });
  //剥离jquery到公用库
  entries['vendors'] = ['jquery'];
  return entries;
}

//修正linux\windows系统正反斜杠差异
function frontSlash(path) {
    return path.replace(/\\/g, '/');
}

exports.getEntries = getEntries;
