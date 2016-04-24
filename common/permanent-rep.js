const permRepStr = ' - ייצוג קבוע';

module.exports = clientName => {
	const repLoc = clientName.indexOf(permRepStr);

	return repLoc === -1 ? clientName : clientName.slice(0, repLoc);
};

module.exports.string = permRepStr;