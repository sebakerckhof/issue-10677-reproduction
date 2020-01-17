const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://localhost:3001/meteor';
const doc = { a: 'b', foo: 'bar' };
const numInserts = 10000;


setInterval(() => {
  console.log('...');
}, 100);

 (async () => {
   try {
    const client = await MongoClient.connect(url);
    const db = client.db();
    const collection = db.collection('foo');

    const makePromise = async () => {
      const insertOpPromises =
          new Array(numInserts)
              .fill(null)
              .map(async (_, index) => {
                  await new Promise(resolve => setTimeout(resolve, 0));
                  // .insert, .update, etc. on a Mongo.Collection.rawCollection() all return promises
                  return collection.insert({
                      index,
                      script: 'testPromiseDotAll',
                      ...doc
                  });
    
              });
      const results = await Promise.all(insertOpPromises);
      return results;
    };

    console.log('start');
    const hrstart = process.hrtime()
    const results = await makePromise();
    console.log('end', results);
    const hrend = process.hrtime(hrstart);
    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
    client.close();
   } catch (error) {
     console.log(error);
   }

 })()

