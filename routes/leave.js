const router = require('express').Router();
const auth = require('../middleware/auth');
const { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus } = require('../controllers/leaveController');

// Employee applies leave
router.post('/apply', auth, applyLeave);

// Employee views their own leaves
router.get('/me', auth, getMyLeaves);

// Admin views all leaves
router.get('/all', auth, getAllLeaves);

// Admin approves/rejects leave
router.put('/:id', auth, updateLeaveStatus);

module.exports = router;
