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
            maxItemsErrorMessage: undefined,
            validationErrorMessage: undefined,
            invalidEntries: [],
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
            duplicatesErrorMessage: 'Text2List__duplicatesErrorMessage',
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
        enterButtonText: 'Enter',
        validationErrorMessage: 'Entries need to be valid.'
        pendingEnterButtonText: 'Validating...',
    };

    static propTypes = {
        onAdd: PropTypes.func.isRequired,
        classNames: PropTypes.object,
        inputListClassNames: PropTypes.object,
        placeholder: PropTypes.string,
        separators: PropTypes.string,
        stopOnDuplicate: PropTypes.bool,
        stopOnMaxItemsError: PropTypes.bool,
        stopOnValidationError: PropTypes.bool,
        maxVisibleItems: PropTypes.number,
        heading: PropTypes.string,
        enterButtonText: PropTypes.string,
        maxItems: PropTypes.number,
        validateEntry: PropTypes.func,
        validationErrorMessage: PropTypes.string,
        isInPendingState: PropTypes.bool,
        pendingEnterButtonText: PropTypes.string,
        asyncValidation: PropTypes.bool,
    };

    componentDidUpdate(prevProps) {
        if (prevProps.isInPendingState && !this.props.isInPendingState) {
            this.handleEnter();
        }
    }

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

    truncateItems = (items, howMany) => {
        return items.slice(0, howMany);
    };

    moreThanMax = items => {
      return items.length > this.props.maxItems || items.length + this.state.inputItems.length > this.props.maxItems;
    };

    setTextAreaDuplicates = duplicates => {
        this.setState({ duplicates: duplicates.length > 0 ? duplicates : undefined });
    };

    setInputListDuplicates = duplicates => {
        if (duplicates.length > 0) {
            this.setState({ duplicates });
        } else if (this.state.inputItems.length > 0) {
            this.setState({ duplicates: undefined });
        }
    };

    handleEnter(asyncValidation) {
        let inputItemsFromText = this.getInputItems(this.state.textInput).filter(item => {
            return  this.notWhiteSpaceOnlyOrEmptyString(item);
        });

        if (asyncValidation) {
            return;
        }

        // validateEntry
        if (this.props.validateEntry) {
            let invalidItems = [];

            inputItemsFromText = inputItemsFromText.filter(item => {
                const isValid = this.props.validateEntry(item);
                if (!isValid) {
                    invalidItems.push(item);
                }
                return isValid;
            });

            if (invalidItems.length > 0) {
                this.setState({
                    validationErrorMessage: this.props.validationErrorMessage,
                    invalidEntries: invalidItems,
                });
                if (this.props.stopOnValidationError) {
                    return;
                }
            } else {
                this.setState({ validationErrorMessage: undefined, invalidEntries: [], });
            }
        }

        // handle duplicates that are entered in text area
        const inputDuplicates = uniq(this.getDuplicates(inputItemsFromText));
        this.setTextAreaDuplicates(inputDuplicates);

        if (this.props.stopOnDuplicate && inputDuplicates.length > 0) {
            return;
        }

        let uniqueItems = uniq(inputItemsFromText);
        let listDuplicates = [];

        let inputItems = uniqueItems.filter((item) => {
            if(this.isItemAlreadyInState(item)) {
                listDuplicates.push(item);
            }

            return !this.isItemAlreadyInState(item);
        });

        // handle duplicates that are already in the list
        this.setInputListDuplicates(listDuplicates);
        if (this.props.stopOnDuplicate && listDuplicates.length > 0) {
            return;
        }

        // handle max items
        if (this.moreThanMax(inputItems) && this.props.stopOnMaxItemsError) {
            this.setState({ maxItemsErrorMessage: `Max number of entries is ${this.props.maxItems}` });
            return;
        } else if (this.moreThanMax(inputItems)) {
            this.setState({ maxItemsErrorMessage: `Max number of entries is ${this.props.maxItems}` });
            const howMany = this.props.maxItems - this.state.inputItems.length;
            inputItems = this.truncateItems(inputItems, howMany);
        } else {
            this.setState({ maxItemsErrorMessage: undefined });
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
        this.props.onAdd([]);
    }

    removeOne(itemToDelete) {
        const newInputItems = this.state.inputItems.filter((item) => {
            return item !== itemToDelete;
        });

        this.setState({ inputItems: newInputItems });
        this.props.onAdd(newInputItems);
    }

    render() {
        return (
            <div className={this.props.classNames.wrapper}>
                <h4 className={this.props.classNames.heading}>{this.props.heading}</h4>
                <textarea
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
                        disabled={this.state.textInput.trim().length === 0 || this.props.isInPendingState}
                        onClick={event => this.handleEnter(this.props.asyncValidation)}
                    >
                        {!this.props.isInPendingState
                            ? this.props.enterButtonText
                            : this.props.pendingEnterButtonText}
                    </button>
                </div>
                {this.state.duplicates
                    ? <div className={this.props.classNames.duplicatesErrorMessage}>
                        You entered duplicate entries:
                        <span className={this.props.classNames.errorItems}>{this.state.duplicates.join(', ')}</span>
                      </div>
                    : null}
                {this.state.maxItemsErrorMessage
                    ? <div className={this.props.classNames.errorMessage}>
                        {this.state.maxItemsErrorMessage}
                      </div>
                    : null}
                {this.state.validationErrorMessage
                    ? <div className={this.props.classNames.errorMessage}>
                        {this.state.validationErrorMessage}
                        {`Invalid entries: ${this.state.invalidEntries.join(', ')}`}
                    </div>
                    : null}
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
