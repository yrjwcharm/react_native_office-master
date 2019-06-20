// 'use strict';
// import Home from './src/view/Home';
// import React, {
//     AppRegistry,
// } from 'react-native';
//
// class ZqOffice extends React.Component{
// 	render() {
// 			return (
// 					<Home />
// 			);
// 	}
// }
//
// AppRegistry.registerComponent('ZqOffice', () => ZqOffice);

'use strict';

import React from 'react-native';
import Root from './app/root';

const {
	AppRegistry,
} = React;

AppRegistry.registerComponent('ZqOffice', () => Root);'use strict';
