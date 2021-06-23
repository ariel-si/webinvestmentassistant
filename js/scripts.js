function buildChart(arrayDate, arrayOpen, arrayHigh, arrayLow, arrayClose) {
	let arrayDatasets 	= [];
	let arrayTmp 		= {};
	let arrayTempOpen 	= {};
	let arrayTempHigh 	= {};
	let arrayTempLow 	= {};
	let arrayTempClose 	= {};

	let arrayRed 	= [];
	let arrayGreen 	= [];
	let arrayYellow = [];
	let arrayBlue 	= [];

	$.each( arrayDate, function( key, value ) {
		arrayRed.push("rgba(255, 105, 97, 1)");
		arrayGreen.push("rgba(193, 225, 193, 1)");
		arrayYellow.push("rgba(253, 253, 150, 1)");
		arrayBlue.push("rgba(128, 206, 225, 1)");
	});

	arrayTempOpen = {
		label: 'Open',
		backgroundColor: arrayGreen,
		borderColor: [],
		borderWidth: 1,
		data: arrayOpen
	};

	arrayTempHigh = {
		label: 'High',
		backgroundColor: arrayBlue,
		borderColor: [],
		borderWidth: 1,
		data: arrayHigh
	};

	arrayTempLow = {
		label: 'Low',
		backgroundColor: arrayYellow,
		borderColor: [],
		borderWidth: 1,
		data: arrayLow
	};

	arrayTempClose = {
		label: 'Close',
		backgroundColor: arrayRed,
		borderColor: [],
		borderWidth: 1,
		data: arrayClose
	};

	arrayDatasets.push(arrayTempOpen);
	arrayDatasets.push(arrayTempHigh);
	arrayDatasets.push(arrayTempLow);
	arrayDatasets.push(arrayTempClose);

	let barChartData = {
		labels: arrayDate,
		datasets: arrayDatasets
	};

	var grafico;
	let ctx = document.getElementById('chart').getContext('2d');

	grafico = new Chart(ctx, {
		type: 'bar',
		data: barChartData,
		options: {
			responsive: true,
			aspectRatio: 2.8,
			legend: {
				position: 'top',
				display: false,
			},
			title: {
				display: false
			},
			scales: {
				xAxes: [{
					gridLines: {
						display: true
					}
				}],
				yAxes: [{
					gridLines: {
						display: true
					}
				}]
			},
			tooltips: {
				enabled: true
			},
			onResize: function(chart, size) {
			},
		}
	});
	grafico.update();
}

function parseJson(json) {
	let timeSeries = json["Time Series FX (Daily)"];
	let date, open, high, low, close, counter = 1;
	let arrayDate = [], arrayOpen = [], arrayHigh = [], arrayLow = [], arrayClose = [];
	$.each( timeSeries, function( key, value ) {
		date 	= key;
		open 	= value["1. open"]
		high 	= value["2. high"];
		low 	= value["3. low"];
		close 	= value["4. close"];

		arrayDate.push(date);
		arrayOpen.push(open);
		arrayHigh.push(high);
		arrayLow.push(low);
		arrayClose.push(close);

		if (counter >= $("#qtd_days").val())
			return false;
		
		counter++;
	});
	buildChart(arrayDate, arrayOpen, arrayHigh, arrayLow, arrayClose)
}

function getUrl(from_symbol, to_symbol) {
	let apikey 		= "QV3TGGJWZJB8R3AN"; //demo
	let url 		= "https://www.alphavantage.co/query?function=FX_DAILY&from_symbol="+from_symbol+"&to_symbol="+to_symbol+"&apikey="+apikey;

	let json = (function () {
		let json = null;
		$.ajax({
			'async': false,
			'global': false,
			'url': url,
			'dataType': "json",
			'success': function (data) {
				json = data;
			}
		});
		parseJson(json);
	})();
}
$(document).ready(function(){
	//getUrl("EUR", "USD");
});

$(document).on("submit", "#formCanvas", function(e){
	e.preventDefault();
	$("canvas#chart").remove();
	$('<canvas id="chart" style="max-height: 600px;" class="my-4"></canvas>').insertAfter("#startCanvas");
	let btnName = $(".btn-submit").html();
	$(".btn-submit").prop("disabled", true).html("<i class='fas fa-spinner fa-spin'></i> Buscando");
	getUrl($("#from_symbol").val(), $("#to_symbol").val());
	$(".btn-submit").prop("disabled", false).html(btnName);
});
