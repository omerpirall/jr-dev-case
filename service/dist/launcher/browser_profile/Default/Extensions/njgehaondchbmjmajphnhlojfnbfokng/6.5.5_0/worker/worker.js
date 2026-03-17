var arrayPlaylist = [];
var lastTSFile = '';
var isRun = false;
var strData = "";
var countTSFiles = 0;
var sizeOfVideo = 0;

function roughSizeOfObject( object ) {

    var objectList = [];

    var recurse = function( value )
    {
        var bytes = 0;

        if ( typeof value === 'boolean' ) {
            bytes = 4;
        }
        else if ( typeof value === 'string' ) {
            bytes = value.length * 2;
        }
        else if ( typeof value === 'number' ) {
            bytes = 8;
        }
        else if
        (
            typeof value === 'object'
            && objectList.indexOf( value ) === -1
        )
        {
            objectList[ objectList.length ] = value;

            for( i in value ) {
                bytes+= 8; // an assumed existence overhead
                bytes+= recurse( value[i] )
            }
        }

        return bytes;
    }

    return recurse( object );
}

function IsRequestSuccessful (response) {
	// Fix for IE: sometimes 1223 instead of 204
	return response.ok || (response.status >= 200 && response.status < 300) || response.status === 304 || response.status === 1223;
}

function getDomainFromUrl(url)
{
	var i = url.lastIndexOf("/");
	url = url.substring(0, i+1);
	return url;
}

function loadFileTS(url) {
    try {
        if (isRun) {
            fetch(url, {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'text/plain; charset=x-user-defined'
                    }
                })
                .then(response => {
                    if (!isRequestSuccessful(response)) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(data => {
                    strData += data;
                    countTSFiles++;
                    sizeOfVideo += roughSizeOfObject(data);
                    self.postMessage({
                        'msg': 'runing',
                        'videoData': strData,
                        'countTSFiles': countTSFiles,
                        'sizeOfVideo': sizeOfVideo
                    });
                })
                .catch(error => {
                    self.postMessage({
                        'msg': 'error',
                        'error': 'Failed to load .ts file!'
                    });
                    isRun = false;
                });
        }
    } catch (err) {
        self.postMessage({
            'msg': 'error',
            'error': 'Failed to load .ts file!'
        });
        isRun = false;
    }
}


function loadFilePlaylist(urlPlaylist) {
    try {
        if (isRun) {
            fetch(urlPlaylist, {
                    method: 'GET',
                    mode: 'cors'
                })
                .then(response => {
                    if (!isRequestSuccessful(response)) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(data => {
                    parsePlaylist(data);
                    for (var i = 0; i < arrayPlaylist.length; i++) {
                        if (isRun) {
                            var urlTSFile = arrayPlaylist[i].startsWith('http') ? arrayPlaylist[i] : getDomainFromUrl(urlPlaylist) + arrayPlaylist[i];
                            loadFileTS(urlTSFile);
                            lastTSFile = arrayPlaylist[i];
                        }
                    }
                })
                .catch(error => {
                    self.postMessage({
                        'msg': 'error',
                        'error': 'Failed to get playlist!'
                    });
                    isRun = false;
                });
        }
    } catch (err) {
        self.postMessage({
            'msg': 'error',
            'error': 'Failed to get playlist file!'
        });
        isRun = false;
    }
}


function parsePlaylist(strPlaylist) {
	if(typeof(strPlaylist) !== "undefined" || strPlaylist != "") {
		var allPlaylist = strPlaylist.split(/\r\n|\r|\n/);
		var isNextTSFile = false;
		var i = 0;
		arrayPlaylist = [];
		var isFind = false;
		var isPlaylist = false;
		
		for(i; i < allPlaylist.length; i++) 	{
			if(allPlaylist[i] == lastTSFile && allPlaylist[i] != "")
			{
				isFind = true;
				isPlaylist = true;
				break;
			}
		}
		
		if(!isFind)	{
			i = 0;
		}
		
		for(i; i < allPlaylist.length; i++)	{
			if (isNextTSFile == true)	{
				isNextTSFile = false;
				arrayPlaylist.push(allPlaylist[i]);
			}
			if (allPlaylist[i].search("#EXTINF:") >= 0)	{
				isNextTSFile = true;
				isPlaylist = true;
			}
		}
		if(!isPlaylist) 	{
			self.postMessage({'msg': 'error', 'error':"The playlist don't have .ts files records!"});
			isRun = false;
		}
	}
	else  {
		self.postMessage({'msg': 'error', 'error':"Playlist is empty!"});
		isRun = false;
	}
}
	
function cycle(urlPlaylist)  {
	while(isRun)	{
		loadFilePlaylist(urlPlaylist);
	}
	self.postMessage({'msg': 'stop', 'videoData':strData});
}
		
self.onmessage = function(e) 
{
	// console.log("worker spouned *******************");
	switch (e.data.cmd)
	{
		case 'startRecord':
			console.log ( 'Rec start!' );
			isRun = true;
			cycle(e.data.url);
			break;
		case 'stopRecord':
			console.log ( 'Rec stop!' );
			isRun = false;
			break;
	}
}

