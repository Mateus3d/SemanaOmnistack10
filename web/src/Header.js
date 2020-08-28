import React from 'react';

function Header(props){ //props é o parametro, propriedade usada qnd chama essa func como html
    return <h1>{props.title}</h1>//Pra introduzir conteudo js, usa {}
}

export default Header;