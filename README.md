# react-text-2-list

Simple React component for entering / pasting large quantities of text to list


## Usability
Peer dependencies: React and react-dom. 

```javascript
import { Text2List } from 'react-text-2-list';
```
and include css file (you may include this in different way)
```javascript
require('../node_modules/react-text-2-list/css/style.css');
```
## Demo
We prepared code sandbox demo. 
[See demo here](https://codesandbox.io/s/5mvvm7p75l)

## props/options

### Required props
There is only one mandatory prop: onAdd callback, that is gonna get fired when one or more items get added to the list

```javascript
import React, {Component} from 'react';
import { Text2List } from 'react-text-2-list';
// You should not forget to include css

export default class FakeComponent extends Component {

	constructor(props) {
		super(props);

		this.onAddCallback = this.onAddCallback.bind(this);
	}

	onAddCallback(list) {
		console.log(list);
		// do whatever you like with your list,
		// which is an array of strings
	}

	render() {
		return (
			<div>
				<Text2List
					onAdd={this.onAddCallback}
				/>
			</div>
		);
	}
}
```

### classNames 

| Property | Default | Description |
| ------------ | ------- | ----------- |
| **classNames** | --- | Object containing classnames listed below |
| **classNames.wrapper** | Text2List | Component root element |
| **classNames.heading** | Text2List__heading | h4 tag, the heading of the component |
| **classNames.input** | Text2List__input | Textarea tag |
| **classNames.buttonsWrapper** | Text2List__buttonsWrapper | Div tag wrapping enter and remove all buttons |
| **classNames.enterButton** | Button Button--action | Enter button |
| **classNames.removeButton** | Button Button--underline Text2List__removeAll | Remove all button |
| **classNames.errorMessage** | Text2List__errorMessage | Error message on duplicate entries, if you enable stopOnDuplicate prop |
| **classNames.errorItems** | Text2List__errorItems | span tag wrapping list of duplicate entries in error message |
| **inputListClassNames** | --- | Object containing classnames for InputList component, listed below |
| **inputListClassNames.wrapper** | Text2List__inputList | Component root element |
| **inputListClassNames.inputItem** | Text2List__inputListItem | Li tag, one entry in the list |
| **inputListClassNames.inputItemText** | Text2List__inputListItemText | Entry text in li tag |
| **inputListClassNames.removeButton** | Button Button--underline Text2List__removeOne | Delete button inside the entry |

### All props

| Property         | Type    | Default | Description |
| ------------ | ------- | ------- | ----------- |
| **onAdd** | function | none | Callback to invoke on adding item(s) in the list, gets passed array of strings that are entries it the list |
| **placeholder** | string | "1 or more codes accepted" | Placeholder text for textarea |
| **separators** | string | space and comma | String that we will use to make RegExp to separate entered text in textarea, ie. series of characters separated with pipe |
| **stopOnDuplicate** | boolean | false | If true, it will stop submit if there are duplicate items entered or item already exists in the list. Otherwise, it will just show error message and filter out duplicates on enter |
| **maxVisibleItems** | number | 4 | It will determine the max-height of the list, with 45px being height of one entry and add a scroll if needed |
| **maxItems** | number | none | Max number of allowed entries |
| **stopOnMaxItemsError** | boolean | false | If true, it will stop submit if there are more items entered than specified in maxItems prop. Otherwise, it will just show error message and truncate entries to match max items allowed in list |
| **validateEntry** | function | none | Function that takes single entry as sole argument. Should return true or false |
| **stopOnValidationError** | boolean | false | If true, it will stop submit if if one or more items didn't pass validateEntry check. Otherwise, it will just show error message and filter out invalid entries before enter |
| **validationErrorMessage** | string | "Entries need to be valid." | Error message to show if one or more items didn't pass the validateEntry check. Will get added a list of invalid entries to the end of it |
| **enterButtonText** | string | "Enter" | Text that you want to show on "Enter" button |
| **heading** | string | "Product code/number" | Text for h4 tag |

### Customizing and contributing

You can contact us in case you need some feature or want to contribute.
It's possible that you may need additional className props, we haven't fully tested custom styling. Feel free to contact us should that be a case.
You can also freely fork and play around with the project.
