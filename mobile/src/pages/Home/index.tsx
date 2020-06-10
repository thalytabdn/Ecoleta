import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Text, Image, StyleSheet, ToastAndroid ,KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import PickerSelect from 'react-native-picker-select';

interface IBGEUFResponse {
    sigla: string;
    nome: string;
}

interface IBGECityResponse {
    nome: string;
}

interface Data {
    label: string;
    value: string;
}

const Home = () => {
    const [ufs, setUfs] = useState<Data[]>([]);
    const [cities, setCities] = useState<Data[]>([]);

    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');

    const navigation = useNavigation();

    function handleNavigateToPoints() {

        if(selectedUf.includes('0')){
            Alert.alert('Aviso','O Estado deve ser selecionado.');
            return;
        }

        if (selectedCity.includes('0')) {
            Alert.alert('Aviso','A cidade deve ser selecionada.');
            return;
        }

        navigation.navigate('Points', {
            uf: selectedUf,
            city: selectedCity
        });
    }


    useEffect(() => {
        axios
            .get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
            .then(response => {
                const ufData = response.data.map(uf => (
                    {
                        key: uf.sigla,
                        label: uf.nome,
                        value: uf.sigla
                    }
                ));
                setUfs(ufData);                
            });
    }, [])

    useEffect(() => {

        if (selectedUf === '0') {
            return;
        }

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                const cityNames = response.data.map(city => (
                    {
                        key: city.nome,
                        label: city.nome,
                        value: city.nome
                    }
                ));
                setCities(cityNames);                
            });

    }, [selectedUf]);

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ImageBackground
                source={require('../../assets/home-background.png')}
                style={styles.container}
                imageStyle={{ width: 274, height: 368 }}
            >
                <View style={styles.main}>
                    <Image source={require('../../assets/logo.png')} />
                    <View>
                        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <PickerSelect
                        onValueChange={(value) => setSelectedUf(value)}
                        items={ufs}
                        placeholder={{ label: "Selecione o Estado" }}
                        style={pickerSelectStyles}
                    />

                    <PickerSelect
                        onValueChange={(value) => setSelectedCity(value)}
                        items={cities}
                        placeholder={{ label: "Selecione a Cidade" }}
                        style={pickerSelectStyles}
                    />

                    <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                        <View style={styles.buttonIcon}>
                            <Icon name="arrow-right" color="#FFF" size={24} />
                        </View>
                        <Text style={styles.buttonText}>Entrar</Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },

    footer: {},
   
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },
    inputAndroid: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },
});


export default Home;