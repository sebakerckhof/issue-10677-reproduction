import React from 'react';

class App extends React.Component {
    state = {
        sequentialButtonLoading: false,
        promiseDotAllButtonLoading: false,
        singleOpButtonLoading: false,
    };

    render() {
        return (
            <div>
                <h1>Reproduction</h1>
                <ol>
                    <li>
                        <span>
                            With the server logs open, press this button (or call the method from dev-tools console):
                        </span>
                        <button
                            onClick={this.handleClickTestSequential}
                            disabled={this.state.sequentialButtonLoading}
                        >
                            {`Meteor.call('testSequential', { numInserts: 5000, doc: { a: 'b', foo: 'bar' } });`}
                        </button>
                        <span>
                            Notice that the server is logging "..." at a 500ms interval, and it continues to run
                            as normal while these inserts are happening sequentially. Pressing the "Single Op"
                            button (below) works fine (executes a single .findOne() query)
                        </span>
                    </li>
                    <li>
                        <span>
                            Now, still watching the "..." logs every 500ms, press this button (or call the method from
                            dev-tools console):
                        </span>
                        <button
                            onClick={this.handleClickTestPromiseDotAll}
                            disabled={this.state.promiseDotAllButtonLoading}
                        >
                            {`Meteor.call('testPromiseDotAll', { numInserts: 5000, doc: { a: 'b', foo: 'bar' } });`}
                        </button>
                        <span>
                            The "..." logs stop running because the Node event loop is blocked. Pressing the "Single Op"
                            button (below) does nothing until the event loop is unblocked again.
                        </span>
                    </li>
                    <br />
                    <button
                        onClick={this.handleClickSingleOp}
                        disabled={this.state.singleOpButtonLoading}
                    >
                        Single Op
                    </button>
                    <p>
                        The "blocked-at" NPM package (
                        <a href={'https://github.com/naugtur/blocked-at'}>https://github.com/naugtur/blocked-at</a>
                        ) is used to log stack traces where blocks are occurring. At this point, I'm not familiar enough
                        with Meteor internals to interpret these effectively -- it could even be a Mongo problem
                        rather than Meteor, I'm not sure.
                    </p>
                </ol>
            </div>
        );
    }

    handleClickTestSequential = event => {
        this.setState({ sequentialButtonLoading: true });
        Meteor.call(
            'testSequential',
            { numInserts: 5000, doc: { a: 'b', foo: 'bar' } },
            (e, r) => {
                this.setState({ sequentialButtonLoading: false });
            }
        );
    }

    handleClickTestPromiseDotAll = event => {
        this.setState({ promiseDotAllButtonLoading: true });
        Meteor.call(
            'testPromiseDotAll',
            { numInserts: 5000, doc: { a: 'b', foo: 'bar' } },
            (e, r) => {
                this.setState({ promiseDotAllButtonLoading: false });
            }
        );
    }

    handleClickSingleOp = event => {
        this.setState({ singleOpButtonLoading: true });
        Meteor.call(
            'singleOp',
            (e, r) => {
                this.setState({ singleOpButtonLoading: false });
            }
        );
    }
}

export default App;
