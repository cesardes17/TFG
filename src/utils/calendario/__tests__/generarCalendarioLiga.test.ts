// src/utils/calendario/__tests__/generarCalendarioLiga.test.ts

import { Partido } from '../../../types/Partido';
import { Jornada } from '../../../types/Jornada';
import { generarCalendarioLiga } from '../generarJornadas';

function partidosToStr(partidos: Partido[]) {
  return partidos.map((p) => `${p.equipoLocal.id}-${p.equipoVisitante.id}`);
}

function areInverse(p1: Partido, p2: Partido) {
  return (
    p1.equipoLocal.id === p2.equipoVisitante.id &&
    p1.equipoVisitante.id === p2.equipoLocal.id
  );
}

describe('generarCalendarioLiga', () => {
  const crearEquipos = (n: number) =>
    Array.from({ length: n }, (_, i) => ({
      id: `eq${i + 1}`,
      nombre: `Equipo ${i + 1}`,
      escudoUrl: '',
    }));

  it('genera correctamente jornadas y partidos con número par de equipos (4)', async () => {
    const equipos = crearEquipos(4);
    const { jornadas, partidosPorJornada } = await generarCalendarioLiga(
      equipos
    );

    expect(jornadas).toHaveLength(6); // 3 ida + 3 vuelta
    const partidosIda = jornadas
      .slice(0, 3)
      .flatMap((j: Jornada) => partidosPorJornada[j.id]);
    const partidosVuelta = jornadas
      .slice(3)
      .flatMap((j: Jornada) => partidosPorJornada[j.id]);

    // Que no haya partidos repetidos en la ida
    const partidosIdaStr = partidosToStr(partidosIda);
    const setIda = new Set(partidosIdaStr);
    expect(setIda.size).toBe(partidosIdaStr.length);

    // Que la vuelta sea la ida invertida
    expect(partidosVuelta).toHaveLength(partidosIda.length);
    for (let i = 0; i < partidosIda.length; i++) {
      expect(areInverse(partidosIda[i], partidosVuelta[i])).toBe(true);
    }
  });

  it('genera correctamente jornadas y partidos con número impar de equipos (5)', async () => {
    const equipos = crearEquipos(5);
    const { jornadas, partidosPorJornada } = await generarCalendarioLiga(
      equipos
    );

    expect(jornadas).toHaveLength(10); // 5 ida + 5 vuelta

    const partidosIda = jornadas
      .slice(0, 5)
      .flatMap((j: Jornada) => partidosPorJornada[j.id]);
    const partidosVuelta = jornadas
      .slice(5)
      .flatMap((j: Jornada) => partidosPorJornada[j.id]);

    // Ignorar partidos con 'descansa'
    const partidosIdaValidos = partidosIda.filter(
      (p: Partido) =>
        p.equipoLocal.id !== 'descansa' && p.equipoVisitante.id !== 'descansa'
    );
    const partidosVueltaValidos = partidosVuelta.filter(
      (p: Partido) =>
        p.equipoLocal.id !== 'descansa' && p.equipoVisitante.id !== 'descansa'
    );

    const partidosIdaStr = partidosToStr(partidosIdaValidos);
    const setIda = new Set(partidosIdaStr);
    expect(setIda.size).toBe(partidosIdaStr.length);

    // Que la vuelta sea la ida invertida
    expect(partidosVueltaValidos).toHaveLength(partidosIdaValidos.length);
    for (let i = 0; i < partidosIdaValidos.length; i++) {
      expect(areInverse(partidosIdaValidos[i], partidosVueltaValidos[i])).toBe(
        true
      );
    }
  });
});
