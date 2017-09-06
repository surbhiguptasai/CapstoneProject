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
var htmlTemplate=(' <div class="cardContent col-xs-12 marginleft">'+
'<div class="row" >'+


	'<div class="col-xs-5">'+
		'<a href="$$imagelink" target="_blank">'+
		 '<img src="$$thumb" class="feat-img" >'+
		'</a>'+
	'</div>'+


	'<div>'+
		'<div class="col-xs-6 namer">'+
			'<div class="row">'+
				'<a class="restaurant-name  " href="$$linkname" target="_blank">$$name</a>'+
			'</div>'+
		'<div class="row">'+
			'<a class="zblack fontsize5" title="Restaurants in Woodbridge" ><b>$$city</b></a></div>'+
		'<div class="row fontsize5">$$address</div></div>'+





		'<div class="reviews col-xs-2 fontsize5">'+
		'<div><span style="background-color:#cb202d;color:white;padding:4px;">$$rating</span></div>'+
		'<div >Votes $$vote</div>'+

		'<!--  <div><a>10 reviews</a></div> -->'+
		'</div>'+
		'</div>'+
		'</div>'+





		'<div class="divider row"></div>'+
	'<div class="row">'+
		'<div><span class="fontsize5  zblack col-xs-4" ><b>Cuisines: </b></span><span class="col-xs-6 fontsize5 ">$$cuisines</span></div>'+
		'</div>'+
			'<div class="row">'+
            '<div>'+
      			'<span class="fontsize5  zblack col-xs-4" ><b>Avg. Cost for Two:</b></span>'+
				'<span class="col-xs-6 left fontsize5"> '+
				''+
				'$$currency $$average_cost_for_two</span>'+
				'<span class="col-xs-2"></span></div></div>'+
				'<!--   <div class="row">                      '+
				'<div >'+
					'<span class="fontsize5  grey-text col-xs-3">Hours:</span>'+
						'<span class="col-xs-7 left">'+
						'(Sun),Lunch, Dinner (Mon-Sat)'+
						'</span>'+
						'</div>'+
		'</div> -->	</div> '+
        '');
/*Validation for city */
function validateInput(city)
{
	var regexp1=new RegExp("^[a-zA-Z\\u0080-\\u024F.]+((?:[ -.|'])[a-zA-Z\\u0080-\\u024F]+)*$");
	var validate=false;
	if(regexp1.test($.trim(city)))
		{
			validate=true;
		}
		return validate;
}

/*This function is responsible for retriving the entity details based 
on the location entered in the location textbox..*/
function getEntityDetailsBasedOnLocation(city,callback) {
	var url="https://developers.zomato.com/api/v2.1/locations";
		//Setting the search api parameters.. 
    var searchQ = {
		    apikey:'95adb6f09319ee2ad8f284f39dfb7d4b',
		    query: city
       		}
       		//firing ajax request..
    $.getJSON(url, searchQ, callback);
}
/*This function is responsible for retriving the restaurant details 
from zomato api..*/
function getRestaurantDetailFromAPI (data) {
	var entityID="";
	var entityType="";
	//retrieving the entity id and entity type..

	entityID=data.location_suggestions[0].entity_id;
	entityType=data.location_suggestions[0].entity_type;
	
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
/*This function leverages the HTML templete and data retrieved from the 
zomato api and modify the html templete for each of the results obtained..
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
           htmlTemplate1=htmlTemplate1.replace("$$currency",item.restaurant.currency);
           htmlTemplate1=htmlTemplate1.replace("$$average_cost_for_two",item.restaurant.average_cost_for_two);
           //htmlTemplate1=htmlTemplate1.replace("$$textcolor",red);
           /*Setting the default image in case there is no image returned 
           from API for this restaurant..*/
           if (item.restaurant.thumb===""){
           	item.restaurant.thumb="pics/thumbImage.png";
           }
           htmlTemplate1=htmlTemplate1.replace("$$thumb",item.restaurant.thumb);
		   val+=htmlTemplate1;
	})
	$("#showResult").html(val);	
}

// Function executes on click of search button and 
// call getEntityDetailsBasedOnLocation function
function userSubmit() {	
	$("#locsubmit").on('click',function(event) {
        triggerEvent();
	});

	$(document).ajaxStart(function(){
        $("#wait").css("display", "block");
    });
    $(document).ajaxComplete(function(){
        $("#wait").css("display", "none");
    });
}
/*Function will execute triggerEvent on city if it gets the correct format of city
it will show the list otherwise it will show errormessage.*/
function triggerEvent()
{
        var city=$("#loc").val();
	    city=city.substring(0,city.indexOf(',') === -1 ? city.length : city.indexOf(','));
		if(validateInput(city))
         {
		  getEntityDetailsBasedOnLocation(city,getRestaurantDetailFromAPI);
         }
        else
         {
         	$("#showResult").html("<p style='color:red;font-size: 20px;text-align:center;padding:20px 0'>Please enter valid City e.g. Edison, NJ<p> ");
         }
}
function loadDefaultPage()
{
        var city="New York";
	    city=city.substring(0,city.indexOf(',') === -1 ? city.length : city.indexOf(','));
		
		  getEntityDetailsBasedOnLocation(city,getRestaurantDetailFromAPI);
        
}
// IFFY calling userSubmit ..
$(function(){
	$("#loc").geocomplete({
         details: ".geo-details",
         detailsAttribute: "data-geo"
    }).bind("geocode:result", function(event, result){ 
    //Attaching Trigger Event as User selects location, 
    //it will fire Ajax call using triggerEvent method.
    triggerEvent();
  });
	userSubmit();
	loadDefaultPage();
});