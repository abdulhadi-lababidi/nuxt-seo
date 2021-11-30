const test = require('ava')
const nuxtSeo = require('../lib/module')

test('createTitle with two title', t => {
	const title = nuxtSeo.createTitle({
		title: 'test',
		templateTitle: '%title% - %title%'
	})

	t.true(title === 'test - test')
})

test('createTitle with name + title', t => {
	const title = nuxtSeo.createTitle({
		title: 'test',
		name: 'app',
		templateTitle: '%name% - %title%'
	})

	t.true(title === 'app - test')
})

test('createMeta with all meta basic', t => {
	const options = {...nuxtSeo.defaults}
	options.charset = 'utf-8'
	options.lang = 'en'
	options.language = 'English'
	options.copyright = 'TiagoDanin'
	options.name = 'TiagoDanin WebSite'
	options.title = 'Home Page'
	options.subtitle = 'About page'
	options.author = ['Tiago Danin', 'TiagoDanin@outlook.com']
	options.replyTo = 'TiagoDanin@outlook.com'
	options.description = 'About the Tiago Danin'
	options.keywords = ['Tiago', 'Danin', 'about']
	options.url = 'https://tiagodanin.github.io'
	options.noindex = true

	const inputMeta = [{lang: 'pt'}]
	const {template} = nuxtSeo
	const meta = nuxtSeo.createMeta(options, inputMeta, template)
	const done = require('./fixtures/all.js')

	t.true(JSON.stringify(meta) === JSON.stringify(done))
})

test('createMeta with options no valid', t => {
	const options = {
		notValid: true
	}

	const inputMeta = []
	const {template} = nuxtSeo
	const meta = nuxtSeo.createMeta(options, inputMeta, template)

	t.true(JSON.stringify(meta) === JSON.stringify([]))
})

test('createMeta with array in openGraph.image', t => {
	const options = {...nuxtSeo.defaults}
	const inputMeta = [{lang: 'pt'}]
	const {template} = nuxtSeo

	options.openGraph = {
		image: [{
			url: 'https://1.jpg',
			alt: 'Photo test 1'
		}, {
			url: 'https://2.jpg',
			alt: 'Photo test 2'
		}]
	}
	const meta01 = nuxtSeo.createMeta(options, inputMeta, template)

	options.openGraph = {
		image: ['https://1.jpg', 'https://2.jpg']
	}
	const meta02 = nuxtSeo.createMeta(options, inputMeta, template)

	t.true(Boolean(meta01.find(element => element.content === 'https://1.jpg' && element.key === 'og:image:00')))
	t.true(Boolean(meta01.find(element => element.content === 'Photo test 2' && element.key === 'og:image:alt:01')))

	t.true(Boolean(meta02.find(element => element.content === 'https://1.jpg' && element.key === 'og:image:00')))
	t.true(Boolean(meta02.find(element => element.content === 'https://2.jpg' && element.key === 'og:image:01')))
})

test('createMeta with array in openGraph.article.author', t => {
	const options = {...nuxtSeo.defaults}
	const inputMeta = [{lang: 'pt'}]
	const {template} = nuxtSeo

	options.openGraph = {
		article: {
			author: ['Tiago Danin', 'Danin Tiago']
		}
	}
	const meta = nuxtSeo.createMeta(options, inputMeta, template)

	t.true(Boolean(meta.find(element => element.content === 'Tiago Danin' && element.key === 'article:author:00')))
	t.true(Boolean(meta.find(element => element.content === 'Danin Tiago' && element.key === 'article:author:01')))
})

test('replace inputMeta with output of createMeta', t => {
	const options = {...nuxtSeo.defaults}
	const inputMeta = [
		{lang: 'pt'},
		{key: 'url', content: 'https://ddd.com'}
	]
	const {template} = nuxtSeo

	options.url = 'https://test.com'
	const meta = nuxtSeo.createMeta(options, inputMeta, template)

	t.true(Boolean(meta.find(element => element.content === 'https://test.com' && element.key === 'url')))
	t.false(Boolean(meta.find(element => element.content === 'https://ddd.com' && element.key === 'url')))
})

test('createMeta with noindex = true', t => {
	const options = {...nuxtSeo.defaults}
	const inputMeta = []
	const {template} = nuxtSeo

	options.noindex = true
	const meta = nuxtSeo.createMeta(options, inputMeta, template)

	t.true(Boolean(meta.find(element => element.content === 'index,follow' && element.key === 'robots')))
	t.true(Boolean(meta.find(element => element.content === 'index,follow' && element.key === 'googlebot')))
})
