
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// var Promise = require('promise');
//var expressPromiseRouter = require("express-promise-router");
var router = express.Router();
var _ = require('underscore');
//var router = expressPromiseRouter();
process.env.NODE_ENV = 'test';
var knex = require('./server/db/knex');
//app.use(bodyParser());
app.use(bodyParser.json());
//router.use(bodyParser());
app.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
//router(app);
// Router middleware, mentioned it before defining routes.
var port = process.env.PORT || 5000;
app.use('/', express.static(__dirname + '/public'));

router.use(function(req,res,next) {
    console.log("/" + req.method);
    next();
});

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'example.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

// app.all('/*', function(req, res, next) {
//     // CORS headers
//     res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     // Set custom headers for CORS
//     res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
//     if (req.method == 'OPTIONS') {
//         res.status(200).end();
//     } else {
//         next();
//     }
// });
app.use(allowCrossDomain);
router.use(allowCrossDomain);

router.use("/book/:id",function(req,res,next){

    if(req.params.id == 0) {
        res.json({"message" : "You must pass ID other than 0"});
    }
    else next();
});

router.get("/",function(req,res){
    res.json({"message" : "Hello World"});
});

router.get("/book/:id",function(req,res){

    knex('book').where('number', req.params.id).select()
    .then(book => {
        //console.log(book);
        res.status(200).json({"book" : book});
    })
    .catch(error => {
       console.error('error: ',error);
    });
});

router.get("/cities/:bookid",function(req,res){
    knex('city').where('number', req.params.bookid).select()
    .then(city => {
        //console.log(book);
        res.status(200).json({"cities" : city});
    })
    .catch(error => {
        console.error('error: ',error);
    });
});



router.get("/books/:cityName",function(req,res){

    var subquery = knex('city').where({
        city: req.params.cityName
    }).select('number');

    console.log("The subquery result ",subquery);

     knex.select('*').from('book')
    .whereIn('number', subquery)
    .then(books => {
        console.log("The books are " ,books);
        res.status(200).json({"books" : books});
    })
    .catch(error => {
        console.error('error: ',error);
        return  res.json({
            errors: ['Could not get books by city name']
        });
    });
});


router.get("/city/:bookTitle",function(req,res){
    var subquery = knex('book').where({
        title: req.params.bookTitle
    }).select('number');

     knex.select('*').from('city')
    .whereIn('number', subquery)
    .then(cities => {
        // console.log("The cities are " ,cities);
        res.status(200).json({"cities" : cities});
    })
    .catch(error => {
        console.error('error: ',error);
       return res.json({
            errors: ['Could not get cities by book title']
    });
});
});

router.get("/allInfo/:author",function(req,res){

    knex('book').select(['book.title', 'city.city', 'city.lat', 'city.longt'])
    .innerJoin('city', 'city.number', 'book.number')
    .then(books => {
        res.status(200).json({"books" :  books});
    })
    .catch(error => {
        console.error('error: ',error);
        return res.json({
            errors: ['Could not get cities by book title']
        });
   });
});

router.get("/rangeBooks/:range/:range2",function(req,res){

    knex('book').whereBetween('number', [req.params.range, req.params.range2])
    .then(books => {
        res.status(200).json({"books" :  books});
    })
    .catch(error => {
        console.error('error: ',error);
        return res.json({
            errors: ['Could not get cities by book title']
        });
    });
});


router.put("/bookUpdate/:bookTitle",function(req,res){
     knex('book')
    .where({title: req.params.bookTitle})
    .update({author: 'Yoana Georgieva'})
    .then(function(){
       res.json("Book's Author Updated!!!");
    })
    .catch(function(error){
        console.error(error);
         res.send(err);
    });

});

router.put("/citiesUpdate/:bookTitle/:cityName",function(req,res){

     knex.select('number')
    .from('book')
    .where({title: req.params.bookTitle})
    .then(function(rows){
        return _.map(rows,'number')
    })
    .then(function(numbers){
        numbers.map(num => {
            // return knex.update({city:req.param.cityName})
            return  knex('city')
            .where({number: num})
            .update({city: req.params.cityName})
             .then(function(){
                res.send("Successfully updated City!!!Bravo Joji!!!!")
            })
            .catch(function(error){
                console.error(error);
            })
        });

    })
    .catch(function(error){
        console.error(error);
        res.send(err);
    });

});

router.delete("/citiesDelete/:bookAuthor",function(req,res){
     knex.select('number')
    .from('book')
    .where({author: req.params.bookAuthor})
     .then(function(rows){
         return _.map(rows,'number')
         // _.pluck(rows, 'name');
     })
    .then(function(rows){
       // res.json("Book's Author Updated!!!");
         console.log('The rows are ',rows);
         rows.map(row => {
          //   console.log("The num is ",row);
             return knex('city').where({number:row}).del()
             .catch(function(error){
                 console.error(error);
             })
         });
         res.send("Successfully deleted!!!Bravo Joji!!!!")
    })
    .catch(function(error){
        console.error(error);
        res.send(err);
    });

});

router.post("/bookInput/:bookAuthor/:cityName",function(req,res){

    knex.select('number')
    .from('book')
    .where({author: req.params.bookAuthor})
    .andWhere('number' , '<' , 1000)
    .then(function(rows){
        return _.map(rows,'number')
        // _.pluck(rows, 'name');
    })
    .then(function(numbers){
        // return knex.insert({number: numbers}).into('city')
        //knex.map(function(number){})
        //console.log("The numbers ",numbers);
        numbers.map(num => {
            console.log("The num is ",num);
            return knex.insert({number:num,city:req.params.cityName},'id').into('city')
            .catch(function(error){
                console.error(error);
            })
        });
    })
    .then(function(id){
        console.log('Inserted ids ' + id);
        res.send("Successfully inserted!!!Bravo Joji!!!!")
    })
    //})
    .catch(function(error){
        console.error(error);
    });

});

