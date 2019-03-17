import VMasker from 'vanilla-masker'

const numbers = value => {
    let regexNumber = /[^0-9]/g
    let input = value.replace(regexNumber, '')
    return input
}

const toMoney = value => {
	let regexNumber = /[^0-9]/g
	let input = value.replace(regexNumber, '')
  return VMasker.toMoney(input)
}
const unMask = value => {
	const regex = /[^a-zA-Z0-9]/g;
	return (value || '')
		.toString()
		.replace(regex, '')
		.replace('R', '');
};


export {
		numbers,
		toMoney,
		unMask	
}