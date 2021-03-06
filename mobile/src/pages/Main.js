import React, {useState, useEffect} from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native'
import MapView, {Marker, Callout} from 'react-native-maps' 
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location'
import { MaterialIcons } from '@expo/vector-icons'

import api from '../services/api'
import {connect, disconnect, subscribeToNewDevs} from '../services/socket'

//TouchableOpacity é um botão q qnd clicado diminui a opacidade

//useEffect é pra usar um componente uma só vez qnd é montado em tela, se o [] tiver vazio
//useState é pra alterar uma var, [a var, a função q altera o var] = useState(valor inicial)
/*Callout É oq aparece qnd clica na img */
function Main({navigation}){ //navigation é um prop. q vem automática pra todas as pags
    const [devs, setDevs] = useState([]);
    const [currentRegion, setCurrentRegion] = useState(null);
    const [techs, setTechs] = useState('');

    //Pra carregar a pos inicial
    useEffect(()=>{
        async function loadInitialPosition() {
            const { granted } = await requestPermissionsAsync(); //o granted retorna true se o usuário der permissão

            if(granted){
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true,
                });

                const { latitude, longitude } = coords;

                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.04, //é um zoom
                    longitudeDelta: 0.04,
                })
            }
        }

        loadInitialPosition(); //Pra executar a função
    },[]);

    useEffect(() => {
        subscribeToNewDevs(dev => setDevs([...devs], dev));
    }, [devs]);

    function setupWebSocket() {
        disconnect();

        const {latitude, longitude} = currentRegion;

        connect(latitude, longitude, techs); //São informações q quero enviar pro websocket
    }

    async function loadDevs() {
        const {latitude,longitude} = currentRegion;

        const response = await api.get('/search', {
            params: {
                latitude,
                longitude,
                techs,
            }
        });

        setDevs(response.data.devs);
        setupWebSocket();

    }

    function handleRegionChanged(region) {
        setCurrentRegion(region);
    }

    if(!currentRegion){
        return null; //Se a posição for nula a função Main retorna null, pra ñ renderizar nada
    }

    return (
        <>
            <MapView 
                onRegionChangeComplete={handleRegionChanged} 
                initialRegion={currentRegion} 
                style={styles.map}
            >
            {devs.map(dev => (
                <Marker 
                    key = {dev._id}
                    coordinate= {{
                    latitude: dev.location.coordinates[1],
                    longitude: dev.location.coordinates[0]}}>
                <Image 
                    style={styles.avatar} 
                    source={{uri: dev.avatar_url}}
                />

                <Callout onPress={() => {
                    navigation.navigate('Profile', {github_username: dev.github_username})}
                    }>
                    <View style={styles.callout}>
                        <Text style={styles.devName}>{dev.name}</Text>
                        <Text style={styles.devBio}>{dev.bio}</Text>
                        <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                    </View>

                </Callout>
            </Marker>
            ))}
        </MapView>
            <View style={styles.searchForm}>
                <TextInput 
                    style={styles.searchInput} 
                    placeholder = "Buscar devs por techs..."
                    placeholderTextColor = '#999'
                    autoCapitalize = "words"
                    autoCorrect = {false}
                    value = {techs}
                    onChangeText = {setTechs}
                />

                <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
                    <MaterialIcons name='my-location' size={20} color='#FFF' />
                </TouchableOpacity>

            </View>
        </>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#fff'
    },
    callout: {
        width: 260,
        borderRadius: 50,
    },
    devName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    devBio: {
        color: '#666',
        marginTop: 5,
    },
    devTechs: {
        marginTop: 5,
    },
    searchForm: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row',
    },
    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#FFF',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4,
        },
        elevation: 2,
    },

    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: '#8e40ff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    },


})

export default Main;