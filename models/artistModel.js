import fs from 'fs'


// Return artist names from the JSON file artists.json.
function getArtistNames() {
    try {
        const jsonString = fs.readFileSync("artists.json");
        return JSON.parse(jsonString);
    } catch (err) {
        console.log(err)
        return [];
    }
}


// Format the artist data from last.fm to return only the necessary data.
function formatArtists(result) {
    const artists = result.map(artist => {
        return {
            name: artist.name,
            mbid: artist.mbid,
            url: artist.url,
            image_small: artist.image[0]["#text"],
            image: artist.image[3]["#text"]
        }
    })

    return artists
}

export { getArtistNames, formatArtists }