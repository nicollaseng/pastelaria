function getSideBarItems (context, currentUser) {
	let users
	let help

	users = {
		title: 'Minha Conta',
		icon: 'user',
		useAwesome: true,
		action: context.handleUsersButton
	}
	payment = {
		title: 'Pagamento',
		icon: 'credit-card',
		useAwesome: true,
		action: context.handlePaymentButton
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
			icon: 'sign-out',
			useAwesome: true,
			action: context.handleSignOutButton
		}
	]
	return sideBarItems
}

export default getSideBarItems
