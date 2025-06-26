const Staff = require('../models/Staff');
//common api handler
const factory = require('./handlerFactory');


//filter staff  by name,department,role,date,shift
exports.getAllStaffs = factory.getAll(Staff);