const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');

module.exports = (app) => {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(cors());
    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    app.set("trust proxy", 1);
    app.use(session({
        secret: '2a5368fcee85c165af6f364a14439c63fbfc4a45a9a7b3166b354339596250dddaf61c708f3d7c1c41d8476d9db06e420aed20db88c896a2f239762458748acf',
        resave: false,
        saveUninitialized: true
    }));
};
