var express = require('express');
var router = express.Router();
var fs = require('fs')
var Promise  = require("bluebird");

/* GET home page. */
router.get('/', function(req, res, next) {

    var readFileAsync  = function(path){
         return new Promise(function(fulfill,reject){
                   fs.readFile(path,"utf8",function(err,content){

                       if(err){
                           return reject(err)
                       }else{
                           return  fulfill(content)
                       }

                   })
         })
    };

    readFileAsync('./routes/aaaa.json', 'utf8').then(function(data){

            return data
    }).then(function(json){

        return JSON.parse(json)

    }).then(function(json){

        console.log(json)

    }).catch(SyntaxError,function(e){
        console.log(e)
        console.log("111111")
    }).catch(function(e){
        console.log(e)
        console.log("222")
    })

    //readFileAsync("routes/aaa.js").then(function(content){
    //        console.log(content)
    //},function(err){
    //        console.log(err)
    //})

     res.render('index', { title: 'Express' });
});

router.get('/a', function(req, res, next) {
    Promise.promisifyAll(fs);
    var p1 = new Promise(function(fulfill,reject){
        reject(1)
    })


    p1.then(function(b){
            try{
                JSON.parse(b);
            }catch (e){
                return Promise.reject(new Error("出错了"))
            }
    },function(v){
            console.log(v)
            return
    }).then(function(v){
            console.log(v)
    })


    res.render('index', { title: 'Eadasdxpress' });
})
router.get('/yy', function(req, res, next) {

    function throwError(value) {
        // 抛出异常
        throw new Error(value);
    }
// <1> onRejected不会被调用
    function badMain(onRejected) {
        return Promise.resolve(42).then(throwError, onRejected);
    }
// <2> 有异常发生时onRejected会被调用
    function goodMain(onRejected) {
        return Promise.resolve(42).then(throwError).catch(onRejected);
    }
// 运行示例
    badMain(function(){
        console.log("BAD");
    });
    goodMain(function(){
        console.log("GOOD");
    });
    res.render('index', { title: 'Eadasdxpress' });

})


module.exports =  router;