router.post("/cityInputByBookTitle/:bookTitle",function(req,res){

    knex.select('number')
    .from('book')
    .where({title: req.params.bookTitle})
    .then(function(rows){
        return _.map(rows,'number')
        // _.pluck(rows, 'name');
    })
    .then(function(numbers){
        // return knex.insert({number: numbers}).into('city')
        //knex.map(function(number){})
        //console.log("The numbers ",numbers);
        numbers.map(num => {
           // console.log("The num is ",num);
            return knex.insert({number:num,city:req.body.city,lat:req.body.lat,longt:
            req.body.longt},'id').into('city')
            .catch(function(error){
                console.error(error);
            })
        });
    })
    .then(function(id){
        console.log('Inserted ids ' + id);
        res.send("Successfully inserted City!!!Bravo Joji!!!!")
    })
    //})
    .catch(function(error){
        console.error(error);
    });

});

router.post("/cityInputByBookAuthor/:bookAuthor",function(req,res){

    knex.select('number')
    .from('book')
    .where({author: req.params.bookAuthor})
    .then(function(rows){
        return _.map(rows,'number')
        // _.pluck(rows, 'name');
    })
    .then(function(numbers){
        // return knex.insert({number: numbers}).into('city')
        //knex.map(function(number){})
        //console.log("The numbers ",numbers);
        numbers.map(num => {
            // console.log("The num is ",num);
            return knex.insert({number:num,city:req.body.city,lat:req.body.lat,longt:
            req.body.longt},'id').into('city')
            .catch(function(error){
                console.error(error);
            })
        });
    })
    .then(function(id){
        console.log('Inserted ids ' + id);
        res.send("Successfully inserted City!!!Bravo Joji!!!!")
    })
    //})
    .catch(function(error){
        console.error(error);
    });

});

router.post("/bookPost", function(req,res){
//console.log('The body is ',req.body);
   // var title = req.body.;
    knex('book').insert({title: req.body.title, author:req.body.author})
    .then(function(){
        res.json("Book is posted !!!");
    })
    .catch(function(error){
        console.error(error);
        res.send(err);
    });
});




router.post("/cityInput/:bookAuthor/:cityName",function(req,res){

     knex.select('number')
     .from('book')
     .where({author: req.params.bookAuthor})
     .andWhere('number' , '<' , 1000)
     .then(function(rows){
         return _.map(rows,'number')
        // _.pluck(rows, 'name');
     })
      .then(function(numbers){
         // return knex.insert({number: numbers}).into('city')
         //knex.map(function(number){})
         console.log("The numbers ",numbers);
         numbers.map(num => {
             console.log("The num is ",num);
            return knex.insert({number:num,city:req.params.cityName},'id').into('city')
             .catch(function(error){
                 console.error(error);
            })
         });

       })
         .then(function(id){
             console.log('Inserted ids ' + id);
           res.send("Successfully inserted!!!Bravo Joji!!!!")
         })
      //})
       .catch(function(error){
           console.error(error);
       });

});






//
//     knex('book').whereBetween('number', [req.params.range, req.params.range2])
//     .then(books => {
//         res.status(200).json({"books" :  books});
//     })
//     .catch(error => {
//         console.error('error: ',error);
//         return res.json({
//             errors: ['Could not get cities by book title']
//         });
//     });
// });


// Handle 404 error.
// The last middleware.
// app.use("*",function(req,res){
//     res.status(404).send('404');
// });

// const router = express.Router();
// process.env.NODE_ENV = 'test';
// const knex = require('./server/db/knex');
// Define the port to run on

//app.set('port', 5000);

//app.use('/static', express.static(__dirname, '/public/index.html'));
//////////app.use('/', express.static(__dirname + '/public'));
//console.log(__dirname);
// Listen for requests
//////////////
// var books = require('./server/routes/books');
 //app.use('/books', books);
//////////////////
// app.get('/books/:quesNum', (req, res, next) => {
//     var quesNum = req.param('quesNum');
//     console.log(quesNum);
//     // knex.select('*').from('book_city')
//     //     .whereIn('book_id',function(){
//     //     this.select('id').from('book').whereRaw('title = ');
//     knex.raw('select * from users where id in (select id from book where title =(?)', [quesNum]);
//
//   })
// .then((cities) => {
//     res.status(200).json({
//         status: 'success',
//         data: cities,
//       });
//   })
// .catch((err) => {
//     res.status(500).json({
//         status: 'error',
//         data: err,
//       });
//   });
//});

app.use("/api",router);
router.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status( err.code || 500 )
        .json({
            status: 'error',
            message: err
        });
    });
}


// production error handler
// no stacktraces leaked to user
//
// router.use(function(err, req, res, next) {
//         res.status(err.status || 500)
//         .json({
//             status: 'error',
//             message: err.message
//         });
//     });

router.use(function(err, req, res, next) {
    res.status(err.status || 500)
    .json({
        status: err.status,
        message: err.message
    });
});


var server = app.listen(port, function () {
    var port = server.address().port;
    console.log('Magic happens on port ' + port);
  });
