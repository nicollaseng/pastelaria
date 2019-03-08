function getSideBarItems (context, currentUser) {
	let users
	let help

	users = {
		title: 'Minha Conta',
		icon: 'user',
		useAwesome: true,
		action: context.handleUserButton
	}
	payment = {
		title: 'Meu endereço',
		icon: 'home',
		useAwesome: true,
		action: context.handleAddressButton
	}
	help = {
		title: 'Ajuda',
		icon: 'question-circle',
		useAwesome: true,
		action: context.handleHelpButton
	}

	const sideBarItems = [
		users,
		payment,
		help,
		{
			title: 'Sair',
			icon: 'sign-out-alt',
			useAwesome: true,
			action: context.handleSignOutButton
		}
	]
	return sideBarItems
}

export default getSideBarItems
