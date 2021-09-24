import React, { createContext, useReducer, useContext } from 'react'
const initialState = {
	isError: true,
	serverUrl: 'https://mailadmin.avicnet.cn',
	ticket: 'ST-1890-Ssu-ffIPO2--rYlPAxchZ26kUV8-iz2zeix2sgagsdunlcyfxjz',
	// 超级管理员
	companyId: '0ecc9c9c665d4fcbaf22e1a0b10e672a',
	userId: '07dc42978c3c48ea98e84b98acd585b4'
	// 应用管理员
	// companyId: "88d625e6446d455aaf7016a4b06b381f",
	// userId: "ad276d3d75134ad487f10a8f7ae6b3b9",
}

function reducer(state, action) {
	switch (action.type) {
		case 'save':
			return action.value
		default:
			return action.value
		// throw new Error();
	}
}

const Context = createContext()

function useStore() {
	return useContext(Context)
}

function StoreProvider({ children }) {
	const [state, dispatch] = useReducer(reducer, initialState)

	return <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
}

export { useStore, StoreProvider }
