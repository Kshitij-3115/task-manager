// const doWorkCallback = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         // we can call resolve (when work done properly) 
//         // we can call reject (when some error occured) 

//         reject('an error occured')

//         resolve([1,2,3,4]) 
        
//     }, 2000)
// })

// doWorkCallback.then((result) => {
//     console.log(result);
// }).catch((error) => {
//     console.log(error) 
// })


const sum = (a,b) => {
    return new Promise((resolve,reject) => {
        setTimeout(()=>{
            resolve(a+b) 
        },2000)
    })
}

sum(1,2).then((result) => {
    console.log(result)

    // chaining 
    return sum(result, 3) 
}).then((result) => {
    console.log(result) 
}).catch((err) => {
    console.log(result) 
})

