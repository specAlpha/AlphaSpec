module.exports = function () {

    var opers = {

        //insert

        Insert: function (collection, data, cb) {
            collection.insert(data, function (err, result) {
                cb();
            });
        },

        //select all - zwraca tablicę pasujących dokumentów
        FindById: function (collection, id, ObjectID, cb) {
            collection.find({_id: ObjectID(id)}).toArray(function (err, items) {
                cb(items)
            });
        },
        SelectAll: function (collection, cb) {
            collection.find({}).toArray(function (err, items) {
                cb(items)
            });
        },

        //select - zwraca tablicę pasujących dokumentów, z ograniczeniem

        SelectAndLimit: function (collection, restriction, cb) {
            collection.find(restriction).toArray(function (err, items) {
                cb(items)
            });
        },

        //delete - usunięcie poprzez id - uwaga na ObjectID

        DeleteById: function (ObjectID, collection, id) {
            collection.remove({_id: ObjectID(id)}, function (err, data) {

            })
        },

        // update - aktualizacja poprzez id - uwaga na ObjectID
        // uwaga: bez $set usuwa poprzedni obiekt i wstawia nowy
        // z $set - dokunuje aktualizacji tylko wybranego pola

        UpdateById: function (ObjectID, collection, data, id) {
            collection.updateOne(
                {_id: ObjectID(id)},
                {$set: data},
                function (err, r) {

                })
        },
        ShowDBs: function (db, cb) {
            db.admin().listDatabases(function (err, dbs) {

                if (err) console.log(err)
                else {
                    console.log(dbs.databases)
                    cb(dbs)

                }

            })

        },
        ShowCollections: function (db, cb) {
            db.listCollections().toArray(function (err, collInfos) {
                cb(collInfos)
            });

        }

    }

    return opers;

}