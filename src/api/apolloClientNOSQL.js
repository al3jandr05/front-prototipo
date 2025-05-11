import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: 'http://localhost:9090/graphql',
    credentials: 'include' // Esto es crucial para CORS con credenciales
});

const authLink = setContext((_, { headers }) => {
    // Obtener el token y bearer del localStorage
    const token = localStorage.getItem('token');
    const bearer = localStorage.getItem('bearer');


    return {
        headers: {
            ...headers,
            authorization: bearer && token ? `${bearer} ${token}` : "",
        }
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
        },
    }
});

export default client;