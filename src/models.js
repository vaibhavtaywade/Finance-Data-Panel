
const mongoose = require('mongoose');

const roles = ['viewer', 'analyst', 'admin'];

const UserSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	status: { type: String, enum: ['active', 'inactive'], default: 'active' },
	role: { type: String, enum: roles, required: true }
});

const FinancialRecordSchema = new mongoose.Schema({
	amount: { type: Number, required: true },
	type: { type: String, enum: ['income', 'expense'], required: true },
	category: { type: String, required: true },
	date: { type: Date, required: true },
	notes: { type: String },
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const User = mongoose.model('User', UserSchema);
const FinancialRecord = mongoose.model('FinancialRecord', FinancialRecordSchema);

module.exports = { User, FinancialRecord, roles };
