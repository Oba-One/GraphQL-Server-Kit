/******************* 
DEPENDENCIES IMPORTS
********************/

// Enviromental Variables 
import dotenv from 'dotenv'

// Server  
import express from 'express'
import { ApolloServer, PubSub  } from 'apollo-server-express'

// GraphQL 
import typeDefs from './graphql/schema'
import resolvers from './graphql/resolvers'

// Middleware
import compression from 'compression' 
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'

// Http(s)
import fs from 'fs'
import https from 'https'
import http from 'http'
/******************************************************************
******************************************************************/


/******************** 
GRAPHQL SERVER SETUP 
********************/

// Http(s) Configurations 
const configurations = {
  // Note: You may need sudo to run on port 443
  production: { ssl: true, port: 443, hostname: 'example.com' },
  development: { ssl: false, port: 4000, hostname: 'localhost' }
}

const environment = process.env.NODE_ENV || 'production'
const config = configurations[environment]
/*****************************************************************/

// Apollo Server Init
const apollo = new ApolloServer({ typeDefs, resolvers })

// Express Server Init
const app = express()

// Apollo & Express Binding
apollo.applyMiddleware({ app })
/*****************************************************************/

// Morgan Logger Middleware
app.use(morgan("common"))

// Helmet Middleware
app.use(helmet())

// Cross Orgin Resource Sharing(CORS) Middleware
app.use(cors()) 

// Request Compression Middleware
app.use(compression());
/*****************************************************************/


// Create the HTTPS or HTTP server, per configuration
var server
if (config.ssl) {
  // Assumes certificates are in .ssl folder from package root. Make sure the files
  // are secured.
  server = https.createServer(
    {
      key: fs.readFileSync(`./ssl/${environment}/server.key`),
      cert: fs.readFileSync(`./ssl/${environment}/server.crt`)
    },
    app
  )
} else {
  server = http.createServer(app)
}
/*****************************************************************/


// Subscription Support
apollo.installSubscriptionHandlers(server)
/*****************************************************************/


// Server Start
server.listen({ port: config.port }, () =>
  console.log(
    '🚀 Server ready at',
    `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${apollo.graphqlPath}`
  )
)
/******************************************************************
******************************************************************/