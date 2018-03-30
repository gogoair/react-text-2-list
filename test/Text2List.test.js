import React from 'react';
import Text2List from '../Components/Text2List';
import InputList from '../Components/InputList';

import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import {expect} from 'chai';

Text2List.prototype.componentDidMount = () => {};

describe('Initialization of component', () => {

    beforeEach(() => {
        sinon.spy(Text2List.prototype, 'componentDidMount');
    });

    afterEach(() => {
        Text2List.prototype.componentDidMount.restore();
    });

    it('mounts', () => {
        const text2List = shallow(<Text2List onAdd={() => {}} />);

        expect(Text2List.prototype.componentDidMount.calledOnce).to.be.true;

        text2List.unmount();
    });
});

describe('Enable/disable submit/remove', () => {

    it('Prevents enter if input is empty', () => {
        sinon.spy(Text2List.prototype, 'handleEnter');
        const text2List = mount(<Text2List onAdd={() => {}} />);

        text2List.find('.Button--action').simulate('click');

        expect(Text2List.prototype.handleEnter.notCalled).to.be.true;

        Text2List.prototype.handleEnter.restore();
        text2List.unmount();
    });

    it('Enables enter if text is entered in input', () => {
        sinon.spy(Text2List.prototype, 'handleEnter');
        const text2List = mount(<Text2List onAdd={() => {}} />);

        text2List.find('.Text2List__input').simulate('change', { target: { value: 'this is a text' } });
        text2List.find('.Button--action').simulate('click');

        expect(Text2List.prototype.handleEnter.calledOnce).to.be.true;

        Text2List.prototype.handleEnter.restore();
        text2List.unmount();

        text2List.unmount();
    });

    it('Prevents remove all if InputList is empty', () => {
        sinon.spy(Text2List.prototype, 'removeAll');
        const text2List = mount(<Text2List onAdd={() => {}} />);

        text2List.find('.Text2List__removeAll').simulate('click');

        expect(Text2List.prototype.removeAll.notCalled).to.be.true;

        Text2List.prototype.removeAll.restore();
        text2List.unmount();
    });

    it('Enables remove all if InputList is populated', () => {
        sinon.spy(Text2List.prototype, 'removeAll');
        const text2List = mount(<Text2List onAdd={() => {}} />);

        text2List.setState({ inputItems: ['this', 'is', 'a', 'text'] });

        text2List.find('.Text2List__removeAll').simulate('click');

        expect(Text2List.prototype.removeAll.calledOnce).to.be.true;

        Text2List.prototype.removeAll.restore();
        text2List.unmount();
    });
});

describe('Text handling', () => {

    it('Separates multiple pasted codes properly', () => {
        const text2List = mount(<Text2List onAdd={() => {}} />);

        text2List.find('.Text2List__input').simulate('change', { target: { value: 'text1 text2,text3 text4' } });
        text2List.find('.Button--action').simulate('click');

        expect(text2List.state().inputItems).to.deep.equal(['text1', 'text2', 'text3', 'text4']);

        text2List.unmount();
    });

    it('Separates multiple pasted codes with custom separators prop', () => {
        const text2List = mount(<Text2List onAdd={() => {}} separators="f|g" />);

        text2List.find('.Text2List__input').simulate('change', { target: { value: '123f456g789f0' } });
        text2List.find('.Button--action').simulate('click');

        expect(text2List.state().inputItems).to.deep.equal(['123', '456', '789', '0']);

        text2List.unmount();
    });

    it('Filters out items that are only white space or of length 0', () => {
        const text2List = mount(<Text2List onAdd={() => {}} />);

        text2List.find('.Text2List__input').simulate('change', { target: { value: '   a     b   ' } });
        text2List.find('.Button--action').simulate('click');

        expect(text2List.state().inputItems).to.deep.equal(['a', 'b']);

        text2List.unmount();
    });

    it('Filters out items that are already in list', () => {
        const text2List = mount(<Text2List onAdd={() => {}} />);

        text2List.setState({ inputItems: ['a', 'b'] });
        text2List.find('.Text2List__input').simulate('change', { target: { value: '   a  c   b   d' } });
        text2List.find('.Button--action').simulate('click');

        expect(text2List.state().inputItems).to.deep.equal(['c', 'd', 'a', 'b']);

        text2List.unmount();
    });
});

describe('Adding to list', () => {

    it('Renders InputList on submit', () => {
        const text2List = mount(<Text2List onAdd={() => {}} />);

        text2List.find('.Text2List__input').simulate('change', { target: { value: 'text1 text2,text3 text4' } });
        text2List.find('.Button--action').simulate('click');

        expect(text2List.find('.Text2List__inputList').length).to.equal(1);

        text2List.unmount();
    });

    it('Renders proper number of InputListItem-s on submit', () => {
        const text2List = mount(<Text2List onAdd={() => {}} />);

        text2List.find('.Text2List__input').simulate('change', { target: { value: 'text1 text2,text3 text4' } });
        text2List.find('.Button--action').simulate('click');

        expect(text2List.find('.Text2List__inputListItem').length).to.equal(4);

        text2List.unmount();
    });

    it('Calls onAdd with proper args when item(s) added', () => {
        const spy = sinon.spy();
        const text2List = mount(<Text2List onAdd={spy} />);

        text2List.find('.Text2List__input').simulate('change', { target: { value: 'text1 text2,text3 text4' } });
        text2List.find('.Button--action').simulate('click');

        expect(spy.calledWith(['text1', 'text2', 'text3', 'text4'])).to.be.true;

        text2List.unmount();
    });
});

