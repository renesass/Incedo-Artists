# Incedo Artists


A Node.js REST API application that handles the following:
- Searches for an artist by name based on the endpoint https://www.last.fm/api/show/artist.search and returns all the results for this artist.
- Writes the result to a user-supplied CSV filename.
- The CSV file includes (name, mbid, url, image_small, image).

If no results are returned from the endpoint, random artist names from `artists.json` file are retrieved. If an artist is not found, then another artist from the list will be tried out.


## Installing
```
npm install
```

Please create an `.env` file with the following content:
```
PORT=3000
LASTFM_KEY=[your_key_goes_here]
```

## Running
```
npm start
```

## Testing
```
# Retrieve artists and write the output to custom_output.csv
curl -X POST -d "name=snarky&filename=custom_output.csv" http://localhost:3000/api/artists/search

# Retrieve random artists because no artist were found and write to default filename
curl -X POST -d "name=asdf1234jkqwer3" http://localhost:3000/api/artists/search
```