

test = () => {

    // let myPromise = new Promise(function(myResolve, myReject) {        
        // let add = 0;
        // for (let i=0;i<10000000000; i++){
        //     add += 1;
        // }
        // myResolve("I love You !!")
    //   });

    //   myPromise.then((value) => {
    //       console.log(value)
    //   })

    callback = (result) => {
        console.log("result here")
    }


    var callbackWrapper = function (result) {
        setTimeout(function () {
            callback(result);
        });
    };

    
    let add = 0;
    for (let i=0;i<10000000000; i++){
        add += 1;
    }
    callbackWrapper(add)

}


    console.log("start")
    test()
    console.log("end")
