# es6标准promise学习笔记
es6离我们越来越近 node4.0也推出了 原生浏览器 也逐渐支持promise他能帮助我们从个callback hell中脱离出来

###为什么我们要使用promise呢？
```
fs.readFile("a.json",function(e1,d1){
	if(e1){
	    //todo
	}else{
		fs.readFile("b.json",function(e2,d2){
				if(e2){
				    //todo
				}else{
				    console.log(d1+d2)
				}
	         
		})
	}
    
})
```
oh no一层一层的千层酥啊 里面还夹杂着丑陋的if else
看看promise版本

```
var promise = new Promise(function(onFulfill,onReject){
	fs.readFile("a.json",functiom(err,data){
		if(err){
			onReject(err);
		}else{
			onFulfill(data); 
		}
	});
});

promise.
	then(function(data){ 
        return JSON.parse(data)
	},function(err){
		throw new Eerror(err)
	}).
	then(function(json){
		console.log(json)
	}).catch(function(e){
		console.log(e)
	})

```
多么优雅的方式 然而我们现在就可以在浏览器环境中使用他们
*Chrome 32、Opera 19 和 Firefox 29 以上的版本已经默认支持 Promise。
*在不支持promise的浏览器环境中可使用 [promise polyfill](https://github.com/jakearchibald/es6-promise/blob/master/README.md)

###promise 的方法
####Promise.prototype.then
>then是promise中核心方法 接受一个onFulfill，onReject作为参数 并返回一个promise

```
     var p1 = new Promise(function(fulfill,reject){
         setTimeout(fulfill,3000);
     });
     p1.then(function(){
        return "yeah"
     }).then(function(v){
        alert(v)  //yeah
     })
```

----------


####Promise.prototype.catch

>catch 接受一个function作为参数 别的地方throw时 将会中断promise链 进入catch 并返回一个promise 

```
      var p1 =   new Promise(function(f,r){
          JSON.parse("..");
      });

      p1.then(function(){  alert(2) },function(v){  throw  "a"  })
          .then(alert)
          .catch(function(b){
              alert(b) //a
      });



       var p1 = new Promise(function(f,r){
                f(1)
       })
       p1.then(function(){
            throw  "a"
        },function(e){
            console.log("r"+e)
        })
        .catch(function(e){
            console.log(e)  //a
        })


```
*在第二个例子中的throw 将直接进入catch 不要期待进入  `console.log("r"+e)` 因为其onRecject是p1的而不是这一层then的

----------

####Promise.resolve
这是一个静态方法 

>参数为 value 或者一个 thenable 对象 并返回一个promise


```
        Promise.resolve(1)
             .then(function(v){
                 console.log("solve "+v)  //solve 1
             },function(v){
                console.log("reject "+v)
             })
             .catch(function(e){
                 console.log(e)
             })
/////////////////////////////////////解析thenable对象///////////////////////////////////////////////////
        Promise.resolve({
            then:function(f,r){
                f(22);
            }
        })
            .then(function(v){
                console.log("solve "+v)  //solve 1
            },function(v){
                console.log("reject "+v)
            })
            .catch(function(e){
                console.log(e)
            })


 
        Promise.resolve({
            then:function(f,r){
                r("ww");
            }
        })
                .then(function(v){
                    console.log("solve "+v)
                },function(v){
                    console.log("reject "+v)//reject ww
                })
                .catch(function(e){
                    console.log(e)
                })
 



		Promise.resolve({
		    then:function(f,r){
		        throw  new Error("abc")
		    }
		})
        .then(function(v){
            console.log("solve "+v)
        })
        .catch(function(e){
            console.log(e)  // Error: abc(…)
        })
```

----------
####Promise.reject   
这是一个静态方法

> 接受一个reason作为参数返回一个拒绝的promise

```
     Promise.reject("reason")
             .then(function(v){
                  console.log(v)
             },function(v){
                  console.log("reject "+v) //reject reason
             })
             .catch(function(e){
                 console.log(e)
             })
 


	Promise.reject(new Error("fail"))
	        .then(alert) //未执行
	        .catch(function(e){
	            console.log(e) //Error: fail(…)
	        })
```

----------

####Promise.all   
这是一个静态方法

> all方法接受一个可迭代的类型，当全部完成是调用onfillfulled,有一个错误时带错误参数进入onReject，其余的完成或拒绝都不会触发onFillful或者onReject


 

```
     var p1 = new Promise(function(f,r){
            setTimeout(function(){
                f(1)
            },1000)
     })

     var p2 = new Promise(function(f,r){
         setTimeout(function(){
             f(2)
         },2000)
     })

     Promise.all([p1,p2])
            .then(function(v){  
	            console.log(v); // 两秒后 [1, 2]
            })  
```
失败的

```
     var p1 = new Promise(function(f,r){
            setTimeout(function(){
                f(1)
            },1000)
     })

     var p2 = new Promise(function(f,r){
         setTimeout(function(){
             r(2)
         },2000)
     })
 
     Promise.all([p1,p2])
            .then(null,function(arr){  
	            console.log(arr); // 两秒后2
            }) 
```


----------


####Promise.race

> race传入一个可迭代的对象作为参数，当其中任意一个promise对象变成fillful或者reject状态，执行他的onFillful或者onReject,其余的完成或拒绝都不会触发onFillful或者onReject

这是一个静态方法

```
       var p1 = new Promise(function(f,r){
           setTimeout(function(v){
                r(1)
           },1000)
       })
       var p2 = new Promise(function(f,r){
           setTimeout(function(v){
                f(2);
           },5000)
       })

       var p3 = new Promise(function(f,r){
           setTimeout(function(v){
               r(3)
           },1000)
       })

       Promise.race([p1,p2,p3])
              .then(function(v){
                    console.log(v)
               },function(e){
                    console.log("拒绝"+e) //一秒  拒绝1
               })
```

其实我的理解就是看谁快 = =

*小细节 all与race 的参数 p1 与 p3都为1秒与 数组顺序无关 与promise声明顺序有关 p1 比p3 先声明所以先被触发

*race和all是一对兄弟 all全部执行完才触发onFullifll ，而race相反 获得最快的那个


完整例子

```
    new Promise(function(r,j){
         setTimeout(function(){
             r('{"name":"abc"}')
         },300)
    }).then(function(data){
        return JSON.parse(data)
    }).then(function(json){

        var  p = new Promise(function(r,j){
            setTimeout(function(){
                r(['{"name":"edf"}',json])
            },300);
            setTimeout(function(){
                j(new Error("time out"));
            },300);

        })
        return p
    }).then(function(arr){
        return  [ JSON.parse(arr[0] ),arr[1] ]
    },function(err){
        throw  err
    }).then(function(arr){
        return arr[1].name + arr[0].name
    }).then(function(str){
        console.log(str);
    })
	.catch(function(e){
	     if(e.message  === "time out"){
	         console.log("time out")
	     }else{
	         console.log(e)
	     }
	
	})

```

感谢 备忘：

- [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject)
- [JavaScript Promise迷你书（中文版）](http://liubin.github.io/promises-book/#promise.catch)
