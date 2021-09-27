/*********************************************************************************
* WEB422 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: _xiaoli liu_________ Student ID: __150422194________ Date: ___Sep 23,2021__________
*
*
********************************************************************************/
var restaurantData = [];
let currentRestaurant = {};
let page = 1;
const perPage = 10;
let map = null;

//avg function
function avg(grades) {
    let totalGrades = 0;
    grades.forEach(element => {
        totalGrades += element.score;
    });
    return (totalGrades / grades.length).toFixed(2);
};

const tableRows = _.template(
    `<% _.forEach(restaurants, function(restaurant) { %>
          <tr data-id = <%- restaurant._id%> >
              <td><%- restaurant.name %></td>
              <td><%- restaurant.cuisine %></td>
              <td><%- restaurant.address.building %> <%- restaurant.address.street %></td>
              <td><%- avg(restaurant.grades) %> </td>    
          </tr> 
      <% }); %>`
);
function loadRestaurantData(page, perPage) {
    $("restaurant-table tbody").empty();
    fetch(`https://web422-restaurant.herokuapp.com/api/restaurants?page=${page}&perPage=${perPage}`)
        .then(response => response.json())
        .then(data => {
            restaurantData = data;
            let table_rows = tableRows({ restaurants: data });
            $("#restaurant-table tbody").html(table_rows);
            $("#current-page").html(`${page}`);

        })
        .catch(err => console.log("unable to load restaurant data", err));
};
function getRestaurantById(id) {
    for (let i = 0; i < restaurantData.length; i++) {
        if (restaurantData[i]._id == id)
            return _.cloneDeep(restaurantData[i]);
    }
    return null;
}

$(function () {
    loadRestaurantData(page, perPage);
    $("#restaurant-table tbody").on("click", "tr", function () {
        currentRestaurant = getRestaurantById($(this).attr("data-id"));      
        console.log(currentRestaurant);
        $(".modal-title").html(`${currentRestaurant.name}`);        
        $("#restaurant-address").html(`${currentRestaurant.address.building} ${currentRestaurant.address.street}`);
        $('#restaurant-modal').modal('show');
    });
    $("#previous-page").on("click", function () {
        if (page > 1) page = page - 1;
        loadRestaurantData(page, perPage);
    });
    $("#next-page").on("click", function () {
        page = page + 1;
        loadRestaurantData(page, perPage);
    });
    $('#restaurant-modal').on('shown.bs.modal', function () {
        map = new L.Map('leaflet1', {
            center: [currentRestaurant.address.coord[1], currentRestaurant.address.coord[0]],
            zoom: 18,
            layers: [
                new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
            ]
        });
        L.marker([currentRestaurant.address.coord[1], currentRestaurant.address.coord[0]]).addTo(map);
    });
    $('#restaurant-modal').on('hidden.bs.modal', function () { map.remove();});

})


