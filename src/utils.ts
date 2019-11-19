import * as fs from 'fs';
import * as path from 'path';
import * as stream from 'stream';
import * as readline from 'readline';

// Read the stream form a file and returns and array
export function ReadListFromFile(filePath: string, cb: any) {

    let input: any = fs.createReadStream(path.resolve(__dirname, filePath), 'utf8');
    var outstream: any = new stream;
    var rl: any = readline.createInterface(input, outstream);
    var arr: any[] = [];
    
    rl.on('line', (line: any) => {
            const data: any[] = line.split(/ (.+)/);
            if(data.length > 0){
                arr.push({
                    release_year: data[0],
                    name: data[1]
                });
            }
        }
    );
    rl.on('close', () => {
            return cb(arr);
        }
    );
}

// Time out function
export function sleep(ms: number) : Promise<any>{
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}