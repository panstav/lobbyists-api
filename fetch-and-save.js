const jsonfile = require('jsonfile');

const GoogleSpreadsheet = require('google-spreadsheet');
const doc = new GoogleSpreadsheet('1ku_Fcs0OjpTKZt_prfh9iW7bpH1m-9MCfNHXjdx6OL8');

doc.getInfo((err, data) => {
	if (err) return console.error(err);

	read(data.worksheets.filter(worksheet => worksheet.title === 'archive')[0]);
});

function read(worksheet){

	worksheet.getRows({}, (err, data) => {
		if (err) return console.error(err);
		
		save(data.map(projection).sort(alphabet));

		function projection(lobbist){

			return {
				id: lobbist.id.trim(),
				name: lobbist.name.trim(),
				company: lobbist.company.trim() || '',
				client: lobbist.client.trim(),
				number: lobbist.number.trim(),
				party: lobbist.party === 'לא' ? '' : lobbist.party.trim()
			}

		}

		function alphabet(a, b){
			return a.name < b.name ? -1 : 1;
		}

	});

}

function save(data){
	jsonfile.spaces = 4;
	jsonfile.writeFile('./store.json', data, err => console.error(err || 'Done.'));
}