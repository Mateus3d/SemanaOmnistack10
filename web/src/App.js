import React, { useState, useEffect } from 'react'; //useState => Função do react para criar um estado
import api from './services/api';

import './global.css';
import './App.css';
import './SideBar.css';
import './Main.css';

import './components/DevItem' //assim ele já pega o index automaticamente
import DevItem from './components/DevItem';
import DevForm from './components/DevForm';

function App() {
  const [devs, setDevs] = useState([]);//o estado "devs" inicia como array vazio

  
 
  
  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/devs');

      setDevs(response.data);
    }

    loadDevs();
  });

  async function handleAddDev(data) { /* Submit */

    const response = await api.post('/devs', data) //É oq vou enviar pro backend */

    

    setDevs([...devs, response.data]); //Isso é pra adicionar outro dev no array já q tem imutabilidade, senão sobrescreveria
  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={handleAddDev} />
      </aside>
      <main>
        <ul>
          {devs.map(dev => ( /* pra percorrer e fzr iteração */
            <DevItem key={dev._id} dev={dev}/> //São os quadros dos cadastrados
          ))}
          
        </ul>

      </main>
    </div>
  );
}

export default App;
