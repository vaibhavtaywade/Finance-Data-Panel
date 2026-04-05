
const { roles } = require('./models');
const Joi = require('joi');

// Role-based access control middleware
function requireRole(required) {
	return (req, res, next) => {
		// For demo: role is passed in req.header('x-role')
		// In real app, use authentication and session/token
		const userRole = req.header('x-role');
		if (!userRole || (Array.isArray(required) ? !required.includes(userRole) : userRole !== required)) {
			return res.status(403).json({ error: 'Forbidden: insufficient role' });
		}
		next();
	};
}

// User input validation
const userSchema = Joi.object({
	username: Joi.string().required(),
	status: Joi.string().valid('active', 'inactive'),
	role: Joi.string().valid(...roles).required()
});

function validateUser(req, res, next) {
	const { error } = userSchema.validate(req.body);
	if (error) return res.status(400).json({ error: error.details[0].message });
	next();
}

// Financial record input validation
const recordSchema = Joi.object({
	amount: Joi.number().required(),
	type: Joi.string().valid('income', 'expense').required(),
	category: Joi.string().required(),
	date: Joi.date().required(),
	notes: Joi.string().allow(''),
	createdBy: Joi.string().required()
});

function validateRecord(req, res, next) {
	const { error } = recordSchema.validate(req.body);
	if (error) return res.status(400).json({ error: error.details[0].message });
	next();
}

module.exports = { requireRole, validateUser, validateRecord };
