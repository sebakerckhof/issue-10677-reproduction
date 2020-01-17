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
                <h1>Meteor Issue #10677 Reproduction</h1>
                <a href={'https://github.com/meteor/meteor/issues/10677'}>
                    https://github.com/meteor/meteor/issues/10677
                </a>
                <ol>

                    <li>
                        <span>
                            Now, still watching the "..." logs every 100ms, press this button (or call the method from
                            dev-tools console):
                        </span>
                        <button
                            onClick={this.handleClickTestPromiseDotAll}
                            disabled={this.state.promiseDotAllButtonLoading}
                        >
                            {`Meteor.call('test', { numInserts: 5000, doc: { a: 'b', foo: 'bar' } });`}
                        </button>
                        <span>
                            The "..." logs stop running because the Node event loop is blocked. Pressing the "Single Op"
                            button (below) does nothing until the event loop is unblocked again.
                        </span>
                    </li>


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
