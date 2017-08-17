const express = require('express')
const http = require('http')
const app = express()
app.all('*', function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "X-Requested-With");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("X-Powered-By",' 3.2.1')  
    res.header("Content-Type", "application/json;charset=utf-8");  
    next();  
});  
//歌单
app.use("/playlist", require("./router/playlist"))
//首页
app.use("/recommendData", require("./router/recommendData"))

app.listen(3001, () => {
 console.log("listen on 3001");
})

