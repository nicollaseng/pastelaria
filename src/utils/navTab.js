import {colors} from "../theme/global";

export const navTab = [
  {
    key: 'home',
    icon: 'book-open',
    label: 'Cardápio',
    barColor: colors.footer,
    pressColor: 'rgba(255, 255, 255, 0.16)'
  },
  {
			key: 'chart',
			icon: 'shopping-cart',
			label: 'Carrinho',
			barColor: colors.footer,
			pressColor: 'rgba(255, 255, 255, 0.16)'
  },
  {
      key: 'order',
      icon: 'shopping-bag',
      label: 'Pedidos',
      barColor: colors.footer,
      pressColor: 'rgba(255, 255, 255, 0.16)'
  },
]