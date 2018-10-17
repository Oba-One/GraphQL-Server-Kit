/******************* 
DEPENDENCIES IMPORTS
********************/

// Enviromental Variables 
import dotenv from 'dotenv'

// Server  
import express from 'express'
import { ApolloServer } from 'apollo-server-express'

// GraphQL 
import typeDefs from './graphql/schema'
import resolvers from './graphql/resolvers'

// Middleware
import compression from 'compression' 
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
/******************************************************************/


/******************** 
GRAPHQL SERVER SETUP 
********************/

// Express Server Init
const app = express()

// Apollo Server Init
const apollo = new ApolloServer({ typeDefs, resolvers })


// Apollo & Express Binding
apollo.applyMiddleware({ app })

// Morgan Logger Middleware
app.use(morgan("common"))

// Helmet Middleware
app.use(helmet())

// Cross Orgin Resource Sharing(CORS) Middleware
app.use(cors()) 

// Request Compression Middleware
app.use(compression());

// Server Port
const port = 4000

// Server Start
app.listen( port, () =>
  console.log(
    `🚀 Server ready at http://localhost:${port}${apollo.graphqlPath}`
  )
)
/******************************************************************/