describe('Removing entries from list', () => {

    it('Destroys all InputListItem-s on removeAll click', () => {
        const text2List = mount(<Text2List onAdd={() => {}} />);

        text2List.find('.Text2List__input').simulate('change', { target: { value: 'text1 text2,text3 text4' } });
        text2List.find('.Button--action').simulate('click');

        text2List.find('.Text2List__removeAll').simulate('click');

        expect(text2List.find('.Text2List__inputListItem').length).to.equal(0);

        text2List.unmount();
    });

    it('Destroys InputListItem on delete click', () => {
        const text2List = mount(<Text2List onAdd={() => {}} />);

        text2List.setState({ inputItems: ['text1', 'text2', 'text3', 'text4'] });
        text2List.find('.Text2List__inputListItem').first().find('.Button.Button--underline.Text2List__removeOne').simulate('click');

        expect(text2List.find('.Text2List__inputListItem').length).to.equal(3);

        text2List.unmount();
    });

    it('Calls onAdd with props args on item(s) remove', () => {
        const spy = sinon.spy();
        const text2List = mount(<Text2List onAdd={spy} />);

        text2List.setState({ inputItems: ['text1', 'text2', 'text3', 'text4'] });
        text2List.find('.Text2List__inputListItem').first().find('.Button.Button--underline.Text2List__removeOne').simulate('click');

        expect(spy.calledWith(['text2', 'text3', 'text4'])).to.be.true;

        text2List.unmount();
    });
});


// ?
describe('Error handling', () => {

    it('Shows errors message on duplicate entries', () => {
        const text2List = mount(<Text2List onAdd={() => {}} />);

        text2List.setState({ inputItems: ['a', 'b'] });
        text2List.find('.Text2List__input').simulate('change', { target: { value: '   a  c   b   d' } });
        text2List.find('.Button--action').simulate('click');

        expect(text2List.find('.Text2List__duplicatesErrorMessage').length).to.equal(1);

        text2List.unmount();
    });

    it('Filters out duplicate items when stopOnDuplicate is false', () => {
        const text2List = mount(<Text2List onAdd={() => {}} />);

        text2List.setState({ inputItems: ['a', 'b'] });
        text2List.find('.Text2List__input').simulate('change', { target: { value: '   a  c   b   d' } });
        text2List.find('.Button--action').simulate('click');

        expect(text2List.state().inputItems).to.deep.equal(['c', 'd', 'a', 'b']);

        text2List.unmount();
    });

    it('Stops item(s) entering to list when stopOnDuplicate is true', () => {
        const text2List = mount(<Text2List onAdd={() => {}} stopOnDuplicate />);

        text2List.setState({ inputItems: ['a', 'b'] });
        text2List.find('.Text2List__input').simulate('change', { target: { value: '   a  c   b   d' } });
        text2List.find('.Button--action').simulate('click');

        expect(text2List.state().inputItems).to.deep.equal(['a', 'b']);

        text2List.unmount();
    });

    it('Shows errors message on more entries than allowed', () => {
        const text2List = mount(<Text2List onAdd={() => {}} maxItems={3} />);

        text2List.setState({ inputItems: ['a', 'b'] });
        text2List.find('.Text2List__input').simulate('change', { target: { value: '   1  c   2   d' } });
        text2List.find('.Button--action').simulate('click');

        expect(text2List.find('.Text2List__errorMessage').length).to.equal(1);

        text2List.unmount();
    });

    it('Enters proper number of items when stopOnMaxItemsError is false', () => {
        const text2List = mount(<Text2List onAdd={() => {}} maxItems={3} />);

        text2List.setState({ inputItems: ['a', 'b'] });
        text2List.find('.Text2List__input').simulate('change', { target: { value: '   1  c   2   d' } });
        text2List.find('.Button--action').simulate('click');

        expect(text2List.state().inputItems).to.deep.equal(['1', 'a', 'b']);

        text2List.unmount();
    });

    it('Stops enter stopOnMaxItemsError is true', () => {
        const text2List = mount(<Text2List onAdd={() => {}} maxItems={3} stopOnMaxItemsError />);

        text2List.setState({ inputItems: ['a', 'b'] });
        text2List.find('.Text2List__input').simulate('change', { target: { value: '   1  c   2   d' } });
        text2List.find('.Button--action').simulate('click');

        expect(text2List.state().inputItems).to.deep.equal(['a', 'b']);

        text2List.unmount();
    });
    //
    it('Shows errors message when custom validation fails', () => {
        const text2List = mount(<Text2List onAdd={() => {}} validateEntry={item => item.length < 3} />);

        text2List.setState({ inputItems: ['a', 'b'] });
        text2List.find('.Text2List__input').simulate('change', { target: { value: '   123  c   21234   d' } });
        text2List.find('.Button--action').simulate('click');

        expect(text2List.find('.Text2List__errorMessage').length).to.equal(1);

        text2List.unmount();
    });

    it('Enters valid items when stopOnValidationError is false', () => {
        const text2List = mount(<Text2List onAdd={() => {}} validateEntry={item => item.length < 3} />);

        text2List.setState({ inputItems: ['a', 'b'] });
        text2List.find('.Text2List__input').simulate('change', { target: { value: '   123  c   21234   d' } });
        text2List.find('.Button--action').simulate('click');

        expect(text2List.state().inputItems).to.deep.equal(['c', 'd', 'a', 'b']);

        text2List.unmount();
    });

    it('Stops enter when stopOnValidationError is true', () => {
        const text2List = mount(<Text2List onAdd={() => {}} validateEntry={item => item.length < 3} stopOnValidationError />);

        text2List.setState({ inputItems: ['a', 'b'] });
        text2List.find('.Text2List__input').simulate('change', { target: { value: '   123  c   21234   d' } });
        text2List.find('.Button--action').simulate('click');

        expect(text2List.state().inputItems).to.deep.equal(['a', 'b']);

        text2List.unmount();
    });
});