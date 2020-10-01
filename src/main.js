// src/main.js

import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import vuetify from './plugins/vuetify';
import * as VueGoogleMaps from 'vue2-google-maps'
import { Vue2Dragula } from 'vue2-dragula'
import VueQuillEditor from 'vue-quill-editor'
import wysiwyg from 'vue-wysiwyg'
import VueBreadcrumbs from 'vue2-breadcrumbs'
import VueResource from 'vue-resource'
import Notifications from 'vue-notification'
import velocity from 'velocity-animate'
import Nprogress from 'nprogress'
import VueI18n from 'vue-i18n'
import VueTour from 'vue-tour'
import fullscreen from 'vue-fullscreen'
import InstantSearch from 'vue-instantsearch'
import VueVideoPlayer from 'vue-video-player';
import Croppa from 'vue-croppa';
import axios from 'axios';

// global components
import GlobalComponents from './globalComponents'
// router
import router from './router'

// store
import { store } from './store/store';

// firebase
import './firebase'

// include all css files
import './lib/VuelyCss'

// messages
import messages from './lang';

Vue.config.productionTip = false

// navigation guards before each
router.beforeEach((to, from, next) => {
	Nprogress.start()
	if (to.matched.some(record => record.meta.requiresAuth)) {
		// this route requires auth, check if logged in
		// if not, redirect to login page.
		if (localStorage.getItem('user') === null || localStorage.getItem('jwt') === null) {
			next({
				path: '/session/login',
				query: { redirect: to.fullPath }
			})
		} else {
			next()
		}
	} else {
		next() // make sure to always call next()!
	}
})

// navigation guard after each
router.afterEach(() => {
	Nprogress.done()
	setTimeout(() => {
		const contentWrapper = document.querySelector(".v-content__wrap");
		if (contentWrapper !== null) {
			contentWrapper.scrollTop = 0;
		}
		const boxedLayout = document.querySelector('.app-boxed-layout .app-content');
		if (boxedLayout !== null) {
			boxedLayout.scrollTop = 0;
		}
		const miniLayout = document.querySelector('.app-mini-layout .app-content');
		if (miniLayout !== null) {
			miniLayout.scrollTop = 0;
		}
	}, 200);
})

const axiosInstance = axios.create({
	baseURL: 'http://13.229.132.84:5566'
})

axiosInstance.interceptors.request.use(function (config) {
	const token = localStorage.getItem('jwt')
	config.headers.Authorization = token ? `Bearer ${token}` : ''
	return config
})

axiosInstance.interceptors.response.use(function (response) {
	return response
}, function (error) {
	if (error.response && error.response.status === 401) {
		localStorage.setItem('jwt', null)
		localStorage.setItem('user', null)
		router.push("/session/login")
	}
	return Promise.reject(error);
})

Vue.use({
	install(Vue) {
		Vue.prototype.$axios = axiosInstance
	}
})

Vue.use(InstantSearch);
Vue.use(VueI18n)
Vue.use(VueTour)
Vue.use(Vue2Dragula)
Vue.use(VueQuillEditor)
Vue.use(VueResource)
Vue.use(wysiwyg, {})
Vue.use(VueBreadcrumbs)
Vue.use(Notifications, { velocity })
Vue.use(fullscreen);
Vue.use(GlobalComponents);
Vue.use(VueVideoPlayer);
Vue.use(Croppa);
Vue.use(VueGoogleMaps, {
	load: {
		key: 'AIzaSyBtdO5k6CRntAMJCF-H5uZjTCoSGX95cdk' // Add your here your google map api key
	}
})

const i18n = new VueI18n({
	locale: store.getters.selectedLocale.locale, // set locale
	messages, // set locale messages
})


new Vue({
	store,
	i18n,
	router,
	vuetify,
	render: h => h(App),
	components: { App }
}).$mount('#app')
