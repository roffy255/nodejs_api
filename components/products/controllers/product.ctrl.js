// application || business logic of application

const productQuery = require("./../query/product.query");

function list(req, res, next) {
    var searchCondition = {};
    if (req.loggedInUser.role !== 1) {
        searchCondition.user = req.loggedInUser._id;
    }
    productQuery.get(searchCondition)
        .then(function (data) {
            res.status(200).json(data);
        })
        .catch(function (err) {
            next(err);
        });
}

function getById(req, res, next) {
    var searchCondition = { _id: req.params.id };
    productQuery.get(searchCondition)
        .then(function (data) {
            res.status(200).json(data[0]);
        })
        .catch(function (err) {
            next(err);
        });
}

function insert(req, res, next) {
    console.log('at ctrl ', req.body);
    console.log('at ctrl with file ', req.file);
    var obj = req.body;
    obj.user = req.loggedInUser._id;
    if (req.file) {
        obj.image = req.file.filename;
    }
    productQuery.insert(obj, function (err, done) {
        if (err) {
            return next(err);
        }
        res.status(200).json(done);
    });

}

function update(req, res, next) {
    var id = req.params.id;


    if (req.file) {
        req.body.image = req.file.filename;
    }
    productQuery.update(id, req.body)
        .then(function (data) {
            if (req.file) {
                // fs remove here
            }
            res.status(200).json(data);
        })
        .catch(function (err) {
            next(err);
        })

}
function remove(req, res, next) {
    productQuery.remove(req.params.id)
        .then(function (data) {
            res.status(200).json(data);
        })
        .catch(function (err) {
            next(err);
        })
}


module.exports = {
    get: list,
    getById: getById,
    insert: insert,
    update: update,
    remove: remove
}