const doWorkCallback = new Promise((resolve, reject) => {
    setTimeout(() => {
        // we can call resolve (when work done properly) 
        // we can call reject (when some error occured) 

        reject('an error occured')

        resolve([1,2,3,4]) 
        
    }, 2000)
})

doWorkCallback.then((result) => {
    console.log(result);
}).catch((error) => {
    console.log(error) 
})