var SteviaManager = {
    host: (typeof window.STEVIA_SERVER_HOST === 'undefined') ? 'http://localhost:5555' : window.STEVIA_SERVER_HOST,
    version: (typeof window.STEVIA_SERVER_VERSION === 'undefined') ? 'v1' : window.STEVIA_SERVER_VERSION,

    users: {
        login: function (args) {
            return SteviaManager._doRequest(args, 'users', 'login');
        },
        logout: function (args) {
            return SteviaManager._doRequest(args, 'users', 'logout');
        },
        read: function (args) {
            return SteviaManager._doRequest(args, 'users', 'info');
        },
        update: function (args) {
            return SteviaManager._doRequest(args, 'users', 'update');
        },
        updateEmail: function (args) {
            return SteviaManager._doRequest(args, 'users', 'change-email');
        },
        updatePassword: function (args) {
            return SteviaManager._doRequest(args, 'users', 'change-password');
        },
        resetPassword: function (args) {
            return SteviaManager._doRequest(args, 'users', 'reset-password');
        },
        create: function (args) {
            return SteviaManager._doRequest(args, 'users', 'create');
        },
        delete: function (args) {
            return SteviaManager._doRequest(args, 'users', 'delete');
        }
    },

    jobs: {
        create: function (args) {
            return SteviaManager._doRequest(args, 'jobs', 'create');
        },
        delete: function (args) {
            return SteviaManager._doRequest(args, 'jobs', 'delete');
        },
        info: function (args) {
            return SteviaManager._doRequest(args, 'jobs', 'info');
        },
        reportError(args) {
            return SteviaManager._doRequest(args, 'jobs', 'report-error');
        }
    },
    util: {
        proxy: function (args) {
            return SteviaManager._doRequest(args, 'util', 'proxy');
        }
    },
    tools: {
        search: function (args) {
            return SteviaManager._doRequest(args, 'tools', 'search');
        },
        info: function (args) {
            return SteviaManager._doRequest(args, 'tools', 'info');
        },
        help: function (args) {
            return SteviaManager._doRequest(args, 'tools', 'help');
        },
        update: function (args) {
            return SteviaManager._doRequest(args, 'tools', 'update');
        },
        delete: function (args) {
            return SteviaManager._doRequest(args, 'tools', 'delete');
        }
    },

    files: {
        list: function (args) {
            return SteviaManager._doRequest(args, 'files', 'list');
        },
        // fetch: function (args) {
        //     return SteviaManager._doRequest(args, 'files', 'fetch');
        // },
        // alignments: function (args) {
        //     return SteviaManager._doRequest(args, 'files', 'alignments');
        // },
        // variants: function (args) {
        //     return SteviaManager._doRequest(args, 'files', 'variants');
        // },
        read: function (args) {
            return SteviaManager._doRequest(args, 'files', 'info');
        },
        info: function (args) {
            return SteviaManager._doRequest(args, 'files', 'info');
        },
        delete: function (args) {
            return SteviaManager._doRequest(args, 'files', 'delete');
        },
        // index: function (args) {
        //     return SteviaManager._doRequest(args, 'files', 'index');
        // },
        search: function (args) {
            return SteviaManager._doRequest(args, 'files', 'search');
        },
        filesByFolder: function (args) {
            return SteviaManager._doRequest(args, 'files', 'files');
        },
        content: function (args) {
            return SteviaManager._doRequest(args, 'files', 'content');
        },
        contentGrep: function (args) {
            return SteviaManager._doRequest(args, 'files', 'content-grep');
        },
        createFolder: function (args) {
            return SteviaManager._doRequest(args, 'files', 'create-folder');
        },
        // setHeader: function (args) {
        //     return SteviaManager._doRequest(args, 'files', 'set-header');
        // },
        contentExample: function (args) {
            return SteviaManager._doRequest(args, 'files', 'content-example');
        },
        downloadExample: function (args) {
            return SteviaManager._doRequest(args, 'files', 'download-example');
        },
        update: function (args) {
            return SteviaManager._doRequest(args, 'files', 'update');
        },
        download: function (args) {
            return SteviaManager._doRequest(args, 'files', 'download');
        },
        upload: function (args) {
            var url = SteviaManager._url({
                query: {
                    sid: args.sid,
                    name: args.name,
                    parentId: args.parentId
                },
                request: {}
            }, 'files', 'upload');
            args.url = url;
            SteviaManager._uploadFile(args);
        }
    },
    _url: function (args, api, action) {
        var host = SteviaManager.host;
        if (typeof args.request.host !== 'undefined' && args.request.host != null) {
            host = args.request.host;
        }
        var version = SteviaManager.version;
        if (typeof args.request.version !== 'undefined' && args.request.version != null) {
            version = args.request.version;
        }
        var id = '';
        if (typeof args.id !== 'undefined' && args.id != null) {
            id = '/' + args.id;
        }

        // var url = host + '/' + version + '/' + api + id + '/' + action;
        var url = host + '/' + api + id + '/' + action;
        url = this._addQueryParamtersToUrl(args.query, url);
        return url;
    },

    _doRequest: function (args, api, action) {
        var url = SteviaManager._url(args, api, action);
        if (args.request.url === true) {
            return url;
        } else {
            var method = 'GET';
            if (typeof args.request.method !== 'undefined' && args.request.method != null) {
                method = args.request.method;
            }
            var async = true;
            if (typeof args.request.async !== 'undefined' && args.request.async != null) {
                async = args.request.async;
            }

            if (window.STEVIA_MANAGER_LOG != null && STEVIA_MANAGER_LOG === true) {
                console.log(url);
            }
            var request = new XMLHttpRequest();
            request.onload = function () {
                var contentType = this.getResponseHeader('Content-Type');
                if (contentType.indexOf('application/json') != -1) {
                    var json = JSON.parse(this.response);
                    if (json.error == null) {
                        args.request.success(json, this);
                    } else {
                        if (window.STEVIA_MANAGER_LOG != null && STEVIA_MANAGER_LOG === true) {
                            console.log('! ----    SteviaManager -------');
                            console.log(json.error);
                            console.log(json);
                            console.log('! ----    SteviaManager -------');
                        }
                        args.request.error(json, this);
                    }
                } else {
                    args.request.success(this.response, this);
                }
            };
            request.onerror = function (e) {
                args.request.error({
                    error: 'Request error.',
                    errorEvent: e
                }, this);
            };
            request.open(method, url, async);
            if (args.request.headers != null) {
                for (var header in args.request.headers) {
                    request.setRequestHeader(header, args.request.headers[header]);
                }
            }
            var body = null;
            if (args.request.body != null) {
                body = args.request.body;
            }
            request.send(body);
            return url;
        }
    },
    _uploadFile: function (args) {
        var url = args.url;
        var blob = args.file;
        var name = args.name;
        var parentId = args.parentId;
        var userId = args.userId;
        var format = args.format;
        var bioFormat = args.bioFormat;
        var callbackProgress = args.callbackProgress;
        var callbackExists = args.callbackExists;

        /**/
        var resume = true;
        var resumeInfo = {};
        var chunkMap = {};
        var chunkId = 0;
        var BYTES_PER_CHUNK = 4 * 1024 * 1024;
        // var BYTES_PER_CHUNK = 10 * 1024 * 1024;
        var SIZE = blob.size;
        var NUM_CHUNKS = Math.max(Math.ceil(SIZE / BYTES_PER_CHUNK), 1);
        var start;
        var end;

        /**/
        var resumeResponse;
        /**/

        var getResumeInfo = function (formData, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url, true); //false = sync call
            xhr.onload = function (e) {
                console.log(xhr.responseText);
                callback(JSON.parse(xhr.responseText));
            };
            xhr.send(formData);
        };
        var uploadChunk = function (formData, chunk, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
            xhr.onload = function (e) {
                chunk.done = true;
                console.log('chunk ' + chunk.id + ' done');
                callback(JSON.parse(xhr.responseText));
            };
            xhr.send(formData);
        };
        var checkChunk = function (id, size) {
            if (typeof resumeInfo[id] === 'undefined') {
                return false;
            } else if (resumeInfo[id].size != size /*|| resumeInfo[id].hash != hash*/ ) {
                return false;
            }
            return true;
        };
        var processChunk = function (c) {
            var chunkBlob = blob.slice(c.start, c.end);

            console.log(c);
            if (checkChunk(c.id, chunkBlob.size) == false) {
                console.log('chunk ' + c.id + ' not uploaded');
                var formData = new FormData();
                formData.append('chunk_id', c.id);
                formData.append('chunk_size', chunkBlob.size);
                /*formData.append('chunk_hash', hash);*/
                formData.append("name", name);
                formData.append('userId', userId);
                formData.append('parentId', parentId);
                /*formData.append('chunk_gzip', );*/
                if (c.last) {
                    formData.append("last_chunk", true);
                    formData.append("total_size", SIZE);
                    formData.append("format", format);
                    formData.append("bioFormat", bioFormat);
                }
                formData.append('chunk_content', chunkBlob);

                uploadChunk(formData, c, function (chunkResponse) {
                    callbackProgress(c, NUM_CHUNKS, chunkResponse);
                    if (!c.last) {
                        processChunk(chunkMap[(c.id + 1)]);
                    } else {

                    }
                });
            } else {
                console.log('chunk ' + c.id + ' already uploaded');
                callbackProgress(c, NUM_CHUNKS, resumeResponse);
                if (!c.last) {
                    processChunk(chunkMap[(c.id + 1)]);
                } else {

                }
            }

        };

        /**/
        /**/

        start = 0;
        end = BYTES_PER_CHUNK;
        while (start < SIZE) {
            var last = false;
            if (chunkId == (NUM_CHUNKS - 1)) {
                last = true;
            }
            chunkMap[chunkId] = {
                id: chunkId,
                start: start,
                end: end,
                size: end - start,
                done: false,
                last: last
            };
            start = end;
            end = start + BYTES_PER_CHUNK;
            if (end > SIZE) {
                end = SIZE;
            }
            chunkId++;
        }
        if (resume) {
            var resumeFormData = new FormData();
            resumeFormData.append('resume_upload', resume);
            resumeFormData.append('chunk_map', JSON.stringify(chunkMap));
            resumeFormData.append('name', name);
            resumeFormData.append('userId', userId);
            resumeFormData.append('parentId', parentId);
            getResumeInfo(resumeFormData, function (response) {
                if (response.error == null) {
                    resumeInfo = response.resumeInfo;
                    resumeResponse = response;
                    if (response.exists) {
                        callbackExists(response.file);
                    } else {
                        setTimeout(function () {
                            processChunk(chunkMap[0]);
                        }, 50);
                    }
                } else {
                    console.log('Upload error: ' + response.response[0].error);
                }
            });
        }
    },
    _addQueryParamtersToUrl: function (paramsWS, url) {
        var chr = "?";
        if (url.indexOf("?") != -1) {
            chr = "&";
        }
        var query = this._queryString(paramsWS);
        if (query != "")
            query = chr + query;
        return url + query;
    },
    _queryString: function (obj) {
        var items = [];
        for (var key in obj) {
            if (obj[key] != null && obj[key] != undefined) {
                items.push(key + '=' + obj[key]);
            }
        }
        return items.join('&');
    },

    /*HELP METHODS*/
    getFileContent: function (fileId, cb) {
        SteviaManager.files.content({
            id: fileId,
            query: {
                sid: Cookies('bioinfo_sid')
            },
            request: {
                async: true,
                success: function (response) {
                    cb(response);
                },
                error: function (response) {

                }
            }
        });
    },
    getPlainFolderFiles: function (fileId, cb) {
        SteviaManager.files.filesByFolder({
            id: fileId,
            query: {
                sid: Cookies('bioinfo_sid')
            },
            request: {
                async: true,
                success: function (response) {
                    cb(response.response[0].results);
                },
                error: function (response) {

                }
            }
        });
    },
    getFileURL: function (fileId) {
        return SteviaManager.files.download({
            id: fileId,
            query: {
                sid: Cookies("bioinfo_sid")
            },
            request: {
                url: true
            }
        });
    },
};
