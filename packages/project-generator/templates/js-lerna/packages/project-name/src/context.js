import AsyncM from 'asyncm';

export { createContext };

function createContext() {
	let context = {
		config: null,
	};

	return AsyncM.result(context);
}
