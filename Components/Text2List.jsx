import React from 'react';
import PropTypes from 'prop-types';
import uniq from 'lodash.uniq';

import InputList from './InputList';

export default class Text2List extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputItems: [],
            textInput: '',
        };

        this.getInputItems = ::this.getInputItems;
        this.handleInputChange = ::this.handleInputChange;
        this.handleEnter = ::this.handleEnter;
        this.fakeSubmit = ::this.fakeSubmit;
        this.removeAll = ::this.removeAll;
        this.removeOne = ::this.removeOne;
        this.isItemAlreadyInState = ::this.isItemAlreadyInState;
    }

    static defaultProps = {
        classNames: {
            wrapper: 'Text2List',
            heading: 'Text2List__heading',
            input: 'Text2List__input',
            buttonsWrapper: 'Text2List__buttonsWrapper',
            enterButton: 'Button Button--action',
            removeButton: 'Button Button--underline Text2List__removeAll',
            errorMessage: 'Text2List__errorMessage',
            errorItems: 'Text2List__errorItems',
        },
        inputListClassNames: {
            wrapper: 'Text2List__inputList',
            inputItem: 'Text2List__inputListItem',
            inputItemText: 'Text2List__inputListItemText',
            removeButton: 'Button Button--underline Text2List__removeOne',
        },
        placeholder: '1 or more codes accepted',
        separators: ' |,',
        stopOnDuplicate: false,
        maxVisibleItems: 4,
        heading: 'Product code/number',
    };

    static propTypes = {
        onAdd: PropTypes.func.isRequired,
        classNames: PropTypes.object,
        inputListClassNames: PropTypes.object,
        placeholder: PropTypes.string,
        separators: PropTypes.string,
        stopOnDuplicate: PropTypes.bool,
        maxVisibleItems: PropTypes.number,
        heading: PropTypes.string,
    };

    notWhiteSpaceOnlyOrEmptyString(item) {
        return item.length > 0 && !!item.match(/\S/);
    }

    isItemAlreadyInState(item) {
        return this.state.inputItems.indexOf(item) !== -1;
    }

    getInputItems(inputValue) {
        const regex = new RegExp(`${this.props.separators}`);

        return inputValue.trim().split(regex);
    }

    handleInputChange(event) {
        this.setState({ textInput: event.target.value });
    }

    getDuplicates(array) {
        return array.reduce((agg,col) => {
                agg.filter[col] = agg.filter[col]? agg.dup.push(col): 2;
                return agg
            },
            {filter:{},dup:[]})
            .dup;
    }

    handleEnter() {
        const inputItemsFromText = this.getInputItems(this.state.textInput).filter((item) => {
            return  this.notWhiteSpaceOnlyOrEmptyString(item);
        });

        // handle duplicates inside the text area
        if (this.props.stopOnDuplicate) {
            const duplicates = uniq(this.getDuplicates(inputItemsFromText));

            if (duplicates.length > 0) {
                this.setState({ duplicates });

                return;
            } else {
                this.setState({ duplicates: undefined });
            }
        }

        let uniqueItems = uniq(inputItemsFromText);
        let duplicates = [];

        const inputItems = uniqueItems.filter((item) => {
            if(this.isItemAlreadyInState(item)) {
                duplicates.push(item);
            }

            return !this.isItemAlreadyInState(item);
        });

        // handle duplicates that are already in the list
        if (this.props.stopOnDuplicate && duplicates.length > 0) {
            this.setState({ duplicates });

            return;
        } else {
            this.setState({ duplicates: undefined });
        }

        this.setState({ inputItems: [...inputItems, ...this.state.inputItems], textInput: '' });

        if (this.props.onAdd) {
            this.props.onAdd([...inputItems, ...this.state.inputItems]);
        }
    }

    fakeSubmit(event) {
        if (event.keyCode === 13 && this.state.textInput.length > 0) {
            this.handleEnter();
        }
    }

    removeAll() {
        this.setState({ inputItems: [] });
    }

    removeOne(itemToDelete) {
        const newInputItems = this.state.inputItems.filter((item) => {
            return item !== itemToDelete;
        });

        this.setState({ inputItems: newInputItems });
    }

    render() {
        return (
            <div className={this.props.classNames.wrapper}>
                <h4 className={this.props.classNames.heading}>{this.props.heading}</h4>
                <textarea
                    type="text"
                    name="inputItem"
                    placeholder={this.props.placeholder}
                    className={this.props.classNames.input}
                    onChange={this.handleInputChange}
                    value={this.state.textInput}
                    onKeyDown={this.fakeSubmit}
                />
                <div className={this.props.classNames.buttonsWrapper}>
                    <button
                        className={this.props.classNames.removeButton}
                        disabled={this.state.inputItems.length === 0}
                        onClick={this.removeAll}
                    >
                        Remove all
                    </button>
                    <button
                        className={this.props.classNames.enterButton}
                        disabled={this.state.textInput.length === 0}
                        onClick={this.handleEnter}
                    >
                        Enter
                    </button>
                </div>
                {this.state.duplicates
                    ? <div className={this.props.classNames.errorMessage}>
                        You entered duplicate entries:
                        <span className={this.props.classNames.errorItems}>{this.state.duplicates.join(', ')}</span>
                    </div> : null}
                <InputList
                    inputItems={this.state.inputItems}
                    classNames={this.props.inputListClassNames}
                    destroyItem={this.removeOne}
                    maxVisibleItems={this.props.maxVisibleItems}
                />
            </div>
        );
    }
}
