import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import api from '../../api';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';
import whatsapp from '../../../assets/whatsapp.svg';
import 'react-phone-input-2/lib/style.css';
import ReactCodeInput from 'react-code-input';
import './estilo.css';

class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      formSubmitting: false,
      phone: '',
      code: '',
      name: '',
      tiempoRestante: 0,
      mostrarCodigo: false,
      nombreAnterior: ''
    };
  }

  timer = null;
  
  componentDidMount() {
    if (this.props.callback === undefined) {
      const { prevLocation } = this.props.redirect.state || { prevLocation: { pathname: '/' } };
      if (prevLocation && this.props.userStore.isLoggedIn) {
        this.props.history.push(prevLocation);
      }
    }
  }
  
  enviarCodigo = () => {
    if (this.state.phone && this.state.tiempoRestante === 0 && this.state.phone.trim().length > 8) {
      this.setState({tiempoRestante: 30, error: ''}); // 30 segundos para volver a pedir mensaje

      api().post('/api/createCode', {phone: this.state.phone}).then(res => {
        console.log(res.data);
        if (res.data.success) {
          // Codigo enviado correctamente
          //TODO: mostrar el input de codigo
          //TODO: mostrar el nombre si hace falta
          this.setState({mostrarCodigo: true, nombreAnterior: res.data.nombreAnterior});
        }
      }).catch(e => {
        let error = e;
        if (e.response && e.response.data) {
          error = e.response.data.message;
        }
        this.setState({error});
      });

      this.timer = setInterval(() => {
        let tiempo = this.state.tiempoRestante;
        tiempo--;
        if (tiempo <= 0) {
          clearTimeout(this.timer);
          this.timer = null;
          tiempo = 0;
        }
        this.setState({tiempoRestante: tiempo});
      }, 1000);
    }
  }

  cambiarNumero = (val) => {
    this.setState({phone: val});
  }

  cambiarCodigo = (val) => {
    this.setState({code: val});
  }

  cambioNombre = e => {
    this.setState({name: e.target.value});
  }
  
  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({formSubmitting: true, error: ''});
    let {phone, name, code} = this.state;
    let data = {phone, code};
    if (name && name.trim().length > 0) {
      data.name = name;
    }
    api().post("/api/login", data).then(json => {
        console.log(json);
         if (json.data.success) {
           json.data.isLoggedIn = true;
           this.props.userStore.actualizarDatos(json.data);
           if (this.props.callback) {
             this.props.callback()
           } else {
            try {
              var { prevLocation } = this.props.redirect.state;
            } catch {
               prevLocation = { pathname: '/direcciones' }
            }
            this.props.history.push(prevLocation);
           }
         }
         else {
            this.setState({error: json.data.message});
         }
    }).catch(error => {if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        let err = error.response.data;
        console.log(err);
        this.setState({
          error: err.message,
          formSubmitting: false
        })
      }
      else if (error.request) {
        // The request was made but no response was received `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js
        let err = error.request;
        console.log(err);
        this.setState({
          error: err,
          formSubmitting: false
        })
     } else {
       // Something happened in setting up the request that triggered an Error
       let err = error.message;
       this.setState({
         error: err,
         formSubmitting: false
       });
   }
 }).finally(this.setState({formSubmitting: false}));
}

render() {
  const { state = {} } = this.state;
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col style={{display: 'flex', justifyContent: 'center'}}>
          <div className='text-left' style={{maxWidth: '500px', }}>
            <h1>Ingresar</h1>
            {this.props.callback && <p>Para continuar debe ingresar al sistema</p>}
              <Form onSubmit={this.handleSubmit}>
                <label><img src={whatsapp} style={{opacity: '30%'}}/> Introduzca un número de celular con WhatsApp</label>
                <Row className='gy-5'>
                  <Col xs={12} md={8}>
                    <PhoneInput 
                      placeholder='Introduzca su celular' 
                      value={this.state.phone} 
                      onChange={this.cambiarNumero}
                      country={'bo'}
                      preferredCountries={['bo', 'es']}
                      buttonStyle={{borderRadius: '30px 0px 0px 30px', paddingLeft: '10px'}}
                      inputStyle={{borderRadius: '30px', width: '100%', paddingLeft: '60px'}}
                    />
                  </Col>
                  <Col xs={12} md={4} className='text-right pl-md-0 pt-3 pt-md-0'>
                    <Button 
                      variant="secondary"
                      disabled={this.state.tiempoRestante > 0 || this.state.phone === undefined || this.state.phone.length < 6}
                      onClick={this.enviarCodigo}
                      style={{whiteSpace: 'nowrap', width: '100%'}}
                      >
                      Solicitar código
                    </Button>
                    {
                      this.state.tiempoRestante > 0 &&
                      <Form.Text className="text-muted">
                        Podrá solicitar otro código en {this.state.tiempoRestante} segundos
                      </Form.Text>
                    }
                  </Col>
                </Row>
                
                {
                  this.state.mostrarCodigo && this.state.nombreAnterior === '' &&
                  <Form.Group>
                    <Form.Label>Nombre completo</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Introduzca su nombre" 
                      value={this.state.name} 
                      onChange={this.cambioNombre} 
                      style={{borderRadius: '30px'}}
                      />
                  </Form.Group>
                }
                {
                  this.state.mostrarCodigo && this.state.nombreAnterior !== '' &&
                  <Alert variant='success' className='mt-3'>Bienvenido {this.state.nombreAnterior}</Alert>
                }
                {
                  this.state.mostrarCodigo &&
                  <>
                    <label>Introduzca el codigo</label><br/>
                    <div className='text-center'>
                    <ReactCodeInput 
                        type='number' 
                        fields={4}
                        value={this.state.code} 
                        onChange={this.cambiarCodigo} 
                        />
                    </div>
                  </>
                }
                {
                  this.state.mostrarCodigo &&
                  <Button className='btn-rounded mt-3' variant='primary' type='submit' block disabled={this.state.formSubmitting || this.state.code === '' || this.state.code === undefined}>
                    {
                      this.props.callback === undefined ? "Ingresar" : "Continuar"
                    }
                  </Button>
                }
                {
                  this.state.error !== '' &&
                  <Alert variant='danger' className='mt-2'>{this.state.error}</Alert>
                }
              </Form>
          </div>
        </Col>
      </Row>
      
    </Container>
    );
  }
}
export default inject('userStore')(withRouter(observer(LoginContainer)));