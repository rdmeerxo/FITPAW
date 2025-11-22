export function validateFoodBarcode(req, res, next) {
	const { barcode } = req.params;
	if (!barcode || !/^[0-9]{6,14}$/.test(barcode)) {
		return res.status(400).json({
			error: { message: 'Invalid barcode. Expect digits length 6-14.' },
		});
	}
	next();
}
