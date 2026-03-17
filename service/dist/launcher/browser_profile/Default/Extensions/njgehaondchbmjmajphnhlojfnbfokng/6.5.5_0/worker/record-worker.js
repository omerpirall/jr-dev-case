

class VideoRecorder {
  constructor(ee) {
    this.arrayPlaylist = [];
    this.lastTSFile = '';
    this.isRun = false;
    this.strData = "";
    this.countTSFiles = 0;
    this.sizeOfVideo = 0;
    this.ee = ee;
    this.url = null;
    this.eventLoop = null;

	this.init();
  }

  init() {
	  this.ee.on("message", (data) => {
		if(data.cmd === "startRecord") {
			this.url = data.url;
			this.startRecording(data.url);
		} else if(data.cmd === "stopRecord") {
			// console.log("stopRecording");
			this.stopRecording();
		}
	  })
  }

  roughSizeOfObject(object) {
    var objectList = [];

    var recurse = ( value ) => {
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

  isRequestSuccessful(response) {
    return response.ok || (response.status >= 200 && response.status < 300) || response.status === 304 || response.status === 1223;
  }

  getDomainFromUrl(url) {
    var i = url.lastIndexOf("/");
	url = url.substring(0, i+1);
	return url;
  }

  async loadFileTS(url) {
    // console.log("---4444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444---");
    // console.log(url);
    // console.log();
    try {
        if (this.isRun) {
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'text/plain; charset=x-user-defined'
                }
            });
            if (!this.isRequestSuccessful(response)) {
                throw new Error('Network response was not ok');
            }
            const data = await response.text();
            this.strData += data;
            this.countTSFiles++;
            this.sizeOfVideo += this.roughSizeOfObject(data);

            this.ee.emit("message", {
                'msg': 'running',
                'videoData': this.strData,
                'countTSFiles': this.countTSFiles,
                'sizeOfVideo': this.sizeOfVideo
            });
        }
    } catch (error) {
        this.ee.emit("message", {
            'msg': 'error',
            "error": "Failed to load .ts file!"
        });
        this.isRun = false;
    }
}


  async loadFilePlaylist(urlPlaylist) {
		// console.log("---9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999---");
		// console.log(urlPlaylist);
		// console.log();
		try {
			if (this.isRun) {
				const response = await fetch(urlPlaylist, {
					method: 'GET',
					mode: 'cors'
				});
				if (!this.isRequestSuccessful(response)) {
					throw new Error('Network response was not ok');
				}
				const data = await response.text();
				this.parsePlaylist(data);
				// console.log("-----------------------------------------------------------------------");
				// console.log("-----------------------------------------------------------------------");
				// console.log(this.arrayPlaylist);
				for (var i = 0; i < this.arrayPlaylist.length; i++) {
					if (this.isRun) {
						var urlTSFile = this.arrayPlaylist[i].startsWith('http') ? this.arrayPlaylist[i] : this.getDomainFromUrl(urlPlaylist) + this.arrayPlaylist[i];
						await this.loadFileTS(urlTSFile);
						this.lastTSFile = this.arrayPlaylist[i];
					}
				}
				this.eventLoop.next(this.url);
			}
		} catch (error) {
			this.ee.emit("message", {
				'msg': 'error',
				'error': 'Failed to get playlist!'
			});
			this.isRun = false;
		}
		// console.warn('loadFilePlaylist end');

	}

  parsePlaylist(strPlaylist) {
	  // console.warn('parsePlaylist ************************');
    if(typeof(strPlaylist) !== "undefined" || strPlaylist != "") {
		var allPlaylist = strPlaylist.split(/\r\n|\r|\n/);
		var isNextTSFile = false;
		var i = 0;
		this.arrayPlaylist = [];
		var isFind = false;
		var isPlaylist = false;

		for(i; i < allPlaylist.length; i++) 	{
			if(allPlaylist[i] == this.lastTSFile && allPlaylist[i] != "")
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
				this.arrayPlaylist.push(allPlaylist[i]);
			}
			if (allPlaylist[i].search("#EXTINF:") >= 0)	{
				isNextTSFile = true;
				isPlaylist = true;
			}
		}
		if(!isPlaylist) 	{
			this.ee.emit("message", {
				'msg': 'error',
				'error': "The playlist don't have .ts files records!"
			})
			this.isRun = false;
		}
	}
	else  {
		this.ee.emit("message", {
			'msg': 'error',
			'error': "Playlist is empty!"
		})
		this.isRun = false;
	}
  }

  async cycle(urlPlaylist) {
	// console.log(this.isRun);
    while (this.isRun) {
      await this.loadFilePlaylist(urlPlaylist);
    }

	this.ee.emit("message", {
		'msg': 'stop',
		'videoData': this.strData
	})
	/*
	if(this.isRun) {
		await this.cycle(urlPlaylist);
	} else {
		// Post a message indicating that recording has stopped
		// self.postMessage({ 'msg': 'stop', 'videoData': this.strData });
		this.ee.emit("message", {
			'msg': 'stop',
			'videoData': this.strData
		})
	}
	*/
  }

  createLoop(next, end) {
		let index = 0;
		return {
			next: async function(argument) {
				// console.log("next : interation : ", index);
				// console.log("next : argument : ", argument);
				// console.log(index);
				await next(argument);
				index++;
			},

			end: function(){
				end()
			}
		};
	}

  async startRecording(url) {
    // console.log('Recording started!');
    this.isRun = true;
	this.eventLoop = this.createLoop(
		async (url) => {
			console.log("el : ", url);
			await this.loadFilePlaylist(url)
		},
		() => {
			this.ee.emit("message", {
				'msg': 'stop',
				'videoData': this.strData
			})
		}
	);
	this.eventLoop.next(this.url);
    // await this.cycle(url);
  }

  stopRecording() {
    // console.log('Recording stopped!');
    this.isRun = false;
	this.eventLoop.end();
  }
}