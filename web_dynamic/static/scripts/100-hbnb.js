/* global $ */

window.addEventListener('load', function () {
  // API status checker
  $.ajax('http://0.0.0.0:5001/api/v1/status').done(function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  // amenities
  const amenityIds = {};
  $('.amenities input[type=checkbox]').click(function () {
    if ($(this).prop('checked')) {
      amenityIds[$(this).attr('data-id')] = $(this).attr('data-name');
    } else if (!$(this).prop('checked')) {
      delete amenityIds[$(this).attr('data-id')];
    }
    if (Object.keys(amenityIds).length === 0) {
      $('div.amenities h4').html('&nbsp;');
    } else {
      $('div.amenities h4').text(Object.values(amenityIds).join(', '));
    }
  });

  // states & cities
  const stateIds = {};
  const cityIds = {};

  // Function to load places
  function loadPlaces() {
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      contentType: 'application/json',
      data: JSON.stringify({
        amenities: Object.keys(amenityIds),
        states: Object.keys(stateIds),
        cities: Object.keys(cityIds)
      })
    }).done(function (data) {
      $('section.places').empty();
      for (const place of data) {
        const template = `<article>
        <div class="title_box">
        <h2>${place.name}</h2>
        <div class="price_by_night">
      $${place.price_by_night}
      </div>
        </div>
        <div class="information">
        <div class="max_guest">
        <br />
      ${place.max_guest} Guests
      </div>
        <div class="number_rooms">
        <br />
      ${place.number_rooms} Bedrooms
      </div>
        <div class="number_bathrooms">
        <br />
      ${place.number_bathrooms} Bathroom
      </div>
        </div>
        <div class="description">
      ${place.description}
      </div>
      </article> <!-- End 1 PLACE Article -->`;
        $('section.places').append(template);
      }
    });
  }

  // Load places on page load
  loadPlaces();

  // Search button click event
  $('.filters button').click(function () {
    // Call the loadPlaces function on button click
    loadPlaces();
  });

  $('.stateCheckBox').click(function () {
    if ($(this).prop('checked')) {
      stateIds[$(this).attr('data-id')] = $(this).attr('data-name');
    } else if (!$(this).prop('checked')) {
      delete stateIds[$(this).attr('data-id')];
    }
    if (Object.keys(stateIds).length === 0 && Object.keys(cityIds).length === 0) {
      $('.locations h4').html('&nbsp;');
    } else {
      $('.locations h4').text(Object.values(stateIds).concat(Object.values(cityIds)).join(', '));
    }
  });

  $('.cityCheckBox').click(function () {
    if ($(this).prop('checked')) {
      cityIds[$(this).attr('data-id')] = $(this).attr('data-name');
    } else if (!$(this).prop('checked')) {
      delete cityIds[$(this).attr('data-id')];
    }
    if (Object.keys(stateIds).length === 0 && Object.keys(cityIds).length === 0) {
      $('.locations h4').html('&nbsp;');
    } else {
      $('.locations h4').text(Object.values(cityIds).concat(Object.values(stateIds)).join(', '));
    }
  });
});
