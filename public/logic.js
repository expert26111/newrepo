(function(){
    var app=angular.module('activity',[]);
    app.controller('coolController',['$http','$scope',function($http,$scope){

        // function myMap() {
        //   };


        $scope.bla="Hello";
        $scope.booksFromCityName = [];
        $scope.citiesFromBookName = [];
        $scope.infoByAuthors = [];
        $scope.infoCityByBookId = [];
        $scope.booksInRange = [];
        $scope.postGreeting = {};
        $scope.error = {};
        var URL="http://localhost:5000/api/city/";
        var URLAuthor="http://localhost:5000/api/allInfo/";
        var URL33="http://localhost:5000/api/books/";
        var URL2 = "https://glacial-shelf-28163.herokuapp.com/api/city/";
        var URL3 =  "https://glacial-shelf-28163.herokuapp.com/api/books/";
        var URLCitiesByBookId = "http://localhost:5000/api/cities/";
        var URLBooksByRange = "http://localhost:5000/api/rangeBooks/";
        var URLpostcitybyauthor = "http://localhost:5000/api/cityInput/";
        var URLputBook = "http://localhost:5000/api/bookUpdate/";
        var URLdeletecities = "http://localhost:5000/api/citiesDelete/";
        var URLbookPost = "http://localhost:5000/api/bookPost";
        var URLcityPostByBookTitle = "http://localhost:5000/api/cityInputByBookTitle/";
        var URLcityPostByBookAuthor = "http://localhost:5000/api/cityInputByBookAuthor/";
        var URLUPDATEcITYbYBOOKTITLEWITHName = "http://localhost:5000/api/citiesUpdate/";

        $scope.getFirst=function(bookName){

            $http.get(URL+bookName).success(function(data,status){
         //       console.log(data.cities);
                //$scope.booksFromCityName=[];
                deleteMarkers();
                $scope.booksFromCityName=data.cities;
            }).error(function(data,status){

            });

        };

        $scope.getCities=function(cityName){

            $http.get(URL33+cityName).success(function(data,status){
                console.log(" The cities are ",data);
                //$scope.booksFromCityName=[];
                //  deleteMarkers();
                $scope.citiesFromBookName = data.books;
                //  $scope.booksFromCityName = [];

            }).error(function(data,status){

            });

        };

        $scope.getAllInfo=function(authorName){

            $http.get(URLAuthor+authorName).success(function(data,status){
                console.log(" The info  is ",data);
              //  $scope.infoByAuthors = data.books;
                  $scope.infoByAuthors = data.books;

            }).error(function(data,status){

            });

        };

        $scope.getAllCities=function(bookid){
                 //console.log("I am in func");
            //console.log("The type of bookid is ", typeof(bookid) );
            var parsedBookId = parseInt(bookid);
            $http.get(URLCitiesByBookId+parsedBookId).success(function(data,status){
                console.log(" The info  is ",data);
                //  $scope.infoByAuthors = data.books;
               // $scope.infoByAuthors = data.city;
                $scope.infoCityByBookId = data.cities;

            }).error(function(data,status){

            });

        };


        $scope.getBooksRange=function(bookid1,bookid2){
            //console.log("I am in func");
            //console.log("The type of bookid is ", typeof(bookid) );
            var parsedBookId1 = parseInt(bookid1);
            var parsedBookId2 = parseInt(bookid2);
            $http.get(URLBooksByRange+parsedBookId1 +"/"+parsedBookId2).success(function(data,status){
                console.log(" The info  is ",data);
                //  $scope.infoByAuthors = data.books;
                // $scope.infoByAuthors = data.city;
            //    $scope.infoCityByBookId = data.cities;
                $scope.booksInRange = data.books;

            }).error(function(data,status){

            });

        };


        $scope.postCity=function(author,city){
            $http.post(URLpostcitybyauthor+author +"/"+city).success(function(data,status){

                  $scope.postGreeting = data;
            }).error(function(data,status){
                   console.log(data);
            });
        };

        $scope.postBook=function(book){
            $http({
                method:'POST',
                url: URLbookPost,
                headers: {
                    "Content-Type": "application/json"
                },
                data : book}).success(function(data,status){

                $scope.postGreeting = data;
            }).error(function(data,status){
                console.log(data);
                $scope.error = data;
            });
        };

        $scope.postCityNew2=function(cityNew2,theauthor){
            $http({
                method:'POST',
                url: URLcityPostByBookAuthor+theauthor,
                headers: {
                    "Content-Type": "application/json"
                },
                data : cityNew2}).success(function(data,status){

                $scope.postGreeting = data;
            }).error(function(data,status){
                console.log(data);
                $scope.error = data;
            });
        };

        $scope.putCityNewName=function(thexistTitle,cityNewName){
            $http({
                method:'PUT',
                url: URLUPDATEcITYbYBOOKTITLEWITHName+thexistTitle+"/"+cityNewName,
                headers: {
                    "Content-Type": "application/json"
                }
               }).success(function(data,status){

                $scope.postGreeting = data;
            }).error(function(data,status){
                console.log(data);
                $scope.error = data;
            });
        };


        $scope.postCityNew=function(city,thetitle){
            $http({
                method:'POST',
                url: URLcityPostByBookTitle+thetitle,
                headers: {
                    "Content-Type": "application/json"
                },
                data : city}).success(function(data,status){

                $scope.postGreeting = data;
            }).error(function(data,status){
                console.log(data);
                $scope.error = data;
            });
        };


        $scope.putCity=function(title){
            $http.put(URLputBook+title).success(function(data,status){
                //  console.log(" The info  is ",data);
                $scope.postGreeting = data;
                //  $scope.infoByAuthors = data.books;
                // $scope.infoByAuthors = data.city;
                //    $scope.infoCityByBookId = data.cities;
                // $scope.booksInRange = data.books;

            }).error(function(data,status){
                console.log(data);
                $scope.error = data;
            });

        };

        // $scope.putCity=function(title){
        //     $http.put(URLputBook+title).success(function(data,status){
        //         //  console.log(" The info  is ",data);
        //         $scope.postGreeting = data;
        //         //  $scope.infoByAuthors = data.books;
        //         // $scope.infoByAuthors = data.city;
        //         //    $scope.infoCityByBookId = data.cities;
        //         // $scope.booksInRange = data.books;
        //
        //     }).error(function(data,status){
        //         console.log(data);
        //         $scope.error = data;
        //     });
        //
        // };




        $scope.deleteCities=function(author){
            $http.delete(URLdeletecities+author).success(function(data,status){
                //  console.log(" The info  is ",data);
                $scope.postGreeting = data;
                //  $scope.infoByAuthors = data.books;
                // $scope.infoByAuthors = data.city;
                //    $scope.infoCityByBookId = data.cities;
                // $scope.booksInRange = data.books;

            }).error(function(data,status){
                console.log(data);
                $scope.error = data;
            });

        };

        var mapProp={
            center:new google.maps.LatLng(51.508742,-0.120850),zoom:3,
        };
        var map=new google.maps.Map(document.getElementById("map"),mapProp);
        var marker;
        var markers = [];
        var i;
        var infowindow = new google.maps.InfoWindow();
     // setTimeout(   $scope.placeMarkers = function(){
     //        for(i=0; i<$scope.booksFromCityName.length; i++){
     //            marker=new google.maps.Marker({
     //                // position:new google.maps.LatLng($scope.booksFromCityName[i].lat,$scope.booksFromCityName[i].longt),map:map
     //                position:new google.maps.LatLng($scope.booksFromCityName[i].lat,$scope.booksFromCityName[i].longt),
     //                map:map
     //            });
     //            markers.push(marker);
     //
     //            google.maps.event.addListener(marker, 'click', (function(marker, i) {
     //                return function() {
     //                    infowindow.setContent($scope.booksFromCityName[i].city);
     //                    infowindow.open(map, marker);
     //                }
     //            })(marker, i));
     //
     //        }
     //    },3000);

        setTimeout(   $scope.placeMarkers = function(){
               for(i=0; i<$scope.booksFromCityName.length; i++){
                   marker=new google.maps.Marker({
                       // position:new google.maps.LatLng($scope.booksFromCityName[i].lat,$scope.booksFromCityName[i].longt),map:map
                       position:new google.maps.LatLng($scope.booksFromCityName[i].lat,$scope.booksFromCityName[i].longt),
                       map:map
                   });
                   markers.push(marker);

                   google.maps.event.addListener(marker, 'click', (function(marker, i) {
                       return function() {
                           infowindow.setContent($scope.booksFromCityName[i].city);
                           infowindow.open(map, marker);
                       }
                   })(marker, i));

               }
           },3000);

        function setMapOnAll(map) {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
            }
        }

        function clearMarkers() {
            setMapOnAll(null);
        }

        function deleteMarkers() {
            clearMarkers();
            markers = [];
        }

        map.addListener('click', function(event) {
            addMarker(event.latLng);
        });
        // function myMap() {
        //     var mapProp= {
        //         center:new google.maps.LatLng(51.508742,-0.120850),
        //         zoom:5,
        //     };
        //     var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
        // }


    }]);
})();
