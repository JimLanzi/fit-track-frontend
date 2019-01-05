import decode from 'jwt-decode'
export default class AuthService
{
    // Initialize class variables
    constructor(domain)
    {
        this.domain = domain || 'http://208.68.36.25/api' // Api server domain
        this.fetch = this.fetch.bind(this);             // React binding stuff 
        this.login = this.login.bind(this);             // TODO: figure out what
        this.getProfile = this.getProfile.bind(this);   //       this means!!
        console.log('Auth Service Domain: ',this.domain);
    }

    login(user_name, password)
    {
        // Get a token from the api server using fetch
        console.log('Sending login query: ');
        return this.fetch(`${this.domain}/login`, 
                { method: 'POST',
                  body:   JSON.stringify({user_name:user_name, password:password})
                })
               .then(res => {
                   console.log('Client Login SUCCESS!!');
                   this.setToken(res.token);    // set token in local storage
                   return Promise.resolve(res); // TODO: learn JavaScript Promise
               });
    }

    register(user_name, password, first_name, last_name) {
        console.log("Attempting to register ", this.domain, user_name, password);
        return this.fetch(`${this.domain}/register`, {
          method: "POST",
          body: JSON.stringify({
            user_name,
            password,
            first_name,
            last_name,
          })
        }).then(res => {
            this.setToken(res.token);
            return Promise.resolve(res);
        });
    }

    loggedIn()
    {
        // Check to see if there is a saved valid token 
        const token = this.getToken();  // Get token from local storage
        // We are logged in if we not not have a token and 
        // if the token is not expired
        return !!token && !this.isTokenExpired(token); 
    }

    isTokenExpired(token)
    {
        try
        {
            const decoded = decode(token);
            if(decoded.exp < Date.now()/1000)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        catch(err)
        {
            return false;
        }
    }

    setToken(idToken)
    {
        // Saves user token to local storage
        localStorage.setItem('id_token',idToken);
    }

    getToken()
    {
        // Retrieve user token and profile dat afrom local storage
        return localStorage.getItem('id_token');
    }

    logout()
    {
        // Clear user token and profile from local storage
        localStorage.removeItem('id_token');
    }

    getProfile()
    {
        // Decode token
        return decode(this.getToken());
    }

    fetch(url, options)
    {
        // Perform api call sending required authentication headers
        const headers = {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        };

        // Set Authorization header
        if(this.loggedIn())
        {
            headers['Authorization'] = 'Bearer ' + this.getToken();
        }

        console.log('FETCHING: ',url);
        console.log(headers);

        return fetch(url, {headers, ...options})  // TODO: What the heck is ... syntax about???
            .then(this.__checkStatus)
            .then(response => response.json());
    }

    _checkStatus(response)
    {
        // raise exception if response status is not success
        if(response.status >= 200 && response.status < 300)
        {
            return response;  // success
        }
        else
        {
            var error = new Error(response.statusText);
            error.response = response;
            throw error;
        }
    }

}
