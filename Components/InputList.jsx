import React from 'react';

const InputList = props => {
    return props.inputItems
        ? (
            <ul className={props.classNames.wrapper} style={{ "maxHeight": props.maxVisibleItems * 45 + "px" }}>
                {props.inputItems.map((item) => {
                    return (
                        <li key={item} className={props.classNames.inputItem}>
                            <span className={props.classNames.inputItemText}>{item}</span>
                            <button className={props.classNames.removeButton} onClick={props.destroyItem.bind(null, item)}>
                                <span className="Text2List__removeOneText">Delete</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
    ) : null;
};

export default InputList;