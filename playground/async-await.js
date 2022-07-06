
const add = (a,b) => {
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            if(a<0 || b<0) {
                reject('numbers must be non negative')
            }
            resolve(a+b)
        },2000)
    })
}

const doWork = async () => {
    
    const sum = await add(99,1)    // it wait to complete the add call 
    const sum1 = await add(sum, 50) 
    const sum2 = await add(sum1, -3) 

    return sum2; 
    
}

doWork().then((result) => {
    console.log(result) 
}).catch((err) => {
    console.log(err) 
}) 