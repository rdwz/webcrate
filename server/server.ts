import path from 'path'
import express from 'express'
import * as bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'

import routes from './router'
import { routeLog, sendResponse, disableCaching } from './middleware'
import log from './utils/log'

const app = express()

// Server Nuxt static files
app.use(express.static(path.join(__dirname, '../dist')))

app.use(routeLog)
app.use(sendResponse)

app.use(bodyParser.json())
app.use(compression())
app.use(cors())

// Disable caching for /, reference: https://www.notion.so/Turning-off-Caching-on-the-Root-9879ed9411a4486dbeaf4cc57697d610
app.use(disableCaching)

// Use router
app.use(routes)

// Redirect to Nuxt SPA
app.get('*', (_req, res, next) => {
	if (process.env.NODE_ENV === 'development') {
		next()
		return
	}

	res.sendFile(path.join(__dirname, '../dist', 'index.html'))
})

app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (!err) {
		return next()
	}

	let returnStatus
	if (err.name === 'HTTPError') {
		log.warn('Metdata parsing failed: ' + err.message)
		returnStatus = err.response.statusCode
	} else {
		log.fatal(err)
		returnStatus = typeof err === 'number' ? err : 400
	}

	const message = err.message || 'An unkown error ocurred, please try again.'

	res.fail(returnStatus, message)
})

export default app