// Import GQL to handle the new format of client-side query definitions
import { gql } from "@apollo/client";

// Facilitate client-side interaction with the "me" query
export const ME_QUERY = gql`
    query me_query {
        me {
            _id
            username
            email
            savedBooks {
                bookId
                authors
                description
                image
                link
                title
            }
        }

    }
`;
