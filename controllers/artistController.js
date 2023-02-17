import axios from "axios"
import { createObjectCsvWriter } from 'csv-writer';
import { getArtistNames, formatArtists } from "../models/artistModel.js"


/**
 * Search for an artist on last.fm and save the result to a CSV file.
 * Requires a name parameter in the request body.
 */
const searchArtist = (req, res, next) => {
    const name = req.body.name
    const filename = req.body.filename || 'output.csv'
    const artistNames = getArtistNames()

    console.log("Input:", name, filename, artistNames)

    // Variables which are updated by async functions
    var result = []
    var triedArtistNames = []

    const csvWriter = createObjectCsvWriter({
        path: filename,
        header: [
            { id: 'name', title: 'Name' },
            { id: 'mbid', title: 'MBID' },
            { id: 'url', title: 'URL' },
            { id: 'image_small', title: 'Small Image' },
            { id: 'image', title: 'Image' }
        ]
    });

    // Return the url to call the last.fm API.
    function getUrl(name) {
        const apiKey = process.env.LASTFM_KEY
        return `https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${name}&api_key=${apiKey}&format=json`
    }

    // Retrieve the formated artist data from last.fm and write it to the result array.
    async function retrieveArtist(name) {
        return axios.get(getUrl(name))
            .then(response => {
                const data = formatArtists(response.data.results.artistmatches.artist);
                result = result.concat(data)
                console.log("Found", data.length, "artists for", name)

                return Promise.resolve()
            })
            .catch(error => {
                return Promise.reject(error)
            })
    }

    /**
     * Retrieve formated artist data for a random artist name. Tries out all artist names if necessary and stops
     * when any data by one of the artist names is found. Calls retrieveArtist() to retrieve the data.
     */
    async function retrieveRandomArtist() {
        // Check if the result array is empty
        while (result.length === 0) {
            // We want to break the while loop if we have tried all artist names already
            if (artistNames.every(v => triedArtistNames.includes(v))) {
                console.log("Tried all artist names, but no data found.")
                break
            }

            // Get a random artist name and mark it as tried
            const randomName = artistNames[Math.floor(Math.random() * artistNames.length)]
            if (triedArtistNames.includes(randomName)) {
                continue
            } else {
                triedArtistNames.push(randomName)
            }

            // Get the artist data for the random name
            await retrieveArtist(randomName)
        }

        return Promise.resolve()
    }

    retrieveArtist(name)
        .then(() => {
            if (result.length === 0) {
                return retrieveRandomArtist()
            }
        })
        .then(() => {
            csvWriter.writeRecords(result)
                .then(() => {
                    res.send({
                        "message": `Data saved to ${filename}.`,
                        "data": result
                    });
                })
                .catch(error => {
                    next(error)
                });
        })
        .catch(error => {
            next(error)
        })
}

export default searchArtist