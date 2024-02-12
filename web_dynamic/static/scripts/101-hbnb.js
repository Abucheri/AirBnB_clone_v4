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

  const amenityIds = {};
  const stateIds = {};
  const cityIds = {};

  // Function to load reviews for a specific place
  function loadReviews(placeId, reviewsSection) {
    $.ajax({
      type: 'GET',
      url: `http://0.0.0.0:5001/api/v1/places/${placeId}/reviews/`,
    }).done(function (data) {
      reviewsSection.empty();
      for (const review of data) {
        const reviewTemplate = `<li>
          <h3>${review.user.first_name} ${review.user.last_name} the ${review.created_at}</h3>
          <p>${review.text}</p>
        </li>`;
        reviewsSection.append(reviewTemplate);
      }
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.error(`Failed to load reviews: ${textStatus} - ${errorThrown}`);
    });
  }

  // Show/Hide Reviews
  $('.places').on('click', '.reviewSpan', function () {
    const reviewsSection = $(this).closest('.reviews').find('ul');
    if ($(this).text() === 'show') {
      // Show reviews
      const placeId = $(this).attr('data-id');
      loadReviews(placeId, reviewsSection);
      $(this).text('hide');
    } else {
      // Hide reviews
      reviewsSection.empty();
      $(this).text('show');
    }
  });

  // Function to load places and reviews
  function loadPlacesAndReviews() {
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      contentType: 'application/json',
      data: JSON.stringify({
        amenities: Object.keys(amenityIds),
        states: Object.keys(stateIds),
        cities: Object.keys(cityIds),
      }),
    }).done(function (data) {
      const placesContainer = $('.places');
      placesContainer.empty();
      for (const place of data) {
        const placeTemplate = `<article>
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
          <div class="reviews" style="margin-top: 10px;">
            <h3>Reviews <span class="reviewSpan" data-id="${place.id}">show</span></h3>
            <ul>
              <!-- Reviews for the current place will be dynamically loaded here -->
            </ul>
          </div>
        </article>`;
        const placeElement = $(placeTemplate);
        placesContainer.append(placeElement);
      }
    });
  }

  // Load places and reviews on page load
  loadPlacesAndReviews();

  // Search button click event
  $('.filters button').click(function () {
    // Call the loadPlacesAndReviews function on button click
    loadPlacesAndReviews();
  });

  // Event listener for State checkboxes
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

  // Event listener for City checkboxes
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
