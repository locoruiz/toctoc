import axios from 'axios';

const api = () => {
    try {
        var datos = JSON.parse(localStorage['datosUsuarioTocToc']);
    } catch {

    }
    if (datos) {
        var isLoggedIn = datos.isLoggedIn;
        var token = datos.token;
    }
    const headers = isLoggedIn ? {'Authorization': 'Bearer '+token} : {}

    return axios.create({
        headers
    });
}

export default api;