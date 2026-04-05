
const express = require('express');
const router = express.Router();
const { User, FinancialRecord, roles } = require('./models');
const { requireRole, validateUser, validateRecord } = require('./middleware');

// User Management
router.post('/users', requireRole('admin'), validateUser, async (req, res) => {
	try {
		const user = new User(req.body);
		await user.save();
		res.status(201).json(user);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

router.get('/users', requireRole('admin'), async (req, res) => {
	const users = await User.find();
	res.json(users);
});

router.patch('/users/:id', requireRole('admin'), validateUser, async (req, res) => {
	try {
		const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
		if (!user) return res.status(404).json({ error: 'User not found' });
		res.json(user);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

router.delete('/users/:id', requireRole('admin'), async (req, res) => {
	const user = await User.findByIdAndDelete(req.params.id);
	if (!user) return res.status(404).json({ error: 'User not found' });
	res.json({ message: 'User deleted' });
});

// Financial Records CRUD
router.post('/records', requireRole(['admin', 'analyst']), validateRecord, async (req, res) => {
	try {
		const record = new FinancialRecord({ ...req.body, createdBy: req.body.createdBy });
		await record.save();
		res.status(201).json(record);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

router.get('/records', requireRole(['admin', 'analyst', 'viewer']), async (req, res) => {
	const { type, category, startDate, endDate } = req.query;
	let filter = {};
	if (type) filter.type = type;
	if (category) filter.category = category;
	if (startDate || endDate) filter.date = {};
	if (startDate) filter.date.$gte = new Date(startDate);
	if (endDate) filter.date.$lte = new Date(endDate);
	const records = await FinancialRecord.find(filter).populate('createdBy', 'username role');
	res.json(records);
});

router.patch('/records/:id', requireRole('admin'), validateRecord, async (req, res) => {
	try {
		const record = await FinancialRecord.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
		if (!record) return res.status(404).json({ error: 'Record not found' });
		res.json(record);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

router.delete('/records/:id', requireRole('admin'), async (req, res) => {
	const record = await FinancialRecord.findByIdAndDelete(req.params.id);
	if (!record) return res.status(404).json({ error: 'Record not found' });
	res.json({ message: 'Record deleted' });
});

// Dashboard Summary APIs
router.get('/dashboard/summary', requireRole(['admin', 'analyst', 'viewer']), async (req, res) => {
	const records = await FinancialRecord.find();
	const totalIncome = records.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
	const totalExpenses = records.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
	const netBalance = totalIncome - totalExpenses;
	const categoryTotals = {};
	records.forEach(r => {
		if (!categoryTotals[r.category]) categoryTotals[r.category] = 0;
		categoryTotals[r.category] += r.amount;
	});
	const recentActivity = records.sort((a, b) => b.date - a.date).slice(0, 5);
	res.json({ totalIncome, totalExpenses, netBalance, categoryTotals, recentActivity });
});

router.get('/dashboard/trends', requireRole(['admin', 'analyst', 'viewer']), async (req, res) => {
	// Monthly trend for the last 12 months
	const records = await FinancialRecord.find();
	const trends = {};
	records.forEach(r => {
		const month = r.date.getFullYear() + '-' + (r.date.getMonth() + 1);
		if (!trends[month]) trends[month] = { income: 0, expense: 0 };
		trends[month][r.type] += r.amount;
	});
	res.json(trends);
});

module.exports = router;
