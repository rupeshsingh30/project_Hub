const express = require('express');
const path = require('path');
const middleware = require('./middlewares/index');
const routes = require('./routes/index');
const config = require('./config/settings.config.json');
const { connectToMongoDb } = require("./dbConnection");

const app = express();
const PORT = process.env.PORT || config.port;

connectToMongoDb(config.database.url)

middleware(app);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);


const mainUrl = new URL(config.main_url);
mainUrl.port = PORT;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at ${mainUrl.href}`);
});

const path1 = path.join(__dirname,"public","views")
console.log(path1,"????")

// app.set('views', "C:\\Users\\Admin\\Downloads\\codes\\src\\public\\views");
// app.set('views', path.join(__dirname,"public","views"));
// app.set('view engine', 'ejs');