// js/script.js
document.addEventListener('DOMContentLoaded', function() {
    // --- CONSTANTES Y DATOS ---
    const precioBase = 3500000;
    const recargosColor = {
        blanco: 0,
        negro: 800000,
        rojo: 400000
    };
    const preciosAdicionales = {
        addNeblineros: { nombre: "Neblineros", valor: 80000 },
        addPortaequipaje: { nombre: "Portaequipaje", valor: 350000 },
        addMascotas: { nombre: "Cinturones y arnés para mascotas", valor: 50000 },
        addLucesLed: { nombre: "Luces LED", valor: 70000 },
        addCamaraTrasera: { nombre: "Cámara trasera", valor: 100000 }
    };

    // --- ELEMENTOS DOM ---
    const imgAuto = document.getElementById('imagenAuto');
    const opcionesColor = document.querySelectorAll('input[name="colorOpciones"]');
    const checkaAdicionales = document.querySelectorAll('.adicional');

    const resumenColor = document.getElementById('resumenColor');
    const detalleRecargoColorEl = document.getElementById('detalleRecargoColor'); 
    const resumenAdicionales = document.getElementById('resumenAdicionales');
    const valorFinal = document.getElementById('valorFinal');
    const btnComprar = document.getElementById('btnComprar');

    // --- ESTADO ACTUAL ---
    let colorSeleccionado = 'blanco';
    let adicionalesSeleccionadosParaAlerta = [];

    // --- FUNCIONES ---
    function actualizarImagen() {
        const nuevaRutaImagen = `imagenes/auto-${colorSeleccionado}.jpg`;
        imgAuto.src = nuevaRutaImagen;
        imgAuto.alt = `Automóvil El Veloz color ${colorSeleccionado}`;
        console.log("Color cambiado a:", colorSeleccionado, "Nueva imagen intentada:", nuevaRutaImagen);
        imgAuto.onerror = function() {
            this.onerror = null;
            this.src = 'https://placehold.co/600x400/CCCCCC/000000?text=Imagen+no+disponible';
            this.alt = 'Error al cargar la imagen del automóvil';
            console.error("Error al cargar la imagen:", nuevaRutaImagen);
        };
    }

    function calcularYMostrarTotal() {
        let precioTotal = precioBase;
        let textoDetalleRecargo = '';

        // Sumar recargo por color 
        const recargoActual = recargosColor[colorSeleccionado] || 0;
        precioTotal += recargoActual;

        if (colorSeleccionado === 'blanco') {
            textoDetalleRecargo = `<p class="small mb-1"><em>Costo por color: Color Base ($0)</em></p>`;
        } else {
            // Capitalizar el nombre del color para el detalle
            const nombreColorParaDetalle = colorSeleccionado.charAt(0).toUpperCase() + colorSeleccionado.slice(1);
            textoDetalleRecargo = `<p class="small mb-1"><em>Recargo color ${nombreColorParaDetalle}: +$${recargoActual.toLocaleString('es-CL')}</em></p>`;
        }
        // Actualizar el HTML del detalle del recargo
        detalleRecargoColorEl.innerHTML = textoDetalleRecargo;


        adicionalesSeleccionadosParaAlerta = [];
        let htmlAdicionales = '<p class="mb-1"><strong>Adicionales:</strong></p>';
        let tieneAdicionales = false;
        const ul = document.createElement('ul');
        ul.className = 'list-unstyled mb-0';

        checkaAdicionales.forEach(checkbox => {
            if (checkbox.checked) {
                tieneAdicionales = true;
                const adicionalId = checkbox.id;
                const adicionalInfo = preciosAdicionales[adicionalId];
                if (adicionalInfo) {
                    precioTotal += adicionalInfo.valor;
                    adicionalesSeleccionadosParaAlerta.push({ nombre: adicionalInfo.nombre, valor: adicionalInfo.valor });
                    const li = document.createElement('li');
                    li.textContent = `${adicionalInfo.nombre}: $${adicionalInfo.valor.toLocaleString('es-CL')}`;
                    ul.appendChild(li);
                }
            }
        });

        resumenAdicionales.innerHTML = '';
        if (!tieneAdicionales) {
            htmlAdicionales += '<p class="small mb-0">Ninguno</p>';
            resumenAdicionales.innerHTML = htmlAdicionales;
        } else {
            resumenAdicionales.innerHTML = htmlAdicionales;
            resumenAdicionales.appendChild(ul);
        }

        resumenColor.textContent = colorSeleccionado.charAt(0).toUpperCase() + colorSeleccionado.slice(1);
        valorFinal.textContent = `$${precioTotal.toLocaleString('es-CL')}`;
    }

    // --- EVENT LISTENERS ---
    opcionesColor.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                colorSeleccionado = this.value;
                actualizarImagen();
                calcularYMostrarTotal();
            }
        });
    });

    checkaAdicionales.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            calcularYMostrarTotal();
        });
    });

    btnComprar.addEventListener('click', function() {
        let mensajeFinal = `¡Gracias por tu interés en "El Cacharro"! Has seleccionado:\n`;
        mensajeFinal += `Color: ${resumenColor.textContent}\n`;
        // detalle del recargo 
        if (colorSeleccionado !== 'blanco') {
            const recargoActual = recargosColor[colorSeleccionado];
            mensajeFinal += `Recargo por color: +$${recargoActual.toLocaleString('es-CL')}\n`;
        } else {
            mensajeFinal += `Costo por color: Color Base ($0)\n`;
        }

        if (adicionalesSeleccionadosParaAlerta.length > 0) {
            mensajeFinal += `Adicionales:\n`;
            adicionalesSeleccionadosParaAlerta.forEach(ad => {
                mensajeFinal += `  - ${ad.nombre} ($${ad.valor.toLocaleString('es-CL')})\n`;
            });
        } else {
            mensajeFinal += `Adicionales: Ninguno\n`;
        }
        mensajeFinal += `Valor Final: ${valorFinal.textContent}`;
        alert(mensajeFinal);
    });

    // --- INICIALIZACIÓN ---
    actualizarImagen();
    calcularYMostrarTotal();
});