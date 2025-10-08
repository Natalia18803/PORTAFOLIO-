
        // Variables globales
        let mesas = [];
        let reservas = [];
        let mesaEditando = null;
        let reservaEditando = null;
        let filtroFecha = '';
        let filtroEstado = '';

        // Mapeo de ocasiones a imágenes (con URLs de respaldo de Picsum)
        const imagenesOcasion = {
            'Ninguna': '',
            'Cumpleaños': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-ck0DkLwjDUnidOTsPpIyECmY0ViyjpsA5A&s',
            'Aniversario': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-ck0DkLwjDUnidOTsPpIyECmY0ViyjpsA5A&s',
            'Reunión de Negocios': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIg4n9ZwTlyq1auZ1oF3qdnkgImIx5oiUFVA&s',
            'Cena Romántica': 'https://media.istockphoto.com/id/1718783170/es/foto/primer-plano-de-dos-personas-tintineando-copas-de-vino-en-la-mesa-de-la-cena.jpg?s=612x612&w=0&k=20&c=hZrQASyabHhCvRXq_qPcOXJdwR8PfOAFPJTntzF0I7o=',
            'Celebración Familiar': 'https://www.esmental.com/wp-content/uploads/2023/12/shutterstock_2198374269.jpg',
            'Evento Corporativo': 'https://www.agenciabloody.com/wp-content/uploads/2023/11/que-es-un-evento-corporativo.jpg',
            'Despedida de Soltero/a': 'https://cdn0.matrimonio.com.co/article-gallery-o/00000/3_2/960/jpg/articulos-a-fotos/amigos-familia-damas-gente/amigos-celebrando.jpeg',
            'Graduación': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiMXoigXJQX8bLxE_zuGEujzI3eaAVmTcbSQ&s'
        };

        // Inicialización
        document.addEventListener('DOMContentLoaded', function() {
            inicializarDatos();
            cargarMesas();
            cargarReservasTabla();
            establecerFechaMinima();
            
            // Cambiar a la pestaña de reservas si hay un hash en la URL
            if (window.location.hash === '#reservas') {
                const tab = new bootstrap.Tab(document.getElementById('reservas-tab'));
                tab.show();
            }
        });

        /*Actualizar vista previa de la ocasión
     //   function actualizarVistaPreviaOcasion() {
      //      const selectOcasion = document.getElementById('reservaOcasion');
      //      const imagenPrevia = document.getElementById('vistaPreviaOcasion');
      //      const opcionSeleccionada = selectOcasion.options[selectOcasion.selectedIndex];
            const urlImagen = opcionSeleccionada.getAttribute('data-imagen');
            
            if (urlImagen) {
                imagenPrevia.src = urlImagen;
                imagenPrevia.style.display = 'block';
                // Agregar manejo de error por si la imagen no carga
                imagenPrevia.onerror = function() {
                    this.style.display = 'none';
                };
            } else {
                imagenPrevia.style.display = 'none';
            }
        }*/

        // Establecer fecha mínima para reservas (hoy)
        function establecerFechaMinima() {
            const hoy = new Date().toISOString().split('T')[0];
            document.getElementById('reservaFecha').min = hoy;
        }

        // Inicializar datos en localStorage si no existen
        function inicializarDatos() {
            if (!localStorage.getItem('mesas')) {
                const mesasIniciales = [
                    { id: 'mesa1', capacidad: 2, ubicacion: 'Ventana', estado: 'disponible' },
                    { id: 'mesa2', capacidad: 4, ubicacion: 'Ventana', estado: 'disponible' },
                    { id: 'mesa3', capacidad: 6, ubicacion: 'Centro', estado: 'disponible' },
                    { id: 'mesa4', capacidad: 4, ubicacion: 'Jardín', estado: 'disponible' },
                    { id: 'mesa5', capacidad: 2, ubicacion: 'Jardín', estado: 'disponible' },
                    { id: 'mesa6', capacidad: 8, ubicacion: 'Terraza', estado: 'deshabilitada' }
                ];
                localStorage.setItem('mesas', JSON.stringify(mesasIniciales));
            }

            if (!localStorage.getItem('reservas')) {
                // Crear algunas reservas de ejemplo con imágenes
                const reservasIniciales = [
                    {
                        idReserva: 'reserva1',
                        nombreCliente: 'Juan Pérez',
                        numeroPersonas: 4,
                        fechaReserva: new Date().toISOString().split('T')[0],
                        horaReserva: '14:00',
                        ocasionEspecial: 'Cumpleaños',
                        notasAdicionales: 'Es el cumpleaños de mi hijo',
                        idMesaAsignada: 'mesa2',
                        estado: 'Confirmada'
                    },
                    {
                        idReserva: 'reserva2',
                        nombreCliente: 'María García',
                        numeroPersonas: 2,
                        fechaReserva: new Date().toISOString().split('T')[0],
                        horaReserva: '20:00',
                        ocasionEspecial: 'Cena Romántica',
                        notasAdicionales: 'Queremos una mesa tranquila',
                        idMesaAsignada: 'mesa1',
                        estado: 'Pendiente'
                    }
                ];
                localStorage.setItem('reservas', JSON.stringify(reservasIniciales));
            }

            mesas = JSON.parse(localStorage.getItem('mesas'));
            reservas = JSON.parse(localStorage.getItem('reservas'));
        }

        // Cargar mesas en el plano
        function cargarMesas() {
            const contenedorMesas = document.getElementById('plano-mesas');
            contenedorMesas.innerHTML = '';

            mesas.forEach(mesa => {
                const claseEstado = `mesa-${mesa.estado}`;
                const card = document.createElement('div');
                card.className = 'col';
                card.innerHTML = `
                    <div class="card h-100 mesa-card ${claseEstado}">
                        <div class="card-body">
                            <h5 class="card-title">${mesa.id}</h5>
                            <p class="card-text">
                                <strong>Capacidad:</strong> ${mesa.capacidad} personas<br>
                                <strong>Ubicación:</strong> ${mesa.ubicacion}<br>
                                <strong>Estado:</strong> ${mesa.estado}
                            </p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-sm btn-outline-light" onclick="editarMesa('${mesa.id}')">
                                <i class="bi bi-pencil"></i> Editar
                            </button>
                            <button class="btn btn-sm btn-light" onclick="reservarMesa('${mesa.id}')">
                                <i class="bi bi-journal-plus"></i> Reservar
                            </button>
                            <button class="btn btn-sm btn-outline-light" onclick="eliminarMesa('${mesa.id}')">
                                <i class="bi bi-trash"></i> Eliminar
                            </button>
                        </div>
                    </div>
                `;
                contenedorMesas.appendChild(card);
            });
        }

        // Cargar reservas en la tabla
        function cargarReservasTabla() {
            const tablaReservas = document.getElementById('tablaReservas').getElementsByTagName('tbody')[0];
            const sinReservas = document.getElementById('sin-reservas');
            tablaReservas.innerHTML = '';

            let reservasFiltradas = reservas;

            // Aplicar filtros si existen
            if (filtroFecha) {
                reservasFiltradas = reservasFiltradas.filter(reserva => reserva.fechaReserva === filtroFecha);
            }

            if (filtroEstado) {
                reservasFiltradas = reservasFiltradas.filter(reserva => reserva.estado === filtroEstado);
            }

            if (reservasFiltradas.length === 0) {
                sinReservas.classList.remove('d-none');
                return;
            }
            
            sinReservas.classList.add('d-none');

            reservasFiltradas.forEach(reserva => {
                const mesa = mesas.find(m => m.id === reserva.idMesaAsignada) || { id: 'No asignada', ubicacion: 'N/A' };
                
                // Determinar clase CSS para el estado
                let estadoClase = '';
                switch(reserva.estado) {
                    case 'Pendiente': estadoClase = 'bg-warning'; break;
                    case 'Confirmada': estadoClase = 'bg-primary'; break;
                    case 'Cancelada': estadoClase = 'bg-danger'; break;
                    case 'Finalizada': estadoClase = 'bg-success'; break;
                    case 'No Show': estadoClase = 'bg-secondary'; break;
                }
                
                // Obtener imagen para la ocasión con manejo de errores
                const imagenOcasion = reserva.ocasionEspecial && reserva.ocasionEspecial !== 'Ninguna' 
                    ? `<img src="${imagenesOcasion[reserva.ocasionEspecial]}" alt="${reserva.ocasionEspecial}" 
                         class="imagen-ocasion" onerror="this.style.display='none'">` 
                    : '';
                
                const fila = tablaReservas.insertRow();
                fila.innerHTML = `
                    <td>${reserva.nombreCliente}</td>
                    <td>${reserva.numeroPersonas}</td>
                    <td>${reserva.fechaReserva}</td>
                    <td>${reserva.horaReserva}</td>
                    <td>${mesa.id} (${mesa.ubicacion})</td>
                    <td class="ocasion-cell">
                        ${imagenOcasion}
                        ${reserva.ocasionEspecial || 'Ninguna'}
                    </td>
                    <td><span class="badge estado-badge ${estadoClase}">${reserva.estado}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary acciones-btn" onclick="editarReserva('${reserva.idReserva}')">
                            <i class="bi bi-pencil"></i>
                        </button>
                        ${reserva.estado !== 'Finalizada' ? `
                        <button class="btn btn-sm btn-success acciones-btn" onclick="pagarReserva('${reserva.idReserva}')">
                            <i class="bi bi-currency-dollar"></i>
                        </button>
                        ` : ''}
                        <button class="btn btn-sm btn-outline-danger acciones-btn" onclick="eliminarReserva('${reserva.idReserva}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                `;
            });
        }

        // Mostrar modal para nueva mesa
        function mostrarModalMesa() {
            mesaEditando = null;
            document.getElementById('modalMesaTitulo').textContent = 'Nueva Mesa';
            document.getElementById('formMesa').reset();
            document.getElementById('mesaId').value = '';
            
            const modal = new bootstrap.Modal(document.getElementById('modalMesa'));
            modal.show();
        }

        // Editar una mesa existente
        function editarMesa(id) {
            const mesa = mesas.find(m => m.id === id);
            if (!mesa) return;
            
            mesaEditando = mesa;
            document.getElementById('modalMesaTitulo').textContent = 'Editar Mesa';
            document.getElementById('mesaId').value = mesa.id;
            document.getElementById('mesaNombre').value = mesa.id;
            document.getElementById('mesaCapacidad').value = mesa.capacidad;
            document.getElementById('mesaUbicacion').value = mesa.ubicacion;
            document.getElementById('mesaEstado').value = mesa.estado;
            
            const modal = new bootstrap.Modal(document.getElementById('modalMesa'));
            modal.show();
        }

        function guardarMesa() {
    const id = document.getElementById('mesaId').value;
    const nombre = document.getElementById('mesaNombre').value;
    const capacidad = parseInt(document.getElementById('mesaCapacidad').value);
    const ubicacion = document.getElementById('mesaUbicacion').value;
    const estado = document.getElementById('mesaEstado').value;
    
    if (!nombre || !capacidad || !ubicacion) {
        const modal = new bootstrap.Modal(document.getElementById('modalCampos'));
        modal.show();
        return;
    }
    
    if (mesaEditando) {
        // Actualizar mesa existente
        const index = mesas.findIndex(m => m.id === mesaEditando.id);
        if (index !== -1) {
            mesas[index] = {
                id: nombre,
                capacidad: capacidad,
                ubicacion: ubicacion,
                estado: estado
            };
        }
    } else {
        // Crear nueva mesa
        // Verificar si ya existe una mesa con ese ID
        if (mesas.some(m => m.id === nombre)) {
            const modal = new bootstrap.Modal(document.getElementById('modalMesaDuplicada'));
            modal.show();
            return;
        }
        
        mesas.push({
            id: nombre,
            capacidad: capacidad,
            ubicacion: ubicacion,
            estado: estado
        });
    }
    
    // Guardar en localStorage
    localStorage.setItem('mesas', JSON.stringify(mesas));
    
    // Cerrar modal y actualizar vista
    bootstrap.Modal.getInstance(document.getElementById('modalMesa')).hide();
    cargarMesas();
}

