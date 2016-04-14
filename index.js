const got = require('got');
const cheerio = require('cheerio');
const FormData = require('form-data');

const mainHref = 'http://www.knesset.gov.il/lobbyist/heb/lobbyist.aspx';

got(mainHref)
	.then(getLobbistNames, console.error)
	.then(sendForm);

function getLobbistNames(res){

	console.log(`Got ${res.statusCode}`);
	
	const $ = cheerio.load(res.body);
	
	console.log('1');

	const data = {};
	data.target = $('.link4')[0].attribs.href.replace('javascript:__doPostBack(\'', '').replace('\',\'\')', '');
	data.argument = '';
	data.state = $('input[name="__VIEWSTATE"]')[0].attribs.value;
	data.validation = $('input[name="__EVENTVALIDATION"]')[0].attribs.value;

	console.log('2');

	const form = new FormData();
	
	form.append('__EVENTTARGET', data.target);
	form.append('__EVENTARGUMENT', data.argument);
	form.append('__VIEWSTATE', data.state);
	form.append('__EVENTVALIDATION', data.validation);

	return Promise.resolve(form);
}

function sendForm(form){

	console.log('3');

	console.log(form.getHeaders());
	console.log(form);

	got.post(mainHref, { headers: form.getHeaders(), body: form })
		.then(parseResult, console.error);
	
	function parseResult(res){

		console.log(`Got ${res.statusCode}`);
		
	}
	
}