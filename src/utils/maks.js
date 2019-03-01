import VMasker from 'vanilla-masker';

export const brPhone = '(99) 99999-9999';
export const brCpf = '999.999.999-99';
export const brCnpj = '99.999.999/9999-99';
export const brCep = '99999-999';
export const dateMask = '99/99/9999';

export function maskAccount(value) {
  try {
    if(typeof value === 'string' && value.length > 1) {
      return value.slice(0, value.length-1) + '-' + value.slice(value.length-1);
    }
  } catch(err) {
    return value;
  }
  return value;
}

function applyMask(context, prop, mask) {
  return (value) => {
    context.setState({
         [prop]: VMasker.toPattern(value, mask) 
    });
  };
}

export function unMask(value) {
  const regex = /[^a-zA-Z0-9]/g;
  return (value || '').toString().replace(regex, '');
}

function applyRegex(value) {
  // Regex para separar os zeros a esquerda do restante
  const regex = /^([0]*)([1-9][0-9]*)$/g;
  // elimina caracteres especiais do valor
  const raw = unMask(value);
  // Divide value em dois arrays, vetor com os zeros e outro com o restante do numero
  const match = regex.exec(raw);
  // Pega somente o segundo vetor e aplica a mask novamente
  const masked = match ? VMasker.toMoney(match[2]) : VMasker.toMoney(raw);

  return masked;
}


export function applyMoneyMask(context, prop) {
  return (value) => {
    const valueMasked = applyRegex(value);
    context.setState({
      [prop]: valueMasked
    });
  };
}

export function applyMaskConsumoAgua(context, prop, opts) {
  return (value) => {
    let opts = { precision: 4 };
    const valueMasked = VMasker.toMoney(unMask(value), opts);
    if(unMask(valueMasked).length <= 9) {
      context.setState({
        [prop]: valueMasked
      });
    }
  };
}

export function addDdi(value) {
  return `+55${value}`;
}

export function removeDdi(value) {
  if (!value) {
    return '';
  }
  return value.replace('+55', '');
}

export function setMask(value, mask) {
  if (!value) {
    return '';
  }
  return VMasker.toPattern(removeDdi(value), mask);
}

export function setMoneyMask(value) {
  let money = value;
  if (!money) {
    money = 0;
  }
  const valueMasked = applyRegex(money);
  return valueMasked;
}

export function setMoneyMask2(value) {
  let money = unMask(value);
  if(typeof money === 'string') {
    while(money.length > 4) money = money.slice(1);
    while(money.length < 4) money = '0' + money;
    money = money.slice(0, money.length-3) + ',' + money.slice(money.length-3)
  }
  return money;
}

export function setConsumoMask(value) {
  let money = unMask(value);
  if(typeof money === 'string') {
    while(money.length > 9) money = money.slice(1);
    while(money.length < 5) money = '0' + money;
    let partOne = money.slice(0, money.length-4);
    let partTwo = money.slice(money.length-4);
    if(partOne.length > 3) {
      partOne = partOne.slice(0, partOne.length-3) + '.' + partOne.slice(partOne.length-3);
    }
    money = partOne + ',' + partTwo;
    // money =  + ',' + money.slice(money.length-4);
  }
  return money;
}

export function setFractionMask(value) {
  let fraction = unMask(value);
  if(typeof fraction === 'string') {
    while(fraction.length > 13) fraction = fraction.slice(1);
    while(fraction.length < 13) fraction = '0' + fraction;
    fraction = fraction.slice(0, 3) + ',' + fraction.slice(3)
  }
  return fraction;
}

function addCollonPercent(value) {
  let parts = value.split(',');
  let partOne = isNaN(parseInt(parts[0])) ? 0 : parseInt(parts[0]);
  let oneIsZero = parseInt(parts[0]) === 0;
  let partTwo = parts[1] ? parts[1] : null;
  if(partTwo && partTwo.length > 13) {
    partTwo = partTwo.slice(0, 13);
  }
  let hasLeftZero = (partOne < 10 && parts[0].length > 1);
  if(!partTwo || (partTwo.length === 0 || partTwo === '0')) {
    return partOne === 0 ? (oneIsZero ? '0' : '') : (hasLeftZero ? '0'+partOne.toString() : partOne.toString());
  } else if(partTwo && partTwo.length > 0 && partTwo !== '0') {
    if(partOne < 10) {
      return '0'+ partOne + ',' + partTwo;
    } else {
      return partOne + ',' + partTwo;
    }
  }
  return value;
}

export function maskFraction(value) {
  let fraction = unMask(value.replace('0 %', ''));
  if(typeof fraction === 'string') {
    if(parseInt(fraction.slice(0, 3)) !== 100) {
      if(fraction[0] === ',') {
        fraction = fraction.slice(0, 1) + ',' + fraction.slice(1);
      } else {
        fraction = fraction.slice(0, 2) + ',' + fraction.slice(2);
      }
    } else {
      if(fraction.length == 3 && value[2] !== ',') {
        fraction = fraction.slice(0, 3) + ',' + fraction.slice(3);
      } else {
        fraction = fraction.slice(0, 2) + ',' + fraction.slice(2);
      }
    }
  }

  return addCollonPercent(fraction);
}
export default applyMask;