function eliminarMesa(id) {
    // Configurar el evento de confirmación
    document.getElementById('btnConfirmarEliminar').onclick = function() {
        eliminarMesaConfirmada(id);
    };
    
    // Mostrar modal de confirmación
    const modal = new bootstrap.Modal(document.getElementById('modalConfirmarEliminar'));
    modal.show();
}

function eliminarMesaConfirmada(id) {
    // Verificar si la mesa tiene reservas activas
    const tieneReservas = reservas.some(r => r.idMesaAsignada === id && 
        (r.estado === 'Pendiente' || r.estado === 'Confirmada'));
    
    if (tieneReservas) {
        alert('No se puede eliminar la mesa porque tiene reservas activas.');
        return;
    }
    
    // Eliminar la mesa
    mesas = mesas.filter(m => m.id !== id);
    localStorage.setItem('mesas', JSON.stringify(mesas));
    
    // Actualizar vista
    cargarMesas();
}
        // Iniciar reserva para una mesa específica
        function reservarMesa(id) {
            const mesa = mesas.find(m => m.id === id);
            if (!mesa || mesa.estado !== 'disponible') {
                alert('Esta mesa no está disponible para reservar.');
                return;
            }
            
            mostrarModalReserva();
            document.getElementById('reservaMesa').value = id;
        }

        // Mostrar modal para nueva reserva
        function mostrarModalReserva() {
            reservaEditando = null;
            document.getElementById('modalReservaTitulo').textContent = 'Nueva Reserva';
            document.getElementById('formReserva').reset();
            document.getElementById('reservaId').value = '';
            document.getElementById('reservaEstado').value = 'Pendiente';
            document.getElementById('vistaPreviaOcasion').style.display = 'none';
            
            // Cargar mesas disponibles en el selector
            const selectorMesas = document.getElementById('reservaMesa');
            selectorMesas.innerHTML = '<option value="">Seleccione una mesa</option>';
            
            mesas.filter(mesa => mesa.estado === 'disponible').forEach(mesa => {
                const option = document.createElement('option');
                option.value = mesa.id;
                option.textContent = `${mesa.id} (Capacidad: ${mesa.capacidad}, Ubicación: ${mesa.ubicacion})`;
                selectorMesas.appendChild(option);
            });
            
            const modal = new bootstrap.Modal(document.getElementById('modalReserva'));
            modal.show();
        }

        // Editar una reserva existente
        function editarReserva(id) {
            const reserva = reservas.find(r => r.idReserva === id);
            if (!reserva) return;
            
            reservaEditando = reserva;
            document.getElementById('modalReservaTitulo').textContent = 'Editar Reserva';
            document.getElementById('reservaId').value = reserva.idReserva;
            document.getElementById('reservaNombre').value = reserva.nombreCliente;
            document.getElementById('reservaPersonas').value = reserva.numeroPersonas;
            document.getElementById('reservaFecha').value = reserva.fechaReserva;
            document.getElementById('reservaHora').value = reserva.horaReserva;
            document.getElementById('reservaOcasion').value = reserva.ocasionEspecial || 'Ninguna';
            document.getElementById('reservaNotas').value = reserva.notasAdicionales || '';
            document.getElementById('reservaEstado').value = reserva.estado;
            
            // Actualizar vista previa de la ocasión
            actualizarVistaPreviaOcasion();
            
            // Cargar mesas en el selector
            const selectorMesas = document.getElementById('reservaMesa');
            selectorMesas.innerHTML = '<option value="">Seleccione una mesa</option>';
            
            mesas.forEach(mesa => {
                const option = document.createElement('option');
                option.value = mesa.id;
                option.textContent = `${mesa.id} (Capacidad: ${mesa.capacidad}, Ubicación: ${mesa.ubicacion})`;
                option.selected = mesa.id === reserva.idMesaAsignada;
                selectorMesas.appendChild(option);
            });
            
            const modal = new bootstrap.Modal(document.getElementById('modalReserva'));
            modal.show();
        }

        // Guardar reserva (crear o actualizar)
        function guardarReserva() {
            const id = document.getElementById('reservaId').value;
            const nombre = document.getElementById('reservaNombre').value;
            const personas = parseInt(document.getElementById('reservaPersonas').value);
            const fecha = document.getElementById('reservaFecha').value;
            const hora = document.getElementById('reservaHora').value;
            const mesaId = document.getElementById('reservaMesa').value;
            const ocasion = document.getElementById('reservaOcasion').value;
            const notas = document.getElementById('reservaNotas').value;
            const estado = document.getElementById('reservaEstado').value;
            
            // Validaciones
if (!nombre || !personas || !fecha || !hora || !mesaId) {
    $('#modalCampos').modal('show');
    return;
}

            
            if (personas <= 0) {
                alert('El número de personas debe ser mayor que cero.');
                return;
            }
            
            const fechaReserva = new Date(fecha);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            
            if (fechaReserva < hoy) {
                alert('La fecha de reserva debe ser posterior a la fecha actual.');
                return;
            }
            
            const horaNum = parseInt(hora.split(':')[0]);
            if (horaNum < 8 || horaNum > 20) {
                alert('La hora de reserva debe estar entre las 8:00 AM y las 8:00 PM.');
                return;
            }
            
            // Verificar si la mesa está disponible
            const mesa = mesas.find(m => m.id === mesaId);
            if (!mesa || mesa.estado !== 'disponible') {
                alert('La mesa seleccionada no está disponible.');
                return;
            }
            
            // Verificar si la mesa ya tiene una reserva en la misma fecha y hora
            const reservaExistente = reservas.find(r => 
                r.idMesaAsignada === mesaId && 
                r.fechaReserva === fecha && 
                r.horaReserva === hora &&
                r.idReserva !== id && // Excluir la reserva actual si estamos editando
                (r.estado === 'Pendiente' || r.estado === 'Confirmada')
            );
            
            if (reservaExistente) {
                alert('La mesa ya tiene una reserva activa para esa fecha y hora.');
                return;
            }
            
            if (reservaEditando) {
                // Actualizar reserva existente
                const index = reservas.findIndex(r => r.idReserva === reservaEditando.idReserva);
                if (index !== -1) {
                    reservas[index] = {
                        idReserva: reservaEditando.idReserva,
                        nombreCliente: nombre,
                        numeroPersonas: personas,
                        fechaReserva: fecha,
                        horaReserva: hora,
                        ocasionEspecial: ocasion === 'Ninguna' ? '' : ocasion,
                        notasAdicionales: notas,
                        idMesaAsignada: mesaId,
                        estado: estado
                    };
                }
            } else {
                // Crear nueva reserva
                const nuevoId = 'reserva' + (reservas.length + 1);
                reservas.push({
                    idReserva: nuevoId,
                    nombreCliente: nombre,
                    numeroPersonas: personas,
                    fechaReserva: fecha,
                    horaReserva: hora,
                    ocasionEspecial: ocasion === 'Ninguna' ? '' : ocasion,
                    notasAdicionales: notas,
                    idMesaAsignada: mesaId,
                    estado: estado
                });
                
                // Cambiar el estado de la mesa a ocupada
                const mesaIndex = mesas.findIndex(m => m.id === mesaId);
                if (mesaIndex !== -1) {
                    mesas[mesaIndex].estado = 'ocupada';
                    localStorage.setItem('mesas', JSON.stringify(mesas));
                }
            }
            
            // Guardar en localStorage
            localStorage.setItem('reservas', JSON.stringify(reservas));
            
            // Cerrar modal y actualizar vista
            bootstrap.Modal.getInstance(document.getElementById('modalReserva')).hide();
            cargarMesas();
            cargarReservasTabla();
        }

        // Pagar una reserva (cambiar estado a Finalizada y liberar mesa)
        function pagarReserva(id) {
            const reserva = reservas.find(r => r.idReserva === id);
            if (!reserva) return;
            
            if (!confirm('¿Marcar esta reserva como pagada y finalizada?')) return;
            
            // Cambiar estado de la reserva
            reserva.estado = 'Finalizada';
            
            // Liberar la mesa
            const mesaIndex = mesas.findIndex(m => m.id === reserva.idMesaAsignada);
            if (mesaIndex !== -1) {
                mesas[mesaIndex].estado = 'disponible';
                localStorage.setItem('mesas', JSON.stringify(mesas));
            }
            
            // Guardar cambios
            localStorage.setItem('reservas', JSON.stringify(reservas));
            
            // Actualizar vista
            cargarMesas();
            cargarReservasTabla();
        }

        // Eliminar una reserva
        function eliminarReserva(id) {
            if (!confirm('¿Está seguro de que desea eliminar esta reserva?')) return;
            
            const reserva = reservas.find(r => r.idReserva === id);
            if (!reserva) return;
            
            // Si la reserva está activa, liberar la mesa
            if (reserva.estado === 'Pendiente' || reserva.estado === 'Confirmada') {
                const mesaIndex = mesas.findIndex(m => m.id === reserva.idMesaAsignada);
                if (mesaIndex !== -1) {
                    mesas[mesaIndex].estado = 'disponible';
                    localStorage.setItem('mesas', JSON.stringify(mesas));
                }
            }
            
            // Eliminar la reserva
            reservas = reservas.filter(r => r.idReserva !== id);
            localStorage.setItem('reservas', JSON.stringify(reservas));
            
            // Actualizar vista
            cargarMesas();
            cargarReservasTabla();
        }

        // Aplicar filtros a las reservas
        function aplicarFiltros() {
            filtroFecha = document.getElementById('filtroFecha').value;
            filtroEstado = document.getElementById('filtroEstado').value;
            cargarReservasTabla();
        }
   
