'use strict';

const jsonfile = require('jsonfile');

jsonfile.readFile('./store.json', (err, data) => {
	if (err) return console.error(err);

	const partyGraph = data.reduce(byParty, {});

	const lobbistsByCompany = data
		.filter(lobbist => lobbist.client.indexOf('איגוד הבנקים') > -1)
		.map(lobbist => lobbist.name);

	const typeGraph = data
		.map(lobbist => lobbist.client.split(' - ').map(segment => segment.toLowerCase().trim()))
		.reduce((accumulator, typesArray) => [].concat(accumulator, typesArray), [])
		.filter(type => type !== 'ייצוג קבוע')
		.reduce(byType, [])
		.sort((a, b) => { return a.count > b.count ? 1 : -1 });

	console.log(partyGraph);
});

function byParty(accumulator, lobbist){
	if (!lobbist.party) return accumulator;

	const party = consolidate(lobbist.party);

	if (accumulator[party]){
		accumulator[party]++;
		return accumulator;
	}

	accumulator[party] = 1;
	return accumulator;

	function consolidate(party){
		if (party.indexOf('העבודה') > -1) party = 'העבודה';

		return party;
	}

}

function byType(accumulator, type){

	let gotType = false;

	accumulator.forEach(accumedType => {
		if (gotType) return;

		if (accumedType.name === type){
			accumedType.count++;
			gotType = true;
		}
	});

	if (!gotType){
		accumulator.push({ name: type, count: 1 });
	}

	return accumulator;
}