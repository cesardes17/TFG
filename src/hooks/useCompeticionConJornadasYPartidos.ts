import { useEffect, useState } from 'react';
import { useTemporadaContext } from '../contexts/TemporadaContext';
import { competitionBaseService } from '../services/competicionService/baseService';
import { Competicion } from '../types/Competicion';
import { jornadaService } from '../services/jornadaService';
import { Jornada } from '../types/Jornada';
import { partidoService } from '../services/partidoService';
import { Partido } from '../types/Partido';

export default function useCompeticionConJornadasYPartidos() {
  const { temporada } = useTemporadaContext();
  const [competiciones, setCompeticiones] = useState<Competicion[]>();
  const [loadingCompeticiones, setLoadingCompeticiones] = useState(true);

  const [competicionSeleccionada, setCompeticionSeleccionada] =
    useState<Competicion | null>(null);

  const [loadingJornadas, setLoadingJornadas] = useState(true);
  const [jornadas, setJornadas] = useState<Jornada[]>([]);
  const [jornadaSeleccionada, setJornadaSeleccionada] =
    useState<Jornada | null>(null);

  const [loadingPartidos, setLoadingPartidos] = useState(true);
  const [partidos, setPartidos] = useState<Partido[]>([]);

  //obtenemos las competiciones
  useEffect(() => {
    if (!temporada) return;
    const fecthCompeticiones = async () => {
      setLoadingCompeticiones(true);
      const res = await competitionBaseService.getCompeticiones(temporada.id);
      if (!res.success || !res.data) {
        setLoadingCompeticiones(false);
        setCompeticiones([]);
        return;
      }
      setCompeticiones(res.data);
      setLoadingCompeticiones(false);
      const inicial =
        res.data.find((c) => c.tipo === 'copa' && c.estado === 'en-curso') ||
        res.data.find(
          (c) => c.tipo === 'liga-regular' && c.estado !== 'finalizada'
        ) ||
        res.data.find((c) => c.tipo === 'playoffs');

      setCompeticionSeleccionada(inicial || null);
    };
    fecthCompeticiones();
  }, []);

  //cuando cambia la competicion seleccionada, obtenemos las jornadas
  useEffect(() => {
    if (!competicionSeleccionada) return;

    const fetchJornadas = async () => {
      setLoadingJornadas(true);
      const res = await jornadaService.getAll(
        temporada!.id,
        competicionSeleccionada.id
      );
      if (!res.success || !res.data) {
        setLoadingJornadas(false);
        setJornadas([]);
        return;
      }
      const jornadasOrdenadas = res.data.sort((a, b) => a.numero - b.numero);

      setJornadas(jornadasOrdenadas);

      const jornadaInicial =
        jornadasOrdenadas.find((j) => j.estado === 'pendiente') ||
        jornadasOrdenadas[jornadasOrdenadas.length - 1];
      setJornadaSeleccionada(jornadaInicial || null);
      setLoadingJornadas(false);
    };
    fetchJornadas();
  }, [competicionSeleccionada]);

  //cuando cambia la jornada seleccionada, obtenemos los partidos
  useEffect(() => {
    if (!jornadaSeleccionada) return;
    const fetchPartidos = async () => {
      setLoadingPartidos(true);
      const res = await partidoService.getAllByJornada(
        temporada!.id,
        competicionSeleccionada!.id,
        jornadaSeleccionada.id
      );
      if (!res.success || !res.data) {
        setLoadingPartidos(false);
        setPartidos([]);
        return;
      }
      setPartidos(res.data);
      setLoadingPartidos(false);
    };
    fetchPartidos();
  }, [jornadaSeleccionada]);

  const handleSeleccionarCompeticion = (id: string) => {
    const competicion = competiciones?.find((c) => c.id === id);
    setCompeticionSeleccionada(competicion || null);
  };

  const handleSeleccionarJornada = (id: string) => {
    const jornada = jornadas?.find((j) => j.id === id);
    setJornadaSeleccionada(jornada || null);
  };

  return {
    competiciones,
    loadingCompeticiones,
    competicionSeleccionada,
    jornadas,
    loadingJornadas,
    jornadaSeleccionada,
    loadingPartidos,
    partidos,
    handleSeleccionarCompeticion,
    handleSeleccionarJornada,
  };
}
