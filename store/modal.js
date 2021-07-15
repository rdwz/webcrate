const modals = [ 'search', 'addLink', 'addCrate', 'linkDetails', 'confirm' ]

export const state = () => ({
	show: undefined,
	data: {
		inputValue: undefined,
		actionText: undefined,
		confirmText: undefined
	}
})

export const mutations = {
	show(state, { modal, data }) {
		if (!modals.includes(modal)) throw new Error(`Unknown modal: ${ modal }`)

		state.show = modal
		state.data = { ...state.data, ...data }
	},
	hide(state) {
		state.show = undefined
	},
	set_data(state, data) {
		state.data = { ...state.data, ...data }
	}
}

export const actions = {
	SHOW_CONFIRM({ commit }, { confirmText, actionText }) {
		commit('SHOW_MODAL', {
			modale: 'confirm',
			data: {
				confirmText,
				actionText
			}
		})
	},
	HIDE_CONFIRM({ commit }) {
		commit('HIDE_MODAL', 'confirm')
	}
}