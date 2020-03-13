var state = {
    isAuthenticated : () => {
        return state.currentUser
    },
    currentUser: null
}

export default state;
