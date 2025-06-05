import { useEffect, useState } from 'react';
import { useTemporadaContext } from '../contexts/TemporadaContext';
import { partidoService } from '../services/partidoService';
import { inscripcionesService } from '../services/inscripcionesService';
import { Partido, PartidoRT } from '../types/Partido';
import { inicializarPartido } from '../utils/modoMesa/inicializarPartido';
import { avanzarCuarto } from '../utils/modoMesa/avanzarCuarto';
import { HistorialAccion } from '../types/HistorialAccion';
import { getRandomUID } from '../utils/getRandomUID';
import { ActualizarEstadisticaJugadorParams } from '../types/estadisticas/jugador';
import { inicializarCuarto } from '../utils/modoMesa/inicializarCuarto';

interface PartidoMesaProps {
  competicionId: string;
  partidoId: string;
}
export default function usePartidoMesa(
  competicionId: string,
  partidoId: string
) {
  const { temporada } = useTemporadaContext();

  //partido
  const [partido, setPartido] = useState<PartidoRT | null>(null);
  const [partidoIniciado, setPartidoIniciado] = useState<boolean>(false);
  const [accionesPartido, setAccionesPartido] = useState<HistorialAccion[]>([]);
  // Quintetos listos
  const [quintetosListos, setQuintetosListos] = useState<{
    local: boolean;
    visitante: boolean;
  }>({ local: false, visitante: false });

  //Jugador Expulsado Pendiente de salir del quinteto
  const [jugadorExpulsadoPendiente, setJugadorExpulsadoPendiente] = useState<{
    local: boolean;
    visitante: boolean;
  }>({ local: false, visitante: false });

  //cuarto actual
  const [cuartoActual, setCuartoActual] = useState<string>('C1');
  const [cuartoIniciado, setCuartoIniciado] = useState<boolean>(false);
  //Control Cronometro
  const [pararCronometro, setPararCronometro] = useState<boolean>(false);
  const [cronometroActivo, setCronometroActivo] = useState<boolean>(false);

  //tiempos Muertos
  //tiempo Muerto Pendiente
  const [tiempoMuertoPendiente, setTiempoMuertoPendiente] = useState<{
    local: boolean;
    visitante: boolean;
  }>({ local: false, visitante: false });

  //tiempo Muerto Activo
  const [tiempoMuertoActivo, setTiempoMuertoActivo] = useState<boolean>(false);
  const [tiemposMuertosUsados, setTiemposMuertosUsados] = useState<{
    local: {
      primeraMitad: boolean;
      segundaMitad: boolean;
      prorroga: boolean;
    };
    visitante: {
      primeraMitad: boolean;
      segundaMitad: boolean;
      prorroga: boolean;
    };
  }>({
    local: {
      primeraMitad: false,
      segundaMitad: false,
      prorroga: false,
    },
    visitante: {
      primeraMitad: false,
      segundaMitad: false,
      prorroga: false,
    },
  });
  //modal
  const [modal, setModal] = useState<{
    title: string;
    message: string;
    visible: boolean;
  }>({
    title: '',
    message: '',
    visible: false,
  });

  useEffect(() => {
    if (!temporada) {
      console.log('No hay temporada, saliendo...');
      return;
    }

    const fetchPartido = async () => {
      console.log('Comenzando fetchPartido...');

      // 1️⃣ Buscar en Realtime Database
      console.log('Buscando partido en Realtime Database...');
      const resRT = await partidoService.getPartidoRealtimeOnce(partidoId);
      console.log('Resultado de getPartidoRealtimeOnce:', resRT);

      if (resRT.success && resRT.data) {
        console.log('Partido encontrado en Realtime Database:', resRT.data);
        setPartido(resRT.data);
        console.log('Partido seteado desde Realtime Database. Fin.');
        return;
      }

      // 2️⃣ Buscar en Firestore
      console.log(
        'No hay partido en Realtime Database. Buscando en Firestore...'
      );
      const resFS = await partidoService.getPartido(
        temporada.id,
        competicionId,
        partidoId
      );
      console.log('Resultado de getPartido:', resFS);

      if (!resFS.success || !resFS.data) {
        console.log(
          'Error al obtener partido de Firestore:',
          resFS.errorMessage
        );
        return;
      }

      const partidoFS: Partido = resFS.data;
      console.log('Partido obtenido de Firestore:', partidoFS);

      // 3️⃣ Obtener inscripciones
      const equipoLocalId = partidoFS.equipoLocal.id;
      const equipoVisitanteId = partidoFS.equipoVisitante.id;

      console.log('Buscando inscripciones del equipo local...');
      const resLocal = await inscripcionesService.getInscripcionesByTeam(
        temporada.id,
        equipoLocalId
      );
      console.log('Resultado de getInscripcionesByTeam LOCAL:', resLocal);

      console.log('Buscando inscripciones del equipo visitante...');
      const resVisitante = await inscripcionesService.getInscripcionesByTeam(
        temporada.id,
        equipoVisitanteId
      );
      console.log(
        'Resultado de getInscripcionesByTeam VISITANTE:',
        resVisitante
      );

      if (
        !resLocal.success ||
        !resLocal.data ||
        !resVisitante.success ||
        !resVisitante.data
      ) {
        console.log(
          'Error al obtener inscripciones:',
          resLocal.errorMessage || resVisitante.errorMessage
        );
        return;
      }

      // 4️⃣ Inicializar el partido
      console.log('Inicializando partido...');
      const partidoInicializado: PartidoRT = inicializarPartido(
        partidoFS,
        resLocal.data,
        resVisitante.data
      );
      console.log('Partido inicializado:', partidoInicializado);

      // 5️⃣ Setear el partido en el estado
      setPartido(partidoInicializado);
      console.log('Partido inicializado seteado en el estado.');

      // 6️⃣ Guardar en Realtime Database
      console.log('Guardando partido en Realtime Database...');
      const resRTCreacion = await partidoService.crearRealtime(
        partidoInicializado
      );
      console.log('Resultado de crearRealtime:', resRTCreacion);

      if (!resRTCreacion.success) {
        console.log(
          'Error al crear partido en Realtime Database:',
          resRTCreacion.errorMessage
        );
        return;
      }

      console.log('Partido guardado en Realtime Database correctamente.');
      console.log('fetchPartido COMPLETADO.');
    };

    fetchPartido();
  }, [temporada, competicionId, partidoId]);

  useEffect(() => {
    if (cuartoActual === 'C1') return;
    const partidoActualizado = inicializarCuarto(partido!, cuartoActual);
    setPartido(partidoActualizado);
    console.log(JSON.stringify(partidoActualizado, null, 2));
  }, [cuartoActual]);

  //quintetos listos
  const handleQuintetosListos = (equipo: 'local' | 'visitante') => {
    setQuintetosListos((prev) => ({
      ...prev,
      [equipo]: true,
    }));
  };

  const handlePartidoIniciado = () => {
    setPartidoIniciado(true);
  };

  //finalizamos cuarto
  const handleFinCuarto = () => {
    const puntosLocal = partido!.estadisticasEquipos!.totales.local.puntos;
    const puntosVisitante =
      partido!.estadisticasEquipos!.totales.visitante.puntos;
    setCuartoActual((prev) =>
      avanzarCuarto(prev, puntosLocal, puntosVisitante)
    );
  };

  const handleSolicitarTiempoMuerto = (equipo: 'local' | 'visitante') => {
    setTiempoMuertoPendiente((prev) => ({
      ...prev,
      [equipo]: true,
    }));
  };

  const handleCancelarTiempoMuerto = (equipo: 'local' | 'visitante') => {
    setTiempoMuertoPendiente((prev) => ({
      ...prev,
      [equipo]: false,
    }));
  };

  const handleFinTiempoMuerto = () => {
    setTiempoMuertoActivo(false);
    setTiempoMuertoPendiente({ local: false, visitante: false });
  };

  const handleInicioTiempoMuerto = () => {
    const mitad = obtenerMitadActual(cuartoActual);
    const equipo = tiempoMuertoPendiente.local === true ? 'local' : 'visitante';
    setTiemposMuertosUsados((prev) => ({
      ...prev,
      [equipo]: {
        ...prev[equipo],
        [mitad]: true,
      },
    }));
    setTiempoMuertoActivo(true);
  };

  const obtenerMitadActual = (cuarto: string) => {
    if (cuarto === 'C1' || cuarto === 'C2') return 'primeraMitad';
    if (cuarto === 'C3' || cuarto === 'C4') return 'segundaMitad';
    return 'prorroga';
  };

  const puedeSolicitarTiempoMuerto = (equipo: 'local' | 'visitante') => {
    const mitad = obtenerMitadActual(cuartoActual);
    return !tiemposMuertosUsados[equipo][mitad];
  };

  const handlePararCronometro = (parar: boolean) => {
    setPararCronometro(parar);
  };

  const handleCuartoIniciado = (iniciado: boolean) => {
    setCuartoIniciado(iniciado);
  };

  const handleJugadorExpulsadoPendiente = (
    equipo: 'local' | 'visitante',
    estado: boolean
  ) => {
    setJugadorExpulsadoPendiente((prev) => ({
      ...prev,
      [equipo]: estado,
    }));
  };

  const handleEliminarAccion = (idAccion: string) => {
    // Buscar la acción
    const accion = accionesPartido.find((a) => a.id === idAccion);
    if (!accion) return;

    // Deshacer la acción (aplicando la misma acción pero con valor negativo)
    handleActualizarEstadisticaJugador({
      jugadorId: accion.jugadorId,
      equipo: accion.equipo,
      accion: accion.accion,
      valor: -accion.valor,
      tipoTiro: accion.tipoTiro,
    });

    // Eliminarla del historial
    setAccionesPartido((prev) => prev.filter((a) => a.id !== idAccion));
  };

  const handleActualizarEstadisticaJugador = ({
    jugadorId,
    equipo,
    accion,
    valor,
    tipoTiro,
  }: ActualizarEstadisticaJugadorParams) => {
    // Paso 1: Copia del estado
    if (!partido) return;

    const partidoCopia = { ...partido };

    if (
      !partidoCopia.estadisticasEquipos ||
      !partidoCopia.estadisticasJugadores
    )
      return;

    //Paso 2: Actualizar estadística del jugador
    const jugadorStats = partidoCopia.estadisticasJugadores[equipo][jugadorId];
    if (!jugadorStats) return;

    if (
      accion === 'puntos' ||
      accion === 'asistencias' ||
      accion === 'rebotes' ||
      accion === 'faltasCometidas'
    ) {
      jugadorStats[accion] += valor;
    } else if (
      accion === 'tirosLibres' ||
      accion === 'tirosDos' ||
      accion === 'tirosTres'
    ) {
      if (tipoTiro) {
        jugadorStats[accion][tipoTiro] += valor;

        // 💡 Si es un tiro ANOTADO, sumar los puntos reales
        if (tipoTiro === 'anotados') {
          let puntosASumar = 0;
          if (accion === 'tirosLibres') puntosASumar = 1;
          if (accion === 'tirosDos') puntosASumar = 2;
          if (accion === 'tirosTres') puntosASumar = 3;

          jugadorStats.puntos += puntosASumar * valor;
        }
      }
    }
    if (jugadorStats.faltasCometidas >= 5) {
      setPararCronometro(true);
      setModal({
        title: 'JugadorExpulsado!',
        message: 'El jugador ha cometido 5 faltas.',
        visible: true,
      });
    }

    // Paso 3: Actualizar estadística del equipo en el cuarto actual
    const equipoStatsCuarto =
      partidoCopia.estadisticasEquipos.porCuarto[cuartoActual][equipo];
    if (
      accion === 'puntos' ||
      accion === 'asistencias' ||
      accion === 'rebotes' ||
      accion === 'faltasCometidas'
    ) {
      equipoStatsCuarto[accion] += valor;
    } else if (
      accion === 'tirosLibres' ||
      accion === 'tirosDos' ||
      accion === 'tirosTres'
    ) {
      if (tipoTiro) {
        equipoStatsCuarto[accion][tipoTiro] += valor;

        // 💡 Si es un tiro ANOTADO, sumar los puntos reales al equipo
        if (tipoTiro === 'anotados') {
          let puntosASumar = 0;
          if (accion === 'tirosLibres') puntosASumar = 1;
          if (accion === 'tirosDos') puntosASumar = 2;
          if (accion === 'tirosTres') puntosASumar = 3;

          equipoStatsCuarto.puntos += puntosASumar * valor;
        }
      }
    }

    // Paso 4: Actualizar estadística total del equipo
    const equipoStatsTotales = partidoCopia.estadisticasEquipos.totales[equipo];
    if (
      accion === 'puntos' ||
      accion === 'asistencias' ||
      accion === 'rebotes' ||
      accion === 'faltasCometidas'
    ) {
      equipoStatsTotales[accion] += valor;
    } else if (
      accion === 'tirosLibres' ||
      accion === 'tirosDos' ||
      accion === 'tirosTres'
    ) {
      if (tipoTiro) {
        equipoStatsTotales[accion][tipoTiro] += valor;

        // 💡 Si es un tiro ANOTADO, sumar los puntos reales al total
        if (tipoTiro === 'anotados') {
          let puntosASumar = 0;
          if (accion === 'tirosLibres') puntosASumar = 1;
          if (accion === 'tirosDos') puntosASumar = 2;
          if (accion === 'tirosTres') puntosASumar = 3;

          equipoStatsTotales.puntos += puntosASumar * valor;
        }
      }
    }

    // Paso 5: Marcar que el jugador ha jugado
    if (!jugadorStats.haJugado) {
      jugadorStats.haJugado = true;
    }

    // Paso 6: Agregar la acción al historial
    if (valor > 0) {
      const accionRealizada: HistorialAccion = {
        nombre: jugadorStats.nombre,
        apellidos: jugadorStats.apellidos,
        dorsal: jugadorStats.dorsal,
        jugadorId,
        equipo,
        accion,
        valor,
        tipoTiro,
        id: getRandomUID(),
      };
      setAccionesPartido((prev) => [accionRealizada, ...prev]);
    }
    // Paso 7: Actualizar el estado
    setPartido(partidoCopia);
    // Paso 8: Actualizar en Realtime Database
    partidoService.updateRealtime(partidoCopia).then((res) => {
      if (!res.success) {
        console.log(
          'Error al actualizar en Realtime Database:',
          res.errorMessage
        );
      } else {
        console.log(
          'Partido actualizado en Realtime Database correctamente.',
          res
        );
      }
    });
  };

  return {
    partido,
    quintetosListos,
    partidoIniciado,
    cuartoActual,
    cronometroActivo,
    tiempoMuertoPendiente,
    tiempoMuertoActivo,
    modal,
    jugadorExpulsadoPendiente,
    pararCronometro,
    cuartoIniciado,
    accionesPartido,
    //funciones

    handleQuintetosListos,
    handlePartidoIniciado,
    handleFinCuarto,
    setCronometroActivo,
    handleSolicitarTiempoMuerto,
    handleCancelarTiempoMuerto,
    handleInicioTiempoMuerto,
    handleFinTiempoMuerto,
    setModal,
    handlePararCronometro,
    handleCuartoIniciado,
    handleJugadorExpulsadoPendiente,
    handleEliminarAccion,
    handleActualizarEstadisticaJugador,
    puedeSolicitarTiempoMuerto,
  };
}
