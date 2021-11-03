const {
    selectCategories,
    selectReviews,
    selectReviewById,
    updateReview
}   = require('../models/models.js');

exports.getCategories = (req, res, next) => {
    selectCategories().then(categories => {
        res.send({ categories });
    })
    .catch(next)
};

exports.getReviewById = (req, res, next) => {
    const { review_id } = req.params;
    selectReviewById(review_id).then(review => {
        res.send({ review });
    })
    .catch(next)
};

exports.patchReview = (req, res, next) => {
    const { review_id } = req.params;
    const { inc_votes } = req.body;
    updateReview(review_id, inc_votes).then(review => {
        res.send({ review });
    })
    .catch(next)
};

exports.getReviews = (req, res, next) => {
    // selectReviews().then(reviews => {
    //     res.send({ reviews });
    // })
    // .catch(next)
    const { sort_by, order, category } = req.query;
  
    const validQueries = ['sort_by', 'order', 'category'];
    const queryKeys = Object.keys(req.query);
   
    if (queryKeys.every( key => validQueries.includes(key))) {
      selectReviews(sort_by, order, category).then((reviews) => {
      res.send({ reviews });
    })
    .catch(next);
    } else {
      return Promise.reject({status:'400', msg: 'Invalid query type'}).catch(next);
    }
};