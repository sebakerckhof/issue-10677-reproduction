import blocked from 'blocked-at';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const MyCollection = new Mongo.Collection('my-collection');

const awaitPromiseSync = Meteor.wrapAsync(async (promise, cb) => {
    try {
        cb(null, await promise);
    } catch (e) {
        cb(e);
    }
});

Meteor.methods({
    'testPromiseDotAll'({ numInserts = 1000, doc = {} } = {}) {
        this.unblock(); // Make sure all methods run in separate fibers by unblocking at the top of each

        check(numInserts, Number);
        check(doc, Object);

        const makePromise = async () => {
            const insertOpPromises =
                new Array(numInserts)
                    .fill(null)
                    .map((_, index) => {
                        // .insert, .update, etc. on a Mongo.Collection.rawCollection() all return promises
                        return MyCollection.rawCollection().insert({
                            index,
                            script: 'testPromiseDotAll',
                            ...doc
                        });
                    });
            await Promise.all(insertOpPromises);
        };

        console.log('testPromiseDotAll starting');
        const timeBefore = Date.now();
        awaitPromiseSync(makePromise());
        const timeAfter = Date.now();
        console.log('testPromiseDotAll finished in', timeAfter - timeBefore);
    },
    'testPromiseDotAllNoRawCollection'({ numInserts = 1000, doc = {} } = {}) {
        this.unblock(); // Make sure all methods run in separate fibers by unblocking at the top of each

        check(numInserts, Number);
        check(doc, Object);

        const makePromise = async () => {
            const insertOpPromises =
                new Array(numInserts)
                    .fill(null)
                    .map(async (_, index) => {
                        // .insert, .update, etc. on a Mongo.Collection.rawCollection() all return promises
                        await new Promise((resolve, reject) => MyCollection.insert({
                            index,
                            script: 'testPromiseDotAll', ...doc
                        }, (e, r) => {
                            if (e) {
                                reject(e);
                            } else {
                                resolve(r);
                            }
                        }));
                    });
            await Promise.all(insertOpPromises);
        };

        console.log('testPromiseDotAllNoRawCollection starting');
        const timeBefore = Date.now();
        awaitPromiseSync(makePromise());
        const timeAfter = Date.now();
        console.log('testPromiseDotAllNoRawCollection finished in', timeAfter - timeBefore);
    },
    'testSequential'({ numInserts = 1000, doc = {} } = {}) {
        this.unblock(); // Make sure all methods run in separate fibers by unblocking at the top of each

        check(numInserts, Number);
        check(doc, Object);

        const makePromise = async () => {
            for (let index = 0; index < numInserts; index++) {
                // .insert, .update, etc. on a Mongo.Collection.rawCollection() all return promises
                await MyCollection.rawCollection().insert({ index, script: 'testSequential', ...doc });
            }
        };

        console.log('testSequential starting');
        const timeBefore = Date.now();
        awaitPromiseSync(makePromise());
        const timeAfter = Date.now();
        console.log('testSequential finished in', timeAfter - timeBefore);
    },
    'singleOp'() {
        this.unblock(); // Make sure all methods run in separate fibers by unblocking at the top of each

        console.log('singleOp starting');
        const result = MyCollection.findOne();
        console.log('singleOp finished');
        return result;
    }
});

Meteor.startup(() => {
    // Using `blocked-at` (https://github.com/naugtur/blocked-at) for a stack trace to the blocking code
    const timer = blocked((time, stack) => console.log({ time, stack }), { threshold: 1000 });

    // Print every 500ms to show when event loop is blocked/unblocked
    const interval = setInterval(() => console.log('...'), 500);
});
