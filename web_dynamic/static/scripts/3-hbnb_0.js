/* global $ */

document.addEventListener('DOMContentLoaded', function () {
  const amenitiesChecked = {};

  $('input[type="checkbox"]').change(function () {
    const amenityId = $(this).attr('data-id');
    const amenityName = $(this).attr('data-name');

    if (this.checked) {
      amenitiesChecked[amenityId] = amenityName;
    } else {
      delete amenitiesChecked[amenityId];
    }

    const amenitiesList = Object.values(amenitiesChecked).join(', ');
    $('div.amenities > h4').text(amenitiesList);
  });

  const apiUrl = 'http://0.0.0.0:5001/api/v1/status/';
  const apiStatusDiv = $('#api_status');

  $.get(apiUrl, function (data) {
    if (data.status === 'OK') {
      apiStatusDiv.addClass('available');
    } else {
      apiStatusDiv.removeClass('available');
    }
  });

  const placesSearchApiUrl = 'http://0.0.0.0:5001/api/v1/places_search/';
  const placesContainer = $('section.places');

  // Send a POST request with an empty dictionary
  $.ajax({
    type: 'POST',
    url: placesSearchApiUrl,
    contentType: 'application/json;charset=UTF-8',
    data: JSON.stringify({}),
    success: function (places) {
      console.log('Received places:', places);
      // Loop through the places and create corresponding HTML elements
      places.forEach(function (place) {
        console.log('Processing place:', place);
        const article = $('<article></article>');
        article.append('<div class="title_box"><h2>' + place.name + '</h2><div class="price_by_night">$' + place.price_by_night + '</div></div>');
        console.log('max_guest:', place.max_guest);
        article.append('<div class="information"><div class="max_guest">' + place.max_guest + ' Guest' + (place.max_guest !== 1 ? 's' : '') + '</div>');
        console.log('number_rooms:', place.number_rooms);
        article.append('<div class="number_rooms">' + place.number_rooms + ' Bedroom' + (place.number_rooms !== 1 ? 's' : '') + '</div>');
        console.log('number_bathrooms:', place.number_bathrooms);
        article.append('<div class="number_bathrooms">' + place.number_bathrooms + ' Bathroom' + (place.number_bathrooms !== 1 ? 's' : '') + '</div></div>');
        console.log('description:', place.description);
        article.append('<div class="description">' + place.description + '</div>');
        placesContainer.append(article);
      });
    },
    error: function (error) {
      console.error('Error fetching places:', error);
    }
  });
});
