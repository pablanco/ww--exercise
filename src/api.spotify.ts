import * as rp from 'request-promise';

// SPOTIFY API VARS
const SPOTIFY_API_URL = 'https://accounts.spotify.com/api/';
const SPOTIFY_API_CLIENT_ID = '0611d087ef594fbe82f5d851ba18d93e';
const SPOTIFY_API_SECRET = '3743d5d65b1e473eb6fd39d2b06bb19d';

// Bob Dylan artist id
const ARTIST_ID = '74ASZWbe4lXaubB36ztrGX'

export function GetAccessSpotifyToken(): Promise<any> {

    // Build the request
    let options = {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(SPOTIFY_API_CLIENT_ID + ':' + SPOTIFY_API_SECRET).toString('base64'))
        },
        form: {
                grant_type: 'client_credentials'
        },
        uri: SPOTIFY_API_URL + 'token' ,
        json: true
    };

    // Send the request
    return rp(options)
    .then(
        response => {
            if (response && response.access_token){
                return response.access_token;
            }else{
                return null;
            }
        }
    ).catch(
        err => {
            console.log(err);
        }
    );

}

export function GetAlbumsInformation(token: string): Promise<any> {

    // Build the request
    let options = {
        
        uri: `https://api.spotify.com/v1/artists/${ARTIST_ID}/albums?limit=50&include_groups=album,single`,
        method: 'GET',
        headers : {
            'Authorization': `Bearer ${token}`
        },
        json: true      
    };

    // Send the request
    return rp(options)
    .then(
        (response: any) => {
            return response.items;
        }
    ).catch(
        err => {
            console.log(err);
        }
    );

}

export function SearchAlbumInformation(token: string, album: string): Promise<any[]> {

    // Build the request
    let options = {
        uri: 'https://api.spotify.com/v1/search?q=' + encodeURIComponent(album) + '&type=album',
        method: 'GET',
        headers : {
            'Authorization': `Bearer ${token}`
        },
        json: true      
    };

    // Send the request
    return rp(options)
    .then(
        (response: any) => {
           if(response.albums && response.albums.items.length !== 0 && 
                response.albums.items[0].artists[0].id === ARTIST_ID){
                return response.albums.items[0];
            }else{
                return null;
            }
        }
    ).catch(
        err => {
            console.log(err);
        }
    );

}