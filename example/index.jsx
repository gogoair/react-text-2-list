import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer as HotContainer } from 'react-hot-loader';
import Text2List from '../Components/Text2List';

function render(Component) {
	ReactDOM.render(
		<HotContainer>
			<div style={{ "maxWidth": "1200px", "margin": "50px auto 0" }}>
				<Component
                    onAdd={list => { console.log(list) }}
                />
			</div>
		</HotContainer>,
		document.getElementById('react')
	);
}

render(Text2List);

if (module.hot) {
	module.hot.accept('../Components/Text2List', () => {
		render(Text2List);
	});
}
