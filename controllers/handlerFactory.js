const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');


exports.getAll = (Model) =>
    catchAsync(async (req, res, next) => {
        //to allow for nested GET reviews on tour
        let filter;
        if (req.params.tourId) filter = { tour: req.params.tourId };

        const features = new APIFeatures(Model.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        // const doc = await features.query.explain()
        const doc = await features.query;
        res.status(200).json({
            status: 'success',
            result: doc.length,
            data: { data: doc },
        });
    });
