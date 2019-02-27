
var _Environments = {
    production: {
        BASE_URL: 'https://senjabina.onewoorks-solutions.com/api/',
        ASSET_URL: 'https://senjabina.onewoorks-solutions.com/images/',
        API_KEY: ''
    },
    staging: {
        BASE_URL: '', 
        API_KEY: ''
    },
    development: {
        BASE_URL: 'http://10.0.2.2/senjabina/api/', 
        ASSET_URL: 'http://10.0.2.2/senjabina/images/',
        API_KEY: ''
    },
}

export default Environment = _Environments.production;