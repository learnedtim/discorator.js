import chalk     from 'chalk';
import axios     from 'axios';
//TODO: migrate from direct axios requests to BaseAPIRequest thru the Client baseclass.

/**
 * Credentials manager
 * To be deprecated in favor of a direct client.login method.
 */
export default class Token {
    #token;

    constructor(client) {
        return(async () => {
            this.client = client
            return this;
        })();
    }

    async generateToken(args) {
        if (!args.email || !args.password) throw new Error('Username and password is required for credential login. ..aborting');
        if (!('surpressCaptchaWarnings' in this.client.sysArgs && this.client.sysArgs.surpressCaptchaWarnings == true)) if (!args.captchaToken) console.warn(chalk.bgYellow(' WARN ') + chalk.yellow(' 2Captcha API token missing. You may not be able to log in. Add "surpressCaptchaWarnings: true" to your Client arguments to surpress this warning.'))
        if (!('surpressTotpWarnings'    in this.client.sysArgs && this.client.sysArgs.surpressTotpWarnings    == true)) if (!args.twoFactor)    console.warn(chalk.bgYellow(' WARN ') + chalk.yellow(' Two factor authentication credentials missing. You may not be able to log in (potential LoginLocation error). Add "surpressTotpWarnings: true" to your Client arguments to surpress this warning.'))

        const captchaReqFunc = async (response) => {
            if (!args.captchaToken) throw new Error('Captcha detected, but no 2captcha API key was provided. ..aborting')

            if (this.client.sysArgs.verbose) console.log('Sending to 2Captcha API: POST /createTask')
            //console.log('KEY IS:' + args.captchaToken)
            let captchaResponse = await axios.post(this.client.sysArgs.twoCaptchaEndpoint, {
                clientKey: args.captchaToken,
                task: {
                    type: "HCaptchaTaskProxyless",
                    isInvisible: true,
                    websiteURL: "https://discord.com/login",
                    websiteKey: response.response.data.captcha_sitekey
                }
            }).catch((err) => {
                throw new Error('2Captcha API error: ' + err)
            })
            //console.log(captchaResponse)
            if (!"taskId" in captchaResponse.data) throw new Error('Unknown 2Captcha API error. (please open a GitHub issue so we can account for this!)' + captchaResponse.data)

            // await response from 2captcha (polling)
            let pollResponse = null;
            let guardCounter = 0;
            do {
                if (this.client.sysArgs.verbose) console.log('Polling 2Captcha API: GET /getTaskResult')
                pollResponse = await axios.post('https://api.2captcha.com/getTaskResult', {
                    clientKey: args.captchaToken,
                    taskId: captchaResponse.data.taskId
                }).catch((err) => {
                    throw new Error('2Captcha API error: ' + err)
                })
                if ('solution' in pollResponse.data) return pollResponse.data.solution.token;
                await new Promise(r => setTimeout(r, this.client.sysArgs.captchaPollInterval * 1000));
                guardCounter++
            } while (guardCounter <= this.client.sysArgs.maxCaptchaPolls);
        }
        if (this.client.sysArgs.verbose) console.log('Sending to Discord API: POST /auth/login')
        let response;
        try {
            response = await this.client.apiRequest({
                method: 'post',
                endpoint: '/auth/login',
                auth: false,
                payload: {
                    gift_code_sku_id: null,
                    login: args.email,
                    login_source: null,
                    password: args.password,
                    undelete: false
                },
                headers: { 
                    "X-Captcha-Key": null,
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36"
                }
            })
            if (response?.response?.data?.captcha_sitekey) {
                console.log('Captcha requested' + response.response.data.captcha_sitekey)
                const token = await captchaReqFunc(response)
                console.log('token received' + token)
                response = await this.client.apiRequest({
                    method: 'post',
                    endpoint: '/auth/login',
                    auth: false,
                    payload: {
                        gift_code_sku_id: null,
                        login: args.email,
                        login_source: null,
                        password: args.password,
                        undelete: false
                    },
                    headers: { 
                        "X-Captcha-Key": token,
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36"
                    }
                })
                //console.log(response)
            }
        } catch (err) {
            throw new Error('Error occured while logging in after including captcha (potential LoginLocation error?): ' + err + '\n ..aborting')
        }
        if ('token' in response.data) this.#token = response.data.token
        if ('ticket' in response.data) {
            
        }
        //this.#token = response.data.token     
        return { status: 200 }  
    }

    async applyToken(token) {
        if (typeof this.#token != "undefined") throw new Error('Token already set. ..aborting')
        this.#token = token
        return;
    }

    async getToken() {
        return this.#token;
    }
}