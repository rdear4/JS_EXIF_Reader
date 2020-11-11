onmessage = (e) => {

    let reader = new FileReader()
    
    reader.readAsDataURL(e.data)
    reader.onload = () => {

        let binaryData = atob(reader.result.split(",")[1])
        
        // let resultantString = ""
        let byteArray = new Uint8Array(new ArrayBuffer(binaryData.length))
        // for (let i = 0; i < binaryData.length; i+=2) {

        //     byteArray[i] = binaryData.charCodeAt(i)
        //     byteArray[i+1] = binaryData.charCodeAt(i+1)
        //     resultantString += `0x${pad(binaryData.charCodeAt(i).toString(16)).toUpperCase()} 0x${pad(binaryData.charCodeAt(i+1).toString(16)).toUpperCase()} `

        // }
        
        postMessage({'imageDataArray': byteArray})
        
    }

}