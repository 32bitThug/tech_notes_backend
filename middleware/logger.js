// destructure format from date-fns dependency
const {format}=require('date-fns')
// destrcture
const{ v4: uuid}=require('uuid')
const fs=require('fs')
const fsPromises=require('fs').promises
const path=require('path')
  // logEvents is an helper function
const logEvents=async(message,logFileName)=>{
    const dateTime= `${format(new Date(),'ddMMyyyy\tHH:mm:ss')}`
    //uuid creates a new id for each log item
    const logItem=`${dateTime}\t ${uuid()}\t ${message}\n`
    try{
        if(!fs.existsSync(path.join(__dirname,'..','logs'))){
            await fsPromises.mkdir(path.join(__dirname,'..','logs'))
        }
        await fsPromises.appendFile(path.join(__dirname,'..','logs',logFileName),logItem)

        }
        catch(err){
            console.log(err)
        }
}
const logger=(req,res,next)=>{
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`,'reqLog.log')
    console.log(`${req.method} ${req.path}`)
    next()
}
module.exports={logEvents,logger}