// const  { ApolloServer }  = require('apollo-server-express');
// const  {
//   ApolloServerPluginDrainHttpServer,
//   ApolloServerPluginLandingPageLocalDefault,
// } = require('apollo-server-core');
// const express = require('express');
// const http = require('http');
const mongoose = require('mongoose');
// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// // Connect to firebase 
// const serviceAccount = require('./graphql-66402-firebase-adminsdk-mcxxb-5ecac4f201.json')

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
  
// })
// // Connect to MongooseDb

const connectDB = async () => {
	try {
		await mongoose.connect('mongodb+srv://handez:1234@cluster0.u2jq8ul.mongodb.net/?retryWrites=true&w=majority')

		console.log('MongoDB connected')
	} catch (error) {
		console.log(error.message)
		process.exit(1)
	}
}

connectDB()

// load db methods
const mongoDataMethods = require('./data/db');

// async function startApolloServer(typeDefs, resolvers , mongoMethods) {
//   const app = express();
//   const httpServer = http.createServer(app);
//   const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//     context:() => ({
//       mongoMethods
//     }),
//     csrfPrevention: true,
//     cache: 'bounded',
//     plugins: [
//       ApolloServerPluginDrainHttpServer({ httpServer }),
//       ApolloServerPluginLandingPageLocalDefault({ embed: true }),
//     ],
//   });

//   await server.start();
//   server.applyMiddleware({ app });
//   await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
//   console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
// }
// Load schema & resolvers
const typeDefs = require('./schema/schema');
const resolvers = require('./resolver/resolver');


const { createServer } =  require("http");
const express =  require("express");
const { ApolloServer, gql } =  require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } =  require("apollo-server-core");
const { PubSub } =  require("graphql-subscriptions");
const { makeExecutableSchema } =  require("@graphql-tools/schema");
const { WebSocketServer } =  require("ws");
const { useServer } =  require("graphql-ws/lib/use/ws");

const PORT = 4000;



// Create schema, which will be used separately by ApolloServer and
// the WebSocket server.


// Create an Express app and HTTP server; we will attach the WebSocket
// server and the ApolloServer to this HTTP server.

async function startApolloServer(typeDefs, resolvers , mongoMethods) {
const schema = makeExecutableSchema({ typeDefs, resolvers });
const app = express();
const httpServer = createServer(app);

// Set up WebSocket server.
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});
const serverCleanup = useServer({ schema }, wsServer);

// Set up ApolloServer.
const  server =  new ApolloServer({
  schema,
  context:() => ({
          mongoMethods
        }),
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});
await server.start();
server.applyMiddleware({ app });
// Now that our HTTP server is fully set up, actually listen.
httpServer.listen(PORT, () => {
  console.log(
    `🚀 Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`
  );
  
});
}

startApolloServer(typeDefs,resolvers,mongoDataMethods)