var http = require("http"),
    fs = require('fs');

function load_album_list(callback) {
    fs.readdir("albums/", function(err, files) {
        if (err) {
            callback(make_error("file error " + JSON.stringify(err)));
            return;
        }

        var only_dir = [];
        (function iterator(index) {
            if (index == files.length) {
                callback(null, only_dir);
                return;
            }
            fs.stat("albums/" + files[index],
                function(err, stats) {
                    if (err) {
                        callback(make_error("file error " + JSON.stringify(err)));
                        return;
                    }
                    if (stats.isDirectory()) {
                        var obj = { name: files[index] };
                        only_dir.push(obj);
                    }
                    iterator(index + 1);
                });
        })(0);
    });
}

function load_album(album_name, callback) {
    fs.readdir("albums/" + album_name, function(err, files) {
        if (err) {
            if (err.code == "ENOENT") { callback(no_such_album()); } else {
                callback(make_error('file_error ', JSON.stringify(err)));
            }
            return;
        }
        var only_files = [];
        var path = "albums/" + album_name + "/";
        (function iterator(index) {
            if (index == files.length) {
                var obj = { short_name: album_name, photos: only_files };
                callback(null, obj);
                return;
            }
            fs.stat(path + file[index], function(err, stats) {
                if (err) {
                    callback(make_error("file error", JSON.stringify(err)));
                    return;
                }
                if (stats.isFile()) {
                    var obj = { filename: files[index], desc: files[index] };
                    only_files.push(obj);
                }
                iterator(index + 1);
            });
        })(0);
    });
}

function handle_incoming_request(req, res) {
    console.log('INCOMING REQUEST: ' + req.method + " " + req.url);
    // load_album_list(function(err, albums) {
    //     if (err) {
    //         res.writeHead(503, { "Content-Type": "application/json" });
    //         res.end(JSON.stringify(err) + "\n");
    //         return;
    //     }
    //     var out = { error: null, data: { albums: albums } };
    //     res.writeHead(200, { "Content-Type": 'application/json' });
    //     res.end(JSON.stringify(out) + "\n");
    // });

    if (req.url == '/albums.json') {
        handle_list_albums(req, res);
    } else if (req.url.substr(0, 7) == '/albums' && req.url.substr(req.url.length - 5) == '.json') {
        handle_get_album(req, res);
    } else { send_failure(res, 404, invalid_resource()); }
}

function handle_list_albums(req, res) {
    load_album_list(function(err, albums) {
        if (err) {
            send_failure(res, 500, err);
            return;
        }
        send_success(res, { albums: albums });
    });
}

var s = http.createServer(handle_incoming_request);
s.listen(8000);