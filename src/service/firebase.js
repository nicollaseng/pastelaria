import { API_KEY } from 'react-native-dotenv'

export const firebaseConfig = () => {
	var config = {
			apiKey: API_KEY,
			authDomain: "tocomfome-3317f.firebaseapp.com",
			databaseURL: "https://tocomfome-3317f.firebaseio.com",
			projectId: "tocomfome-3317f",
			storageBucket: "tocomfome-3317f.appspot.com",
			messagingSenderId: "576982208523"
			};
			return config
	}