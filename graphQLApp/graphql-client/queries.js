import { gql } from '@apollo/client'

const getBooks = gql`
	query getBooksQuery {
		books {
			name
			id
		}
	}
`

const getSingleBook = gql`
	query getSingleBookQuery($id: ID!) {
		book(id: $id) {
			id
			name
			genre
			author {
				id
				name
				age
				books {
					id
					name
				}
			}
		}
	}
`

const getAuthors = gql`
	query getAuthorsQuery {
		authors {
			id
			name
		}
	}
`

const ADDNEWBOOK_SUBSCRIPTION = gql`
  subscription Subscription {
    newBook {
      name
	  id
    }
  }
`;
const ADDNEWAUTHOR_SUBSCRIPTION = gql`
  subscription Subscription {
    newAuthor {
      name
	  id
    }
  }
`;
export { getBooks, getSingleBook, getAuthors , ADDNEWBOOK_SUBSCRIPTION , ADDNEWAUTHOR_SUBSCRIPTION}
