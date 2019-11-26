'use strict';

let http = require('http'),
    querystring = require('querystring');


class AGL {
    /**
     * initialize AGL and set default value and error handling
     * @param params
     */
    constructor(params){
        this.appKey = params.appKey;
        this.appSecret = params.appSecret;
        this.token = params.token || '';
        this.consumerKey = params.consumerKey || null;
        this.timeout = params.timeout;

        this.host = params.host || 'agl-developer-test.azurewebsites.net';
        this.port = params.port || 80;
        this.basePath = params.basePath || '/';
    }

    /**
     * Execute a request on the API
     *
     * @param {String} httpMethod: The HTTP method
     * @param {String} path: The request path
     * @param {Object} params: The request parameters (passed as query string or
     *                         body params)
     * @param {Object} refer: The parent proxied object
     */
     request(httpMethod, path, params, refer) {
        return new Promise((resolve, reject) => {
            // Replace "{str}", used for $call()
            if (path.indexOf('{') >= 0) {
                let newPath = path;
    
                for (let paramKey in params) {
                    if (params.hasOwnProperty(paramKey)) {
                        newPath = path.replace('{' + paramKey + '}', params[paramKey]);
    
                        // Remove from body parameters
                        if (newPath !== path) {
                            delete params[paramKey];
                        }
    
                        path = newPath;
                    }
                }
            }
    
            let options = {
                host: this.host,
                port: this.port,
                method: httpMethod,
                path: this.basePath + path
            };
    
            // Headers
            options.headers = {
                'Content-Type': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                'Accept': '*/*'
            };
    
            // Remove undefined values
            for (let k in params) {
                if (params.hasOwnProperty(k) && params[k] == null) {
                    delete params[k];
                }
            }
    
            let reqBody = null;
            if (typeof(params) === 'object' && Object.keys(params).length > 0) {
                if (httpMethod === 'PUT' || httpMethod === 'POST') {
                    // Escape unicode
                    reqBody = JSON.stringify(params).replace(/[\u0080-\uFFFF]/g, (m) => {
                        return '\\u' + ('0000' + m.charCodeAt(0).toString(16)).slice(-4);
                    });
                    options.headers['Content-Length'] = reqBody.length;
                }
                else {
                    options.path += '?' + querystring.stringify(params);
                }
            }
    
            if (path.indexOf('/login') < 0) {
                // Sign request
                if (typeof(this.consumerKey) === 'string') {
    
                }
            }
    
            let req = http.request(options, (res) => {
                let body = ''
    
                res.on('data', (chunk) => body += chunk);
    
                res.on('end', () => {
                    let response;
                    
                    if (body.length > 0) {
                        try {
                            response = JSON.parse(body);
                        }
                        catch (e) {
                            return reject('[AGL] Unable to parse JSON reponse');
                        }
                    }
                    else {
                        response = null;
                    }
                    resolve(response);
                });
            });
    
            // istanbul ignore next
            req.on('error', (e) => reject(e.errno || e.body));
    
            // istanbul ignore next
            // mocked socket has no setTimeout
            if (typeof(this.timeout) === 'number') {
                req.on('socket', (socket) => {
                    socket.setTimeout(this.timeout);
                    if (socket._events.timeout != null) {
                        socket.on('timeout', () => req.abort());
                    }
                });
            }
    
            if (reqBody != null) {
                req.write(reqBody);
            }
    
            req.end();
        });
    }

    /**
     * get list of people and their pets
     */
    fetch(){
        return this.request('GET', 'people.json', {});     
    }

    /**
     * output an array of all the cats in alphabetical order under a heading of the gender of their owner
     * @param {*} pets 
     */
    sortCats(pets){
        let male = [], female = [], cats=[];
        pets.forEach((owner) => {
            if(owner.pets !== null) {
                owner.pets.forEach((pet) => {
                    if(pet.type == 'Cat'){
                        switch (owner.gender) {
                            case 'Male':
                                male.push(pet);
                                break;
                            case 'Female':
                                female.push(pet);
                                break;
                            default:
                                break;
                        }
                    }
                })
            }
        })
    
        const sortedMale = male.sort((a, b) => a.name.localeCompare(b.name, undefined, { caseFirst: "upper" }));
        const sortedFemale = female.sort((a, b) => a.name.localeCompare(b.name, undefined, { caseFirst: "upper" }));

        cats['male'] = sortedMale;
        cats['female'] = sortedFemale;

        return cats;
    }

    //@todo: method to sign request for better security for OAuth2
    signRequest(){

    }
}

module.exports = function(params){
    return new AGL(params || {});
}