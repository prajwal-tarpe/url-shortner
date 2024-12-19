const express = require("express");
const path = require('path')
const { connectToMongoDB } = require("./connect");
const staticRoute = require("./routes/staticRouter");
const urlRoute = require('./routes/url')
const URL = require('./models/url')
const app = express();
const PORT = 8002;

connectToMongoDB('mongodb://localhost:27017/urlShortner')
.then(() => console.log("Mongodb connected!"))

app.set("view engine","ejs");
app.set('views',path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.get('/test', async (req,res) => {
//     const allUrls = await URL.find({});
//     // return res.end(`
//     //     <html>
//     //         <head>

//     //         </head>
//     //         <body>
//     //             <ol>${allurls.map(url => `<li>${url.shortId} - ${url.redirectURL} - ${`url.visitHistory,length`}</li>`).join('')}</ol>
//     //         </body>
//     //     </html>
//     // `);
//     return res.render('home',{
//         urls: allUrls
//     });

// });

app.use("/url",urlRoute);
app.use("/",staticRoute);

app.get('/url/:shortId', async (req,res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    },
    { 
        $push: {
        visitHistory: {
            timestamp: Date.now()
        }
    },
 }
);
res.redirect(entry.redirectURL);
});

app.listen(PORT,() => console.log(`Server Started at ${PORT}`));