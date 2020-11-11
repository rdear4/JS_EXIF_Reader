class JPEGParser {

    constructor(_byteArray) {

        this.parse(_byteArray)

    }

    findMarker = markerDefinition => (parserState) => {
        //console.log(parserState)
        let returnState;

        if (this.comapreArrays(markerDefinition.marker, parserState.targetByteArray.slice(parserState.index, markerDefinition.marker.length))) {
        
            returnState = {
                ...parserState,
                results: {
                    ...markerDefinition,
                    start: parserState.index,
                    end: parserState.index + markerDefinition.marker.length,
                    value: parserState.targetByteArray.slice(parserState.index, markerDefinition.marker.length),
                },
                index: parserState.index + markerDefinition.marker.length
            }

        } else {

            returnState = {
                ...parserState,
                results: {
                    ...markerDefinition
                },
                index: markerData.expectedPosition,
                isError: true,
                error: `${markerDefinition.name} marker not found`
            }
        }

        return returnState

    }

    readValue = valueDefinition => (parserState) => {

        let returnState = {
            ...parserState,
            results: {
                ...valueDefinition,
                value: parserState.targetByteArray.slice(parserState.index, valueDefinition.length)
            }
        }

        return returnState

    }

    sequenceOfParsers = parsers => parserState => {
        console.log(`There are ${parsers.length} parsers`)
        const results = []
        let nextState = parserState
        
        for (let p of parsers) {
            nextState = p(nextState)
            results.push(nextState.results)

        }

        return {
            ...nextState,
            results
        }
    }

    parse = (targetByteArray) => {

        const initialState = {
            index: 0,
            isError: false,
            error: null,
            targetByteArray: targetByteArray
        }

        let parser = this.sequenceOfParsers([
            this.findMarker({
                marker: new Uint8Array([0xff, 0xd8]),
                name: "SOI", 
                description: "This is the Start Of Image marker. It is the first two bytes of the image file",
            }),
            this.findMarker({
                name: "APP1", 
                description: "This is the marker used by most, but not all, camera manufacturers to store images with EXIT Metadata",
                marker: new Uint8Array([0xff, 0xe1])
            }),
            this.readValue({
                name: "APP1 Data Size",
                description: "A four(4) byte value found at position 0x04",
                length: 4
            })
        ])

        for (let r of parser(initialState).results) {
            console.log(r)
        }
        
        

    }

    comapreArrays = (arr1, arr2) => {

        arr1.forEach((val, i) => {

            if (val !== arr2[i]) return false

        })

        return true
    }
}