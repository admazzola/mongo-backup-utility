const cron = require('node-cron');
const dotenv = require('dotenv');
const shell = require('shelljs');

dotenv.config()


function init(){

    let options = {
        cronTime: process.env['cronTime']

    }


    console.log('starting backup utility ', options)



    let cronTime = options.cronTime ?  options.cronTime : '00 11 * * * '   //every day

    // Schedule tasks to be run on the server.
    cron.schedule(cronTime, function() {

        console.log('running a task every day');
    });

    execute()


}


function execute(){ 

    let unixString = Date.now().toString()

    let folderName = 'backups/dump_'.concat(unixString)

      // Run external tool synchronously
      if (shell.exec(`mongodump -o ${folderName}`).code !== 0) {
        shell.echo('Error: shell command failed');
        shell.exit(1);
    }


}


init()