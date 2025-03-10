const express = require('express');
const router = express.Router();
const { getLicenseExpiryPage, getLicenseExpiryData,updateLicenseByCustomerName } = require('../../controllers/licenseExpirypage/index'); // ✅ Import Both Functions

// ✅ Render License Expiry Page
router.get('/license-expiry', getLicenseExpiryPage);

// ✅ API to Fetch License Expiry Data
router.get('/license-api', getLicenseExpiryData);

// ✅ API to Update License Expiry Data
router.put("/license-update", updateLicenseByCustomerName);

module.exports = router;



