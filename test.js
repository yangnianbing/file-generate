var fs = require('fs');
var path = require('path');


function walkFile(file, callback){
    var stat = fs.statSync(file);
    if(stat.isFile()){
        callback(file);
    }else if(stat.isDirectory()){
        var files = fs.readdirSync(file);
        var $this = arguments.callee;
        files.forEach(function(filename){
            var newFile = path.join(file, filename);
            $this(newFile, callback);
        })
    }
}

walkFile('./node_modules', function(path){
    console.log(path);
})