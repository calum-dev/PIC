var input = document.getElementById('input');
var inputMessage = document.getElementById('inputMessage');
var year;
var name;

input.addEventListener('change', () => {
	if (input.files.length <= 0) { 
		inputMessage.innerHTML = 'Choose file';
		return; 
	}
	inputMessage.innerHTML = `Processing ${input.files[0].name}`;
	var reader = new FileReader();
	reader.onload = () => {
		var data = readCSV(reader.result);
		console.log(data);
		var json = convert(data);
		console.log(json);
	};
	reader.readAsText(input.files[0]);
});

function readCSV(raw) {
	var rows = raw.split('\r\n');
	var data = [];
	for (let i = 0; i < rows.length; i++) {
		var insideQuote = false;
		var escapeQuote = false;
		var prevC = '';
		var row = [];
		var value = [];
		rows[i].split('').forEach(function (c) {
			if (c === '"') {
				if (prevC === '"') {
					escapeQuote = !escapeQuote;
					if (escapeQuote) {
						value.push(c);
					} 
				} else {
					insideQuote = !insideQuote;
				}
			} else {
				if (escapeQuote) {
					insideQuote = true;
					escapeQuote = false;
				}
				if (c === ',' && !insideQuote) {
					row.push(value.join(''));
					value = [];
				} else {
					value.push(c);
				}
			}
			prevC = c;
		});
		row.push(value.join(''));
		if (row.join().length > 0) {
			data.push(row);
		}
	}
	return data;
}

function convert(data) {
	var json = {
		ids: [],
		groups: []
	};
	for (let i = 1; i < data.length; i++) {
		json.ids.push(data[i][0]);
		if (data[i][1] != '') {
			var w = [];
			for (let j = 5; j < data[i].length; j++) {
				w.push(data[i][j]);
			}
			json.groups.push({
				id: data[i][0],
				name: data[i][1],
				description: data[i][3],
				children: [],
				weights: w,
				period: data[i][4]
			});
		} else {
			var w = [];
			for (let j = 5; j < data[i].length; j++) {
				w.push(data[i][j]);
			}
			json.groups[json.groups.length - 1].children.push({
				id: data[i][0],
				name: data[i][2],
				description: data[i][3],
				children: [],
				weights: w,
				period: data[i][4]
			});
		}
	}
	return json;
}