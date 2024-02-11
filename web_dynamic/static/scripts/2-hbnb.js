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
});
