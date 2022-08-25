const  { ApolloServer }  = require('apollo-server-express');
const  {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} = require('apollo-server-core');
const express = require('express');
const http = require('http');
const mongoose = require('mongoose')
// Connect to MongooseDb

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

async function startApolloServer(typeDefs, resolvers , mongoMethods) {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:() => ({
      mongoMethods
    }),
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  await server.start();
  server.applyMiddleware({ app });
  await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}
// Load schema & resolvers
const typeDefs = require('./schema/schema');
const resolvers = require('./resolver/resolver');
startApolloServer(typeDefs,resolvers,mongoDataMethods)
