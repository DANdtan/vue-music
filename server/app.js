var http = require("http")
var server = http.createServer();
var request = require('request');
var url = require("url")
var encoding = require('encoding');
var querystring = require("querystring")
server.on('request', function (req, res) {
    global.backres = res;
    var urlOption = url.parse(req.url);
    var pathName = urlOption.pathname;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'x-requested-with,Content-Type');
    var origin = 'http://music.163.com';
    //默认头信息
    var defaultconfig = {
        header: {
            'Origin': origin,
            'Referer': origin, 
            'Content-Type': 'application/x-www-form-urlencoded',
            'Connection': 'keep-alive',
            'Cookie': 'appver=2.0.2',
            'hostname': 'music.163.com',
            'content-encoding': 'utf-8',
            'Host': 'music.163.com',
            'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36'
        }
    }
    //request 模块的回调函数
    var callback = function (err, resp, body) {
        if (err) console.error(err);
        else {
            if (resp.statusCode === 200) {
                global.backres.end();
                //var jsonbody = JSON.parse(body)
                //   console.log(jsonbody);
                //轮播图
                //console.log(jsonbody['/api/v2/banner/get']['banners'][0])
                //热门推荐  
                // console.log(jsonbody['/api/discovery/hotspot']['data'][1])
                //最新音乐
                //  console.log(jsonbody['/api/v1/discovery/new/songs']['data'][0])
            }
        }
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    switch (pathName) {
        case '/recommendData':
            request({
                'headers': defaultconfig.header,
                'uri': "http://music.163.com/eapi/batch",
                'method': "POST",
                'body': 'params=0BD8BB39A78692F1744DEFF63EBC30F7889FA0D28FD18C56783C7BF3AADA4C516E269DCEF72717031B0D0797563D21D74A80931032E90A0DBF772B7B86DAB7B29C47227066BA6859EF81B2BDC94960501592EFDBED2FA4BB612DD34C3BE69C1CB997189A2D14BE23FACD2D81694F87D7D86DD3F48F213C035A89EDEE2F6336478BEBA964633B3DB2A074EA2662FE8AEC18A167403EA0D465ED99F6E0BF1B58D64E2F6FAB87BFB382901FB3F8D753ABABE5361DD03E8767F3CC5BE299EDCBF8CEA82126579A7E11CD9A6B7A95AEB41CEC237356031206C2C94443360BB430F44D4CE1F78FE98FDF4468B40977A33CD3A7AD9A9F926C5E1B3979139277DBCDF27E7EB4BFC0C4996CD069835883475527C7D296034459225E90FC0FD45F259EDAD79318B200CCC01B51E4571EFD93F7E7EFE09D1169A86936C7C3D1E0EAAFE6955D2A72808C6F340B4388E57F4443C22DCB267E6BA157E3256F2924B9A2DD0B1F4C001E848DC9F85F05DE82FCCA50763549329EF9DF1BC9746B9CFB7308D72159C5A5DC242B76960F7E62827FD52B8F4BCF7A667EBDAD93E5D34CB68D92ECBCD7FEE9265DD359457ED508F38B088041E5BBFDB949F891FA490B48B24C2C754762F31DC4C0F0C8E3930D08A628D82D10C6CADDEA0BBDF8D9FF405C9FE9B2E5622BD99757F50109BF2BBE0B6804606EB5EF23E3D772D023013244905739680AC5801E039D02D768DDB47BE085BE698DFA91C29B13F34AFEC3DA8E69251F8EB21D1A11B85F89B6383089FEF4713C1C21972D09E2433FEDADBAB3B6ED239935E06E76AACA3A66B3F11E51EFD0F5AD0CE6A32783',
                callback
            }).on('response', function (response) {
                response.on('data', function (data) {
                    let result = encoding.convert(data, "utf-8");
                    res.write(result)
                })
            })
            break;
    }
})
server.listen(3001, function () {
    console.log("listen on 3001");
});
