import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import Navegacion from '../Navegacion/Navegacion';
import auth from '../../helpers/auth';

export default class Consejos extends Component {
  constructor(props) {
    super(props);
    const info = auth.getInfo()
    this.state = {
      cedula: info.cedula,
      nombre: info.nombre,
      apellido: info.apellido,
      consejos: [],
      redirect: false
    }
  }

  componentDidMount() {
    this.getCouncils();
  }

  getCouncils() {
    auth.verifyToken()
      .then(value => {
        if (value) {
          axios.get('/consejo')
            .then(res => {
              if (res.data.success) {
                this.setState({
                  consejos: res.data.councils
                });
              }
            })
            .catch((err) => console.log(err));
        } else {
          this.setState({
            redirect: true
          })
          auth.logOut();
        }
      })
      .catch((err) => console.log(err));
  }

  councilList() {
    const councils = [];
    for (let i = 0; i < this.state.consejos.length; i++) {
      let consecutivo = this.state.consejos[i].consecutivo;
      let institucion = this.state.consejos[i].institucion;
      let escuela = this.state.consejos[i].escuela;
      let consejo = this.state.consejos[i].nombre_consejo;
      let lugar = this.state.consejos[i].lugar;
      let fecha = this.state.consejos[i].fecha;
      let hora = this.state.consejos[i].hora;
      let id_tipo_sesion = this.state.consejos[i].id_tipo_sesion;
      councils.push(
        <div className="col-md-4 fila-mis-consejos" key={i}>
          <div className="card border-primary mb-3">
            <div className="card-body">
              <div className='d-flex justify-content-between align-items-center'>
                <p className="card-title m-0">{institucion}</p>
                <Link to={`/consejos/${consecutivo}`}><i className="far fa-eye fa-lg ml-2" style={{ color: "navy" }}></i></Link>
              </div>
              <p className='m-0'>{escuela}</p>
              <p className='m-0'>{consejo}</p>
              <p className='m-0'>Sesión {id_tipo_sesion === 1 ? 'Ordinaria' : 'Extraordinaria'} {consecutivo}</p>
              <p className='m-0'>Lugar: {lugar}</p>
              <p className='m-0'>Fecha: {fecha}</p>
              <p className='m-0'>Hora: {hora}</p>
            </div>
          </div>
        </div>
      );
    }
    return councils;
  }

  render() {
    return (this.state.redirect ? <Redirect to='/' /> :
      <>
        <Navegacion />
        <div className='container'>
          <h3>Il Consigliere</h3>
          <p className='lead mt-2'>Te damos la bienvenida {this.state.nombre} {this.state.apellido}</p>
          {this.state.consejos.length > 0 && <p className='text-center lead'>Consejos a los que te han convocado:</p>}
        </div>
        <div className="row m-0 mt-4">
          {this.state.consejos.length === 0 ? <p className='my-muted'>No tienes consejos próximos a asistir.</p> : this.councilList()}
        </div>
      </>
    );
  }
}