import AsyncM from 'asyncm';
import dotenv from 'dotenv';
import { resolveCodePath } from './code-relative-path.js';

export { getConfig };

const dotEnvPath = process.env.DOTENV || resolveCodePath('../../../.env');

dotenv.config({
	path: dotEnvPath,
});

function getConfig({ logger }) {
	let error = null;

	let config = {
		dotEnvPath,
	};

	if (error) return AsyncM.error(error);

	logConfig(config);

	return AsyncM.result(config);

	// eslint-disable-next-line no-unused-vars
	function ensureEnv(name, onPresent) {
		let value = process.env[name];
		if (!value) {
			logger.error('noEnv', { name });

			if (!error) error = new Error('env missing: ' + name);
			return null;
		}

		if (onPresent) {
			let newValue = onPresent(value);
			if (typeof newValue !== 'undefined') {
				value = newValue;
			}
		}

		return value;
	}

	function logConfig(config, prefix) {
		if (typeof config !== 'object') {
			logger.info('config', { k: prefix, v: config });
			return;
		}

		if (Array.isArray(config)) {
			config.forEach((x, i) => {
				logConfig(x, prefix + '.' + i);
			});
			return;
		}

		for (let [key, value] of Object.entries(config)) {
			if (prefix) {
				key = prefix + '.' + key;
			}

			if (typeof value !== 'object') {
				logConfig(value, key);
			} else {
				logger.info('config', { k: key }, { extra: value });
			}
		}
	}
}
