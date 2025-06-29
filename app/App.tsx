import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Homescreen from './src/screens/Homescreen';
import PlayerScreen from './src/screens/PlayerScreen';

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        // <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen
                name="Homescreen"
                component={Homescreen}
                options={{
                    title: 'SEEme Streamer'
                } } />
                <Stack.Screen name="PlayerScreen" component={PlayerScreen} />
        </Stack.Navigator>
        // </NavigationContainer>
    )
}

export default App