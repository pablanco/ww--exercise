import * as utils from './utils';
import * as trello from './api.trello';
import * as spotify from './api.spotify';

let albumsList: any[] = [];
utils.ReadListFromFile('../data/discography.txt', (result: any) => {
    // Orders the list by year and name ASC
    let list: any[] = result;
    list.sort(
        (a, b) => {
            
            if(a.release_year == b.release_year) {
                return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
            } else {
                return (a.release_year < b.release_year) ? -1 : 1;
            }
        }
    )
    albumsList = list;
});


trello.TrelloClearList()
.then(
    result => {
        if(result) {
            return spotify.GetAccessSpotifyToken();        
        }
    }
).then(
    token => {
        
        if (!token){
            throw new Error('Spotify token is empty');
        }
        return spotify.GetAlbumsInformation(token);

    }
).then(
    (results: any[]) => {
        if (results){
            return results.map( (element: any) =>{
                    if(element && typeof element !== 'undefined'){
                        return {
                            name: element.name,
                            release_year: (element.release_date ? element.release_date.split('-')[0] : ''),
                            release_date: element.release_date,                    
                            total_tracks: element.total_tracks,
                            id: element.id,
                            href: element.href,
                            images: element.images
                        };
                    }
                
            });
        }else{
            throw new Error('No albums found');
        }
    }
).then(
   async (apiAlbums: any[]) => {
                
        // Declares promises to be accomplished
        let promiseArray: any[] = [];
        for (let index = 0; index < albumsList.length; index++) {            
            const album = apiAlbums.find((a: any) =>{
               return (typeof a !== 'undefined' && a.name == albumsList[index].name);
            });

            if(typeof album !== 'undefined'){                
                await utils.sleep(2500); // This delay is needed because trello api limit https://help.trello.com/article/838-api-rate-limits
                promiseArray.push(trello.TrelloCreateCard(album));
            }
        }
        // Execute all promises and return unique result
        return Promise.all(promiseArray);
    }
).then(
    responses => {
        console.log(responses.length);
        return;
    }
).catch(
    err => {
        console.log(err);
    }
);