import { NavigationContainer } from '@react-navigation/native';
import MainStack from './src/navigators/MainStack';
import { Provider } from 'react-redux';
import store from './store';
// import { ApolloClient } from '@apollo/client';
// import client from './src/config/client';

export default function App() {
  return (
    // <ApolloProvider client={client} >
    <NavigationContainer>
      <Provider store={store}>
        <MainStack />
      </Provider>
    </NavigationContainer>
    // {/* </ApolloProvider> */}
  );
}
