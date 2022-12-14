import Container from 'react-bootstrap/Container'
import BookList from './Component/BookList'
import Forms from './Component/Forms'

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql'
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/graphql',
}));

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);
const client = new ApolloClient({
	link: splitLink,
	cache: new InMemoryCache()
})
function App() {
	console.log("Client",client);
	return (
		<ApolloProvider client={client} >
			<Container className='py-3 mt-3' style={{ backgroundColor: 'lightcyan' }}>
				<h1 className='text-center text-info mb-3'>My Books</h1>
				<hr />
				<Forms />
				<hr />
				<BookList />
			</Container>
		</ApolloProvider>
	)
}

export default App
