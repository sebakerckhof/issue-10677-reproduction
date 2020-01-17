import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const MyCollection = new Mongo.Collection('my-collection');

async function test({ numInserts = 10000, doc = {} } = {}) {
    check(numInserts, Number);
    check(doc, Object);

    const makePromise = async () => {
        const insertOpPromises =
            new Array(numInserts)
                .fill(null)
                .map(async (_, index) => {
                    return MyCollection.rawCollection().insert({
                        index,
                        script: 'testPromiseDotAll',
                        ...doc
                    });

                });
        const results = await Promise.all(insertOpPromises);
        return results;
    };

    console.log('test starting');
    const hrstart = process.hrtime();
    const results = await makePromise();
    const hrend = process.hrtime(hrstart);
    console.log(results);
    console.info('test finished - Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
}

Meteor.methods({
    test,
})

Meteor.startup(() => {
    // Print every 100ms to show when event loop is blocked/unblocked
    const interval = setInterval(() => console.log('...'), 100);
    // test();
});
