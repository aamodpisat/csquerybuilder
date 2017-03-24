var childProcess = require('child_process')
var path = require('path')

childProcess.exec(path.join(process.cwd() + '/node_modules/.bin/gulp build'), function(error, stdout, stderr) {
	console.error(error)
	console.log(stdout)
	console.error(stderr)
})
