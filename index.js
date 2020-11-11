let pd = (e) => {

    e.preventDefault()

}

let imageDataArray;

let imageDataLoadedFromWorker = (msg) => {

    console.log(msg)
    console.log(`Loaded data from image: ${msg.data.imageDataArray.length} bytes`)
    imageDataArray = msg.data.imageDataArray
    
}

let handleDrop = (e) => {

    console.log("Image dropped")
    e.preventDefault()
    const files = e.dataTransfer.files
    
    if (files.length) {

        //First check if web workers are available
        if (window.Worker) {

            console.log("Worked object found...")
            //Create the web worker
            const myWorker = new Worker('imageLoader.js')

            myWorker.onmessage = imageDataLoadedFromWorker

            myWorker.postMessage(files[0])

        } else {

            let reader = new FileReader()

            reader.readAsDataURL(files[0])
            reader.onload = () => {

                let binaryData = window.atob(reader.result.split(",")[1])
                console.log(typeof binaryData)
                let resultantString = ""
                let byteArray = new Uint8Array(new ArrayBuffer(binaryData.length))
                for (let i = 0; i < binaryData.length; i+=2) {

                    byteArray[i] = binaryData.charCodeAt(i)
                    byteArray[i+1] = binaryData.charCodeAt(i+1)
                    resultantString += `0x${pad(binaryData.charCodeAt(i).toString(16)).toUpperCase()} 0x${pad(binaryData.charCodeAt(i+1).toString(16)).toUpperCase()} `

                }
                
                // let myParser = new JPEGParser(byteArray)

                document.getElementById("canvas-wrapper").innerText = resultantString
                
            }
        }
        

    }

}

let pad = (s) => {

    if (s.length === 1) {
        return `0${s}`
    }

    return s
}

let canvasSize = {
    width: window.innerWidth,
    height: window.innerHeight
}

//Create the canvas to be the full size of the window
function setup() {

    createCanvas(canvasSize.width, canvasSize.height)

}

function draw() {

    fill(0, 255, 255)
    noStroke()
    rect(0,0, canvasSize.width, canvasSize.height)

    
    drawImageIconInfographic((imageDataArray !== undefined) ? imageDataArray.length : undefined)

}

let drawImageIconInfographic = (numBytes = 30000) => {

    const iconBorder = 10
    const iconHWRatio = 500.0/380.0
    const iconHeight = canvasSize.height - 2 * iconBorder
    const iconWidth = iconHeight/iconHWRatio
    

    const x = canvasSize.width - iconBorder - iconWidth
    const y = iconBorder
    const cornerRadius = 20
    const dogearSideLength = 50
    const iconPadding = 10

    //Draw the outline
    push()

    strokeWeight(4)
    stroke('black')
    noFill()

    line(x + cornerRadius, y, x + iconWidth - dogearSideLength, y)
    line(x + iconWidth - dogearSideLength, y, x + iconWidth - dogearSideLength, y + dogearSideLength - cornerRadius)
    arc(x + iconWidth - dogearSideLength + cornerRadius, y + dogearSideLength - cornerRadius, cornerRadius * 2, cornerRadius * 2, HALF_PI, PI)
    line(x + iconWidth - dogearSideLength + cornerRadius, y + dogearSideLength, x + iconWidth, y + dogearSideLength)
    line(x + iconWidth - dogearSideLength, y, x + iconWidth, y + dogearSideLength)
    line(x + iconWidth, y + dogearSideLength, x + iconWidth, y + iconHeight - cornerRadius)
    arc(x + iconWidth - cornerRadius, y + iconHeight - cornerRadius, cornerRadius * 2, cornerRadius * 2, 0, HALF_PI)

    line(x - cornerRadius + iconWidth, y + iconHeight, x + cornerRadius, y + iconHeight)
    arc(x + cornerRadius, y + iconHeight - cornerRadius, cornerRadius * 2, cornerRadius * 2, HALF_PI, PI)

    line(x, y + iconHeight - cornerRadius, x, y + cornerRadius)
    arc(x + cornerRadius, y + cornerRadius, cornerRadius * 2, cornerRadius * 2, PI, PI + HALF_PI)
    
    //Add binary data to image icon

    const fontSize = Math.sqrt(((iconWidth-2*iconPadding)*(iconHeight - 2*iconPadding))/numBytes)
    console.log(fontSize)
    // const charactersPerRow = iconWidth - (2 * iconBorder)
    // for (let i = 0; i < numBytes; i++) {



    // }
    pop()

}

