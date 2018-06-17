$(document).ready(function() {
	var app = {
		// global elements
		globalElements: {
			numberPpl: document.querySelector('.people'),
			search: $('#search')[0],
			return: $('#return')[0],
			topper: $('.topper')[0],
			// gets today's date, changes format
			dateToday: function() {
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth() + 1;
				var yyyy = today.getFullYear();
				if (dd < 10) {
					dd = '0' + dd;
				}
				if (mm < 10) {
					mm = '0' + mm;
				}
				today = yyyy + '-' + mm + '-' + dd;
				return today;
			}
		},
		// all event listners
		eventListener: function() {
			app.globalElements.numberPpl.addEventListener(
				'click',
				app.peopleButtons,
				false
			);
			app.globalElements.search.addEventListener(
				'click',
				app.searchButton,
				false
			);
			app.globalElements.return.addEventListener(
				'click',
				app.returnHome,
				false
			);
		},
		// increase/deceases people
		peopleButtons: function(e) {
			var totalPpl = $('#totalPpl')[0];
			var pplToNumber = parseInt(totalPpl.innerText);
			if (e.target.id === 'plus' && totalPpl.innerText <= '5') {
				totalPpl.innerText = pplToNumber + 1;
			} else if (e.target.id === 'minus' && totalPpl.innerText >= '2') {
				totalPpl.innerText = pplToNumber - 1;
			}
		},
		searchButton: function() {
			var pickLoc = $('#pickLocation')[0].value;
			var pickDate = $('#pickDate')[0].value;
			var dropDate = $('#dropDate')[0].value;
			var totalPpl = $('#totalPpl')[0].innerText;
			var today = app.globalElements.dateToday();
			$('[data-toggle="tooltip"]').tooltip('hide');
			// val pick location, show tooltips
			// pickup location
			if (pickLoc === 'Choose...') {
				$('#pickLocation').tooltip('show');
				// pickup date
			} else if (pickDate === '') {
				$('#pickDate').tooltip('show');
			} else if (app.compareDates(today, pickDate) <= -1) {
				$('#pickDate')[0].title = 'The past is unavailable';
				$('#pickDate').tooltip('show');
				// drop off date
			} else if (
				dropDate === '' ||
				app.compareDates(pickDate, dropDate) <= -1
			) {
				$('#dropDate').tooltip('show');
				// if all are selected
			} else if (app.compareDates(pickDate, dropDate) > 10) {
				$('#dropDate')[0].title = 'Max of ten days';
				$('#dropDate').tooltip('show');
			} else {
				$('[data-toggle="tooltip"]').tooltip('hide');
				app.getResults();
			}
		},

		// compares dates, to find total number
		compareDates: function(startDate, endDate) {
			var date1 = new Date(startDate);
			var date2 = new Date(endDate);
			var timeDiff = date2.getTime() - date1.getTime();
			var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
			return diffDays;
		},

		// creates results
		getResults: function() {
			// inputs
			var pickLoc = $('#pickLocation')[0].value;
			var dropLoc = $('#dropLocation')[0].value;
			var pickDate = $('#pickDate')[0].value;
			var dropDate = $('#dropDate')[0].value;
			var totalPpl = $('#totalPpl')[0].innerText;
			// days
			var diffDays = app.compareDates(pickDate, dropDate);

			// results
			for (var i = 0; i < data.length; i++) {
				var dataType = data[i].type;

				// people
				if (
					data[i].mixSeat <= totalPpl &&
					data[i].maxSeat >= totalPpl &&
					data[i].minDay <= diffDays &&
					data[i].maxDay >= diffDays
				) {
					var newVehicle = '<div class="section result">';
					newVehicle +=
						'<button class="btn btn-outline-secondary greeenButton floatRight" >Book</button>';
					newVehicle += '<h3 class="title">' + dataType + '</h3>';
					newVehicle +=
						'<p class="stats">Manual<br />Special Licence Required<br />' +
						data[i].fuelKm +
						' / 100km</p>';
					newVehicle += '<div class="statPeople">';
					newVehicle +=
						'<h5 class="numberPpl">' +
						data[i].mixSeat +
						'-' +
						data[i].maxSeat +
						'</h5>';
					newVehicle += '<i class="fas fa-user"></i>';
					newVehicle += '</div>';
					newVehicle += '</div>';
					app.globalElements.topper.insertAdjacentHTML('afterend', newVehicle);
				}
			}
			// change to the other page
			$('.home').addClass('displayNone');
			$('.results').removeClass('displayNone');

			app.mapLocation();
		},

		// creates map
		mapLocation: function() {
			// get locations from inputs
			var pickLoc = $('#pickLocation')[0].value;
			var dropLoc = $('#dropLocation')[0].value;
			if (dropLoc === '0') {
				dropLoc = pickLoc;
			}
			// gets coordinates from data.js
			var start = geojson[pickLoc].coordinates;
			var end = geojson[dropLoc].coordinates;

			// creates map
			mapboxgl.accessToken =
				'pk.eyJ1IjoiY2F0aGV5MTkxIiwiYSI6ImNqaTNtb2o1ODAwNjgzcHF0ZWQxdmVtcTcifQ.BaXfgHPABUk6-kMMyyMNXQ';
			const map = new mapboxgl.Map({
				container: 'map', // container id
				style: 'mapbox://styles/mapbox/streets-v10',
				center: [174.78, -41.279],
				zoom: 3 // starting zoom
			});

			// adds route
			map.on('load', function() {
				var directionsRequest =
					'https://api.mapbox.com/directions/v5/mapbox/driving/' +
					start[0] +
					',' +
					start[1] +
					';' +
					end[0] +
					',' +
					end[1] +
					'?geometries=geojson&access_token=' +
					mapboxgl.accessToken;
				$.ajax({
					method: 'GET',
					url: directionsRequest
				}).done(function(data) {
					// console.dir(data.routes[0].distance / 1000 + 'kms');
					var route = data.routes[0].geometry;
					map.addLayer({
						id: 'route',
						type: 'line',
						source: {
							type: 'geojson',
							data: {
								type: 'Feature',
								geometry: route
							}
						},
						paint: {
							'line-width': 5
						}
					});
					map.addLayer({
						id: 'start',
						type: 'circle',
						source: {
							type: 'geojson',
							data: {
								type: 'Feature',
								geometry: {
									type: 'Point',
									coordinates: start
								}
							}
						}
					});
					map.addLayer({
						id: 'end',
						type: 'circle',
						source: {
							type: 'geojson',
							data: {
								type: 'Feature',
								geometry: {
									type: 'Point',
									coordinates: end
								}
							}
						}
					});
				});
			});
		},

		// return to search page
		returnHome: function() {
			$('.result').remove();
			$('.results').addClass('displayNone');
			$('.home').removeClass('displayNone');
		}
	};

	// runs all event listners
	app.eventListener();
});
