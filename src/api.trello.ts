import * as rp from 'request-promise';

// TRELLO API VARS
const TRELLO_API_URL = 'https://api.trello.com/1/';
const TRELLO_API_KEY = 'f81911e057b5cd69092af0b6bdf49d22';
const TRELLO_API_SECRET = 'e42cc80f14b85dfeb5aaf367bc4b3d63c4657069455ddf9a836b53cd1376e203';
const TRELLO_LIST_ID = '5dd3382d2bdd58759c1706ff';
const TRELLO_BOARD_ID = '5dd3382d6c71746e4d324d41';


export async function TrelloClearList(): Promise<any> {

    // Build the request
    let options = {
        body: {
            key: TRELLO_API_KEY,
            token: TRELLO_API_SECRET
        },
        uri: `${TRELLO_API_URL}lists/${TRELLO_LIST_ID}/archiveAllCards`,
        method: 'POST',
        json: true
    };
    
    // Send the request
    console.log('Trello removing cards on list: ' + TRELLO_LIST_ID);

    return rp(options)
    .then(
        response => {
            return true;
        }
    ).catch(
        err => {
            console.log(err.error);
        }
    );

}

export function TrelloCreateList(name: string): Promise<any> {

    // Build the request
    let options = {
        body: {
            key: TRELLO_API_KEY,
            token: TRELLO_API_SECRET,
            idBoard: TRELLO_BOARD_ID,
            name: name
        },
        uri: `${TRELLO_API_URL}lists`,
        method: 'POST',
        json: true
    };
    
    // Send the request
    console.log('Trello creating list: ' + name);

    return rp(options)
    .then(
        response => {
            if(response)
            return response.id;
        }
    ).catch(
        err => {
            console.log(err.error);
        }
    );

}

export function TrelloCreateCard(data: any): Promise<any> {

    // Build the request
    let options = {
        body: {
            idList: TRELLO_LIST_ID,
            keepFromSource: 'all',
            key: TRELLO_API_KEY,
            token: TRELLO_API_SECRET,
            name: `${data.name} - ${data.release_year}`,
            desc: `Decade ${data.release_year.substring(2,3) }0s - ${data.href}`,
            urlSource: ( (data.images && data.images.length!==0) ? data.images[0].url : 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'),
        },
        uri: `${TRELLO_API_URL}cards`,
        method: 'POST',
        json: true
    };
    
    console.log('Trello api POST for: ' + data.release_year + ' ' + data.name);
    return rp(options)
    .then(
        response => {
            if (response) {
                return true;
            }
        }
    ).catch(
        err => {
            console.log(err.error);
        }
    );

}
