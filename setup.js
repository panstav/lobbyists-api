const jsonfile = require('jsonfile');

const GoogleSpreadsheet = require('google-spreadsheet');
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);

const log = require('./common/log');
const removePermanentRep = require('./common/permanent-rep');

if (process.env.NODE_ENV !== 'production') jsonfile.spaces = 4;

module.exports = () => {

	return fetchData()
		.then(projectAndSort)
		.then(saveNames)
		.then(saveData)
		.catch(log.error);

};

function fetchData(){

	log.info('Fetching data from spreadsheets');

	return new Promise((resolve, reject) => {

		doc.getInfo((err, data) => {
			if (err) return reject(err);

			resolve(data.worksheets.filter(worksheet => worksheet.title === 'archive')[0]);
		});

	});
}

function projectAndSort(worksheet){
	return new Promise((resolve, reject) => {

		worksheet.getRows({}, (err, rows) => {
			if (err) return reject(err);

			resolve(rows.map(projection).sort(alphabet))
		});

	});

	function projection(lobbyist){

		return {
			id: lobbyist.id.trim(),
			name: lobbyist.name.trim(),
			company: lobbyist.company.trim() || '',
			client: lobbyist.client.trim(),
			number: lobbyist.number.trim(),
			party: lobbyist.party === 'לא' ? '' : lobbyist.party.trim()
		}

	}

	function alphabet(a, b){
		return a.name < b.name ? -1 : 1;
	}

}

function saveNames(lobbyists){
	return new Promise((resolve, reject) => {

		const names = {
			lobbyist: lobbyists.map(lobbyist => lobbyist.name)
				.reduce(uniqueStr, []),

			company: lobbyists.map(lobbyist => lobbyist.company)
				.reduce(uniqueStr, []),

			client: lobbyists.map(lobbyist => lobbyist.client)
				.reduce(uniqueStr, []).map(removePermanentRep)
		};

		jsonfile.writeFile('./store/all-names.json', names, err => {
			if (err) return reject(err);

			resolve(lobbyists);
		});

	});

	function uniqueStr(accumulator, name){
		if (accumulator.indexOf(name) === -1) accumulator.push(name);

		return accumulator;
	}

}

function saveData(data){

	log.info('Saving sorted data to json files');

	return new Promise((resolve, reject) => {

		jsonfile.writeFile('./store/data.json', data, err => {
			if (err) return reject(err);

			resolve(data);
		});

	});
}