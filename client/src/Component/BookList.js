import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card'
import CardColumns from 'react-bootstrap/CardColumns'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import BookDetails from './BookDetails'
import { useSubscription } from '@apollo/client'
import { useQuery } from '@apollo/client'
import * as queries from '../graphql-client/queries'

const BookList = () => {
	const [bookSelected, setBookSelected] = useState(null)
	const {newBook , isLoading} = useSubscription(queries.ADDNEWBOOK_SUBSCRIPTION,{
		onSubscriptionData: (item) =>{
			setBooks([...listbooks,item.subscriptionData.data.newBook])
		}
	})
	
	const [listbooks,setBooks] = useState([]);
	const { loading, error, data } = useQuery(queries.getBooks)
	useEffect(()=>{
		if(data){
			setBooks(data.books)
		}
	},[data])
	
	if (loading) return <p>Loading books....</p>
	if (error) return <p>Error loading books!</p>
	
	return (
		<Row>
			<Col xs={8}>
				<CardColumns>
					{listbooks.map(book => (
						<Card
							border='info'
							text='info'
							className='text-center shadow'
							key={book.id}
							onClick={setBookSelected.bind(this, book.id)}
							style={{ cursor: 'pointer' }}
						>
							<Card.Body>{book.name}</Card.Body>
						</Card>
					))}
				</CardColumns>
			</Col>
			<Col>
				<BookDetails bookId={bookSelected} />
			</Col>
		</Row>
	)
}

export default BookList
