import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client'
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { useEffect, useState } from 'react';
import { AppRegistry } from 'react-native';
import Book from './Component/book';
const httpLink = new HttpLink({
  uri: 'https://115f-116-108-0-84.ap.ngrok.io/graphql'
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://115f-116-108-0-84.ap.ngrok.io/graphql',
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


export default function App() {
  
  return (
    <ApolloProvider client={client} >
      <View style={styles.container}>
        <Book></Book>
        <StatusBar style="auto" />
      </View>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
