import { makeAutoObservable } from 'mobx';
import api from '../api';

class UserStore {
    constructor() {
        makeAutoObservable(this);
        try {
            var datos = JSON.parse(localStorage['datosUsuarioTocToc']);
            console.log(datos);
        } catch (e) {
            console.log(e);
        }
        if (datos) {
            this.isLoggedIn = datos.isLoggedIn;
            this.user = datos.user;
            this.token = datos.token;
            this.direcciones = datos.direcciones;
        }
    }
    isLoggedIn = false;
    user = undefined;
    token = undefined;
    direcciones = [];

    actualizarDatos(datos) {
        try {
            this.isLoggedIn = datos.isLoggedIn;
            this.user = datos.user;
            this.token = datos.token;
            this.direcciones = datos.direcciones.map(item => ({
                descripcion: item.description,
                direccion: item.direction,
                latitud: item.latitud,
                longitud: item.longitud
            }));
        } catch (e) {
            console.log(e);
        }
        localStorage['datosUsuarioTocToc'] = JSON.stringify(datos);
    }

    actualizarDirecciones(dir) {
        this.direcciones = dir;
        try {
            var datos = JSON.parse(localStorage['datosUsuarioTocToc']);
            datos.direcciones = dir;
            localStorage['datosUsuarioTocToc'] = JSON.stringify(datos);
        } catch (e) {
            console.log(e);
        }
    }

    logOut() {
        api().post('/api/logout').then(res => {
            console.log(res.data);
        })
        .catch(e => {
            console.log(e.response);
        })
        .finally(() => {
            this.actualizarDatos({
                isLoggedIn: false
            });
        });
    }
}

export default UserStore;