const cron = require('node-cron');
const dotenv = require('dotenv');
const shell = require('shelljs');

dotenv.config()


const fs = require('fs');
const path = require('path');
   


let options = {
    cronTime: process.env['cronTime'],
    timeCutoff: process.env['timeCutoff']
}

function init(){

     

    console.log('starting backup utility ', options)

    try{
        if (!fs.existsSync(path.join(__dirname, 'backups'))) {

            fs.mkdirSync(path.join(__dirname, 'backups'), (err) => { 
                console.log('Directory created successfully!');
            });

        }
    }catch(err){
        return console.error(err);
    }



    let cronTime = options.cronTime ?  options.cronTime : '00 11 * * * '   //every day

    // Schedule tasks to be run on the server.
    cron.schedule(cronTime, function() {

        console.log('running a task every day');
    });

    execute()


}


function execute(){ 

    let timeCutoff = options.timeCutoff ?  options.timeCutoff : 60*60*24*7   //every week
 
    deleteObsoleteData(timeCutoff)

    backupDatabases()

 

}


function backupDatabases(){
    let unixString = Date.now().toString()

    let folderName = 'backups/dump_'.concat(unixString)

      // Run external tool synchronously
    if (shell.exec(`mongodump -o ${folderName}`).code !== 0) {
     shell.echo('Error: shell command failed');
     shell.exit(1);
    }

}

function getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
      return fs.statSync(path+'/'+file).isDirectory();
    });
  }

  

function deleteObsoleteData(timeCutoff){

    let directories = getDirectories( 'backups/' ).filter(x => x.startsWith('dump'))
    
    const now = Date.now() 

    for(let name of directories){
        let unixtime = parseInt( name.split('_')[1] )
        console.log('unixtime',unixtime)

        if(  now - unixtime > timeCutoff ){

            deleteDirectory('backups/'+name)
        }
    }
    console.log('directories ', directories)

}

function deleteDirectory(dirName){
    fs.rmdir(dirName, { recursive: true }, (err) => {
        if (err) {
            throw err;
        }
    
        console.log(`${dirName} was deleted!`);
    });
    
}


init()