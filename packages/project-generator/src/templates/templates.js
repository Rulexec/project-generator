import { generate as jsLerna } from './js-lerna/generate.js';

export { getTemplates };

function getTemplates() {
	return [
		{
			name: 'js-lerna',
			generate: jsLerna,
		},
	];
}
