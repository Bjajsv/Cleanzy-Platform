const Product = require('../models/Product');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllProducts = catchAsync(async (req, res) => {
    const { page = 1, limit = 10, category, sort, search } = req.query;
    const query = {};

    // Apply filters
    if (category) query.category = category;
    if (search) query.$text = { $search: search };

    // Build sort object
    let sortObj = {};
    if (sort) {
        const [field, order] = sort.split(':');
        sortObj[field] = order === 'desc' ? -1 : 1;
    }

    const products = await Product.find(query)
        .sort(sortObj)
        .limit(limit * 1)
        .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.status(200).json({
        status: 'success',
        data: {
            products,
            total,
            pages: Math.ceil(total / limit),
            currentPage: page
        }
    });
});

exports.getProduct = catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate('reviews.user', 'firstName lastName');

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    res.status(200).json({
        status: 'success',
        data: product
    });
});

exports.createProduct = catchAsync(async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).json({
        status: 'success',
        data: product
    });
});

exports.updateProduct = catchAsync(async (req, res) => {
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    res.status(200).json({
        status: 'success',
        data: product
    });
});

exports.deleteProduct = catchAsync(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.addReview = catchAsync(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    const review = {
        user: req.user._id,
        rating,
        comment
    };

    product.reviews.push(review);

    // Update average rating
    const totalRating = product.reviews.reduce((acc, item) => acc + item.rating, 0);
    product.rating.average = totalRating / product.reviews.length;
    product.rating.count = product.reviews.length;

    await product.save();

    res.status(201).json({
        status: 'success',
        data: product
    });
}); 