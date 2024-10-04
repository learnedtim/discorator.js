import chalk     from 'chalk';
import Token from '../util/Token.js';
import Gateway from './Gateway.js';
import { calculateIntentBits } from '../util/intents.js';
import { EventEmitter } from 'node:events';

class NetworkError extends Error {}

/** Handles credentials and API requests. */
export default class Client extends EventEmitter {
    #token;
    #usrAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3';
    discordApiBase = 'https://discord.com/api/v10'

    /**
     * @param {Object} systemArgs
     * @param {boolean} [systemArgs.verbose] -- Whether or not to log verbose output to the console.
     * @param {number} [systemArgs.maxGuardedLoops] -- The maximum number of times the library will attempt to solve a problem before giving up.
     * @param {number} [systemArgs.captchaPollInterval] -- The interval in seconds at which the library will poll the 2captcha API for a captcha solution.
     * @param {number} [systemArgs.maxCaptchaPolls] -- The maximum number of times the library will poll the 2captcha API for a captcha solution before giving up.
     * @param {boolean} [systemArgs.autoRetry] -- Whether or not the library will automatically retry requests that fail due to rate limiting.
     * @param {number} [systemArgs.maxRlRetryTime] -- The maximum amount of time in seconds the library will wait before giving up on a rate limited request.
     * @param {string} [systemArgs.twoCaptchaEndpoint] -- The endpoint at which the library will send captcha requests to 2captcha.
     * @param {string} [systemArgs.discordLoginEndpoint] -- The endpoint at which the library will send login requests to Discord.
     * @param {string} systemArgs.userType -- The type of user the library is being used for. (bot/user)
     * @param {Object} [systemArgs.intents] -- The intents to use for the bot. Array of the IntentBits object. {@link https://discord.com/developers/docs/topics/gateway#gateway-intents}
     * @param {boolean} [systemArgs.surpressIntentWarnings] -- Whether or not to surpress warnings about missing intents.
     * @param {boolean} [systemArgs.surpressCaptchaWarnings] -- Whether or not to surpress warnings about missing captcha tokens.
     * @param {boolean} [systemArgs.surpressTotpWarnings] -- Whether or not to surpress warnings about missing TOTP tokens.
     * 
     */
    constructor(systemArgs) {
        return(async () => {
            super()

            this.client = {}
            this.sysArgs = systemArgs

            // validate system args provided by user
            if ('maxGuardedLoops' in this.sysArgs) if (typeof this.sysArgs.maxGuardedLoops != 'number' || this.sysArgs.maxGuardedLoops <= 1) throw new Error('maxGuardedLoops must be a number and greater than 1. ..aborting')
            if ('captchaPollInterval' in this.sysArgs) if (typeof this.sysArgs.captchaPollInterval != 'number' || this.sysArgs.captchaPollInterval >= 1000) throw new Error('captchaPollInterval must be a number in seconds. (not milliseconds) ..aborting') 
            if ('maxCaptchaPolls' in this.sysArgs) if (typeof this.sysArgs.maxCaptchaPolls != 'number' || this.sysArgs.maxCaptchaPolls <= 1) throw new Error('maxCaptchaPolls must be a number and greater than 1. ..aborting')
            if ('autoRetry' in this.sysArgs) if (typeof this.sysArgs.autoRetry != 'boolean') throw new Error('autoRetry must be a boolean. ..aborting')
            if ('maxRlRetryTime' in this.sysArgs) if (typeof this.sysArgs.maxRlRetryTime != 'number' || this.sysArgs.maxRlRetryTime <= 1) throw new Error('maxRlRetryTime must be a number and greater than 1. ..aborting')
            if (!'userType' in this.sysArgs) throw new Error('No userType (bot/user) was provided. ..aborting')
            if (this.sysArgs.userType != 'bot' && this.sysArgs.userType != 'user') throw new Error('Invalid userType provided (bot/user). ..aborting')
            if (!('intents' in this.sysArgs)) throw new Error('No intents were provided. (attribute "Intents", takes an array of IntentBits) ..aborting')

            // create default, essential variables
            if (!('maxGuardedLoops' in this.sysArgs)) this.sysArgs.maxGuardedLoops = 3
            if (!('verbose' in this.sysArgs)) this.sysArgs.verbose = false
            if (!('captchaPollInterval' in this.sysArgs)) this.sysArgs.captchaPollInterval = 10
            if (!('autoRetry' in this.sysArgs)) this.sysArgs.autoRetry = true
            if (!('maxRlRetryTime' in this.sysArgs)) this.sysArgs.maxRlRetryTime = 30
            if (!('maxCaptchaPolls' in this.sysArgs)) this.sysArgs.maxCaptchaPolls = 10
            if (!('twoCaptchaEndpoint' in this.sysArgs)) this.sysArgs.twoCaptchaEndpoint = 'https://api.2captcha.com/createTask'
            if (!('discordLoginEndpoint' in this.sysArgs)) this.sysArgs.discordLoginEndpoint = 'https://discord.com/api/v9/auth/login'
            if (this.discordApiBase.charAt(this.discordApiBase.length - 1) == '/') this.discordApiBase = this.discordApiBase.slice(0, -1)
            if (this.sysArgs.userType == 'bot') this.#usrAgent = 'DiscordBot (https://github.com/learnedtim/discoratorjs, 1.0.0)'

            return this;
        })();
    }

