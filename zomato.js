var myURL="https://developers.zomato.com/api/v2.1/categories";
/* This is the HTML template to display the results obtained from 
the zomato api..
It uses the row and divides the row into three sections of sizes 3,7,2..
Section of 3 is used to display the image, 
7 is used to display restaurants name and address and
2 is used to dispaly the rating and reviews..
all the variables like restaurant name,link are represented by $$ and will be 
dynamically replaced with the results obtained from the zomato api..
*/
var htmlTemplate=('<br><br><br> <div class="cardContent">'+
'<div class="row">'+
	'<div class="col-sm-3">'+
		'<a href="$$imagelink" class="feat-img " style="  background-image:url(https://b.zmtcdn.com/images/placeholder_200.png);" data-original="https://b.zmtcdn.com/images/placeholder_200.png?output-format=webp">'+
		'</a>'+
	'</div>'+
	'<div>'+
		'<div class="col-sm-7">'+
			'<div class="row">'+
				'<a class="restaurant-name nowrap " href="$$linkname">$$name</a>'+
			'</div>'+
		'<div class="row">'+
			'<a class="zblack " title="Restaurants in Woodbridge" ><b>$$city</b></a></div>'+
		'<div class="row">$$address</div></div>'+
		'<div class="reviews col-sm-2 nowrap">'+
			'<a href="">$$rating</a>'+
		'<div><span>Votes:$$vote</span></div>'+
		'<!--  <div><a>10 reviews</a></div> -->'+
		'</div>'+
		'</div>'+
		'</div><br>'+
		'<div class="divider row"></div><br>'+
	'<div class="row">'+
		'<div><span class="fontsize5 grey-text col-sm-3" >Cuisines: </span><span class="col-sm-7 left"><a title="Japanese" >$$cuisines</a></span></div>'+
		'</div>'+
			'<div class="row">'+
            '<div>'+
      			'<span class="fontsize5 grey-text col-sm-3" >Cost:</span>'+
				'<span class="col-sm-7 left">'+
				''+
				'$$</span>'+
				'</div></div>'+
				'<!--   <div class="row">                      '+
				'<div >'+
					'<span class="fontsize5  grey-text col-sm-3">Hours:</span>'+
						'<span class="col-sm-7 left">'+
						'(Sun),Lunch, Dinner (Mon-Sat)'+
						'</span>'+
						'</div>'+
		'</div> -->	</div>'+
        '');
/*This function is responsible for retriving the entity details based 
on the location entered in the location textbox..*/
function getEntityDetailsBasedOnLocation(callback) {
	var url="https://developers.zomato.com/api/v2.1/locations";
	var city=$("#loc").val();
	//Setting the search api parameters.. 
    var searchQ = {
		    apikey:'95adb6f09319ee2ad8f284f39dfb7d4b',
		    query: city
       		}
       		//firing ajax request..
    $.getJSON(url, searchQ, callback);
}
/*This function is responsible for retriving the restaurant details from zomato api..*/
function getRestaurantDetailFromAPI (data) {
	var entityID="";
	var entityType="";
	//retrieving the entity id and entity type..
	data.location_suggestions.forEach(function(item) {
		entityID=item.entity_id;
		entityType=item.entity_type;
	})
	var url="https://developers.zomato.com/api/v2.1/search";
	//Setting the search api parameters..
	var searchQ = {
	    apikey:'95adb6f09319ee2ad8f284f39dfb7d4b',
	    entity_id:entityID,
	    count:100,
	    entity_type:entityType,
	    sort: "rating"
  		}
  		//firing ajax request..
  $.getJSON(url, searchQ, showRestaurantData);
} 
/*This function leverages the HTML templete and data retrieved from the zomato 
api and modify the html templete for each of the results obtained..
It then sets the html formed into the div to be displayed on html page..*/
function showRestaurantData (data) {
	   var val="";
	   //Loop over each of the result item and modify the html template..
	   		data.restaurants.forEach(function(item) {
	   var htmlTemplate1=htmlTemplate;
		   htmlTemplate1=htmlTemplate1.replace("$$name",item.restaurant.name);
		   htmlTemplate1=htmlTemplate1.replace("$$linkname",item.restaurant.url);
		   htmlTemplate1=htmlTemplate1.replace("$$imagelink",item.restaurant.url);
		   htmlTemplate1=htmlTemplate1.replace("$$city",item.restaurant.location.city);
		   htmlTemplate1=htmlTemplate1.replace("$$address",item.restaurant.location.address);
		   htmlTemplate1=htmlTemplate1.replace("$$rating",item.restaurant.user_rating.aggregate_rating);
		   htmlTemplate1=htmlTemplate1.replace("$$vote",item.restaurant.user_rating.votes);
		   htmlTemplate1=htmlTemplate1.replace("$$cuisines",item.restaurant.cuisines);

		   val+=htmlTemplate1;
	 })
	$("#showResult").html(val);	
}

// Function executes on click of search button and 
// call getEntityDetailsBasedOnLocation function
function userSubmit() {	
	$("#locsubmit").click(function(event) {
		getEntityDetailsBasedOnLocation(getRestaurantDetailFromAPI);
	});
}

// IFFY calling userSubmit ..
$(function(){
	$("#loc").geocomplete({
         details: ".geo-details",
         detailsAttribute: "data-geo"
    });
	userSubmit();

});