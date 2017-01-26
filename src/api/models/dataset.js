import chunk from 'lodash/chunk';

export default (db) => {
    const collection = db.collection('dataset');
    collection.insertBatch = documents => chunk(documents, 100).map(data => collection.insertMany(data));
    collection.getExcerpt = () => collection.find().limit(5).toArray();
    collection.findLimitFromSkip = (limit, skip) => collection.find().skip(skip).limit(limit).toArray();

    return collection;
};