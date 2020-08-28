import React, {useState, useEffect} from 'react'

function DevForm({onSubmit}){
    /* Armazenando dados do formulário no estado do componente */
  const [github_username, setGithubUsername] = useState('');
  const [techs, setTechs] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude} = position.coords;

        setLatitude(latitude);
        setLongitude(longitude);
      },
      (err) => {
        console.log(err);
      },
      {
        timeout: 30000,
      }
    )

  }, []);/* Toda vez q o valor do vetor for alterado, executa a função */

    async function handleSubmit(e){
        e.preventDefault(); /* pra evitar de mudar de tela */

        await onSubmit({
            github_username,
            techs,
            latitude,
            longitude
            });

        setGithubUsername(''); //Pra deixar os campos vazios dps q subir eles
        setTechs('');
    }

    return(
        <form onSubmit={handleSubmit}>
          <div className="input-block"> 
            <label htmlFor="github_username">Usuário do Github</label>
            <input 
              name="github_username" 
              id="github_username" 
              required
              value = {github_username}
              onChange = {e => setGithubUsername(e.target.value)}
            />
          </div>

          <div className="input-block"> 
            <label htmlFor="techs">Tecnologias</label>
            <input 
              name="techs" 
              id="techs" 
              required
              value = {techs}
              onChange = {e => setTechs(e.target.value)}
            />
          </div>

          <div className="input-group">
            <div className="input-block"> 
              <label htmlFor="latitude">Latitude</label>
              <input 
                type="number"
                 name="latitude"
                 id="latitude" 
                 required 
                 value={latitude}
                 onChange={e => setLatitude(e.target.value)} 
                />
            </div>

            <div className="input-block"> 
              <label htmlFor="longitude">Longitude</label>
              <input 
                type="number" 
                name="longitude" 
                id="longitude" 
                required 
                value={longitude}
                onChange={e => setLongitude(e.target.value)} /* Armazena o valor de um input dentro de um valor no estado */
              />
            </div>

          </div>

          <button type="submit">Salvar</button>       

        </form>
    );
}

export default DevForm;