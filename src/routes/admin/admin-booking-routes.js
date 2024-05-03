const express = require('express');

const { verifyAdminLoginToken } = require('../../controllers/admin/admin-auth-controller');
const {
  issueFlightTicket,
  cancelFlightTicket,
  allFlightBookings,
  singleFlightBooking,
} = require('../../controllers/admin/admin-booking-controller');
const { fetchFlightBooking } = require('../../controllers/website/flight-controller');

const router = express.Router();

router.get('/flight/all-bookings', verifyAdminLoginToken, allFlightBookings);
router.get('/flight/single-booking/:id', verifyAdminLoginToken, singleFlightBooking);
router.get('/flight/ticket-details/:booking_reference', fetchFlightBooking);
router.post('/flight/issue-ticket/:booking_reference', verifyAdminLoginToken, issueFlightTicket);
router.post('/flight/cancel-ticket/:booking_reference', verifyAdminLoginToken, cancelFlightTicket);

module.exports = router;
