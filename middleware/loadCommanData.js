const categoryModel = require('../models/categoryModel');
const newsModel = require('../models/newsModel');
const settingModel = require('../models/settingModel');
const NodeCache = require("node-cache");

const cache = new NodeCache();

const loadCommonData = async (req, res, next) => {
  try {
    let latestNews = cache.get('latestNewsCache');
    let categories = cache.get('categoriesCache');
    let settings = cache.get('settingCache');

    // Fetch settings if not cached
    if (!settings) {
      settings = await settingModel.findOne().lean();
      cache.set('settingCache', settings, 3600);
    }

    // Fetch latest news if not cached
    if (!latestNews) {
      latestNews = await newsModel.find()
        .populate('category', { 'name': 1, 'slug': 1 })
        .populate('author', 'fullname')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();
      cache.set('latestNewsCache', latestNews, 3600);
    }

    // Fetch categories if not cached
    if (!categories) {
      const categoriesInUse = await newsModel.distinct('category');
      categories = await categoryModel.find({ '_id': { $in: categoriesInUse } }).lean();
      cache.set('categoriesCache', categories, 3600);
    }

    res.locals.settings = settings;
    res.locals.latestNews = latestNews;
    res.locals.categories = categories;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = loadCommonData;
