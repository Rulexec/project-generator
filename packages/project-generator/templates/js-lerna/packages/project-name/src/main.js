import { getConfig } from './config.js';
import { createContext } from './context.js';
import { Logger } from 'hypershape-logging';

let mainLogger = new Logger();

let globalContext;

createContext({ logger: mainLogger })
	.result((context) => {
		globalContext = context;

		return getConfig({ logger: mainLogger });
	})
	.result((config) => {
		globalContext.config = config;

		//
	})
	.run(
		() => {
			mainLogger.info('started');
		},
		(error, errorData) => {
			mainLogger.error('startup', null, {
				extra: error,
				exception: errorData && errorData.exception,
			});
		},
	);
