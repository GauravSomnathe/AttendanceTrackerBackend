const router = require('express').Router();
const auth = require('../middleware/auth');
const { markAttendance, getMyAttendance, getAllAttendance, punchOut ,getLateEmployees } = require('../controllers/attendanceController');

router.post('/mark', auth, markAttendance);
router.put('/:id/punchout', auth, punchOut);
router.get('/me', auth, getMyAttendance);

router.get('/all', auth, getAllAttendance); // admin
router.get('/lateEmployees', auth, getLateEmployees); // admin

module.exports = router;
