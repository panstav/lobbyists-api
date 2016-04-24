'use strict';

const jsonfile = require('jsonfile');

const log = require('./common/log');
const removePermanentRep = require('./common/permanent-rep');

module.exports = server => {

	server.get('/all-names', getAllNames);

	server.get('/lobbyist/:name', getLobbyistByName);

	server.get('/company/:name', groupCompanysLobbyistsByClient);

	server.get('/client/:name', groupClientsLobbyistsByCompany);

};

function getAllNames(req, res){
	res.status(200).sendFile('all-names.json', { root: 'store' });
}

function getLobbyistByName(req, res){

	jsonfile.readFile('./store/data.json', (err, lobbyists) => {
		if (err){
			log.error(err);

			return res.status(500).end();
		}

		const name = req.params.name;

		if (!name) return res.status(400).end();

		const lobbyistArr = lobbyists.filter(lobbyist => lobbyist.name === name);

		if (!lobbyistArr.length) return res.status(404).end();

		const lobbyist = {
			company: lobbyistArr[0].company,
			number: lobbyistArr[0].number,
			clients: lobbyistArr.map(lobbyist => lobbyist.client).map(removePermanentRep)
		};

		res.status(200).json(lobbyist);
	});

}

function groupCompanysLobbyistsByClient(req, res){

	jsonfile.readFile('./store/data.json', (err, lobbyists) => {
		if (err){
			log.error(err);

			return res.status(500).end();
		}

		const companyName = req.params.name;

		if (!companyName) return res.status(400).end();

		const clientsArr = lobbyists
			.filter(lobbyist => lobbyist.company === companyName)
			.map(lobbyist => { lobbyist.client = removePermanentRep(lobbyist.client); return lobbyist; })
			.reduce(lobbyistsByClient, []);

		if (!clientsArr.length) return res.status(404).end();

		res.status(200).json(clientsArr);

		function lobbyistsByClient(accumulator, lobbyist){
			let foundClient;

			accumulator.forEach(client => {

				if (client.name === lobbyist.client){
					foundClient = true;
					client.lobbyists.push(lobbyist.name);
				}

			});

			if (!foundClient) accumulator.push({ name: lobbyist.client, lobbyists: [lobbyist.name] });

			return accumulator;
		}

	});

}

function groupClientsLobbyistsByCompany(req, res){

	jsonfile.readFile('./store/data.json', (err, lobbyists) => {
		if (err){
			log.error(err);

			return res.status(500).end();
		}

		const clientName = req.params.name;

		if (!clientName) return res.status(400).end();

		const companyArr = lobbyists
			.filter(lobbyist => lobbyist.client === clientName || lobbyist.client === clientName+removePermanentRep.string)
			.reduce(lobbyistsByCompany, []);

		if (!companyArr.length) return res.status(404).end();

		res.status(200).json(companyArr);

		function lobbyistsByCompany(accumulator, lobbyist){
			let foundCompany;

			accumulator.forEach(company => {

				if (company.name === lobbyist.company){
					foundCompany = true;
					company.lobbyists.push(lobbyist.name);
				}

			});

			if (!foundCompany) accumulator.push({ name: lobbyist.company, lobbyists: [lobbyist.name] });

			return accumulator;
		}

	});

}