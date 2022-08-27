import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useQuery, useSubscription,gql } from '@apollo/client'
import * as queries from '../graphql-client/queries'
const book = () => {
    type listBooks = {
        name: String,
        id: String,
    }
    const [bookSelected, setBookSelected] = useState(null)
	useSubscription(queries.ADDNEWBOOK_SUBSCRIPTION,{
		onSubscriptionData: (item) =>{
			setBooks([...listbooks,item.subscriptionData.data.newBook])
		}
	})
	const getBooks = gql`
	query getBooksQuery {
		books {
			name
			id
		}
	}
    `
	const [listbooks,setBooks] = useState([]);
	const { loading, error, data } = useQuery(getBooks);
	useEffect(()=>{
		if(data){
			setBooks(data.books)
            console.log(data);
		}
	},[data])
  return (
    <View>
      <Text>book</Text>
        {listbooks.map(book => <Text>{book.name}</Text>)}
    </View>
  )
}

export default book