    /**
     * API Error catcher (e.g. Request Denied or any other 4xx/5xx error)
     * @param {*} response 
     * @returns {boolean} ok -- Whether or not the request was successful.
     * @returns {boolean} retry -- Whether or not the request should be retried.
     * @returns {string} error -- The error message
     * @returns {[number]} retryIn -- OPTIONAL
     */
    async #apiErrorCatcher(response)  {
        let retry   = null
        let error   = null
        let retryIn = null
        let updatedOptions = null
        if (response.ok) return { ok: true, retry: retry, error: error, retryIn: retryIn, updatedOptions: updatedOptions }
        // catch here

        return { ok: false, retry: retry, error: error, retryIn: retryIn, updatedOptions: updatedOptions }
    }

    /**
     * Base Api Request
     * @param {Object} data 
     * @param {[get|post|put|delete|patch]} data.method -- The HTTP method to use for the request. (get/post/put/delete/patch)
     * @param {string} data.endpoint -- The endpoint to send the request to.
     * @param {Object} [data.headers] -- The headers to send with the request.
     * @param {Object} [data.payload] -- The payload to send with the request.
     * @param {Object} [data.params] -- The parameters to send with the request.
     * @param {boolean} [data.auth=true] -- Whether or not to include the Authorization header in the request. (default: true)
     * 
     * @returns {Promise} -- The response from the API.
     */
    async apiRequest(data) {
        //console.log(data)

        // this function exists because Axios sucks more than my parents' marriage (in certain aspects)
        let findData = (apiResponse) => {
            let result = []
            let done   = false
            let count  = 0

            result.push({index: 0, unique: 'toplevel', data: apiResponse})
            while (done == false && count < this.sysArgs.maxGuardedLoops) {
                //console.log(result)
                for (let key in apiResponse) {
                    if (key == 'data' && typeof apiResponse[key] == 'object') {
                        result.push({index: count + 1, data: apiResponse[key]})
                        apiResponse = apiResponse[key]
                    }
                }
                if (result.length < 2) done = true
                count++
            }
            //console.log(result)
            if (Object.keys(result).length === 0) throw new Error("No 'data' key was found in the response. ..aborting");
            // get highest index in result array
            result = result.reduce((max, current) => current.index > max.index ? current : max, result[0]);
            return result
        }

        if (!(typeof this.#token == 'string')) throw new Error('No token was provided. ..aborting')
        if ('data' in data) console.warn(chalk.bgYellow(' WARN ') + chalk.yellow(' Property "data.data" was provided, but is not valid. Did you mean "data.payload"?'))
        if (!('method' in data)) throw new Error('No method was provided. ..aborting')
        if (!('endpoint' in data)) throw new Error('No endpoint was provided. ..aborting')
        if (data.endpoint.charAt(0) == '/') data.endpoint = data.endpoint.slice(1)
        data.method = data.method.toLowerCase()
        if (data.method != 'get' && data.method != 'post' && data.method != 'put' && data.method != 'delete') throw new Error('Invalid method provided. ..aborting')
        if (data.method == 'get' && 'payload' in data) throw new Error('GET requests cannot contain a payload. You may need to use parameters instead. ..aborting')

        let options = {}
        if ('method'   in data)  options.method  = data.method
        if ('headers'  in data)  { options.headers = data.headers } else options.headers = {}
        if ('payload'  in data)  options.body    = data.payload
        if ('params'   in data)  options.params  = data.params
        if (!('auth'    in data && data.auth == false)) options.headers["Authorization"] = this.#token
        if (!('auth'    in data && data.auth == false)) options.headers["User-Agent"]    = this.#usrAgent
        if (!('auth'    in data && data.auth == false)) options.headers["Content-Type"]    = 'application/json'
        //console.log(request.url)
        //console.log(request)

        // lower request size and potential for errors by removing functions from the payload
        if ('data' in options) {
            for (let key in options.data) {
                if (typeof options.data[key] == 'function') delete options.data[key]
            }
        }

        // change body to string
        if ('body' in options) options.body = JSON.stringify(options.body)

        // Base Request
        const request = async (options) => {
            let res;
            try {
                res = await fetch(`${this.discordApiBase}/${data.endpoint}`, options)
            } catch(err) {
                console.log(err)
                // Network Errors (e.g. unreachable server)
                throw new NetworkError(err) // temporary
            }
            return res;
        }   

        let response;
        let solved = false
        let loopCount = 0
        while (solved == false && loopCount < this.sysArgs.maxGuardedLoops) {
            console.log(options)
            response = await request(options) // network error? maybe implement this later, but for now the library will just throw an error.
            console.log(response)

            let httpCheck = await this.#apiErrorCatcher(response) // DiscordAPI error handling
            console.log(httpCheck)
            if (httpCheck.ok == true) return response.json() // success
            if (httpCheck.updatedOptions) options = httpCheck.updatedOptions
            if (httpCheck.retry == null) throw new Error(httpCheck.error)
            if (httpCheck.retryIn) { 
                await new Promise(r => setTimeout(r, httpCheck.retryIn * 1000 + 1000))
            }
            loopCount++
            // (redo request)
        }
        return response;
    } 

    /**
     * 
     * @param {Object} args
     * @param {string} args.email -- The email to use for the login.
     * @param {string} args.password -- The password to use for the login.
     * @param {string} args.captchaToken -- The captcha token to use for the login.
     * @param {string} args.totpToken -- The TOTP token to use for the login.
     * @returns {Promise<json>}
     */
    async loginByCredentials(args) {
        let token = await new Token(this)
        try {
            await token.generateToken(args)
            this.#token = await token.getToken()
            await this.instantiateGateway(this.sysArgs.intents)
            return { success: true }
        } catch (err) {
            throw new Error(err)
            // replace all throw new Errors with custom, expanded error class.
        }
    }

    /**
     * 
     * @param {string} token -- The token to use for the login; without a prefix like 'Bot' or 'Bearer'. 
     * @returns {Promise<json>} -- whether or not succesful. Access the token with this.getToken()
     */
    async loginByToken(token) {
        if (!token) throw new Error('No token was provided. ..aborting')
        if (typeof token != 'string') throw new Error('Invalid token provided. ..aborting')
        if (this.sysArgs.userType == 'bot') if (!token.startsWith('Bot')) token = `Bot ${token}`
        //console.log(token)
        this.#token = token

        await this.instantiateGateway(this.sysArgs.intents)

        return { success: true }
    }

    /**
     * Getter for the token
     * @returns {string} -- The token.
     */
    getToken() {
        if (this.#token == undefined) return false;
        return this.#token
    }

    /**
     * @deprecated deprecated (async??), use synchronous version
     * Getter for the token
     * @returns {string} -- The token.
     */
    async getTokenAsync() {
        if (this.#token == undefined) return false;
        return this.#token
    }

    /**
     * Instantiate Gateway (called by loginByToken, register and loginByCredentials)
     * @see https://discord.com/developers/docs/topics/gateway
     * @param {Number} [intents=37376] -- The intents to use for the bot. (default: 37376)
     * @param {Boolean} [sharding=false] -- Whether or not to use sharding. (default: false), amount of shards is determined by Discord
     * @param {Number} [shards=0] -- The amount of shards to use. (default: 0), when 0, the amount of shards is determined automatically by Discord
     */
    async instantiateGateway(intents, sharding=false, shards=1) {
        if (sharding == true && this.sysArgs.userType == 'user') throw new Error('Sharding is not available for user accounts. ..aborting')
        intents = typeof intents == 'number' ? intents : await calculateIntentBits(intents)

        if (sharding == true) {
            //let shardmanager = new ShardManager(this, intents, shards)
        } else {
            let gateway = await new Gateway(this, intents)
            await gateway.connect()
            if (this.sysArgs.verbose == true) console.log('Discord socket ready!')

            // Circular reference; fix later
            this.gateway = gateway
        }
    }

    /**
     * Event Emitter Delegator
     * Executes as many times as the event is emitted.
     * @param {string} event -- The event to listen for.
     * @param {function} listener -- The function to run when the event is emitted.
     */
    async on(event, listener) {
        this.gateway.on(event, listener)
    }

    /**
     * Event Emitter Delegator
     * Only executes the listener once.
     * @param {string} event -- The event to listen for.
     * @param {function} listener -- The function to run when the event is emitted.
     */
    async once(event, listener) {
        this.gateway.once(event, listener)
    }
}