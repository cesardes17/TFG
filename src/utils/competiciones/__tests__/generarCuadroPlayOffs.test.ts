// src/utils/__tests__/generarCuadroPlayoffs.test.ts

import { generarCuadroPlayoffs } from '../generarCuadroPlayOffs';

type EquipoSimple = { id: string; nombre: string; escudoUrl: string };

function crearEquipo(id: string): EquipoSimple {
  return { id, nombre: `Equipo ${id}`, escudoUrl: '' };
}

describe('generarCuadroPlayoffs', () => {
  const temporadaId = 'TEMP_ID';

  it('genera correctamente el cuadro con 8 equipos', async () => {
    const equipos = Array.from({ length: 8 }, (_, i) =>
      crearEquipo((i + 1).toString())
    );

    const { rondas, seriesPorRonda, partidosPorSerie } = generarCuadroPlayoffs(
      temporadaId,
      equipos
    );

    expect(rondas).toHaveLength(3);
    expect(Object.keys(seriesPorRonda)).toHaveLength(3);

    const cuartos = rondas.find((r) => r.nombre === 'Cuartos de Final');
    const semis = rondas.find((r) => r.nombre === 'Semifinales');
    const final = rondas.find((r) => r.nombre === 'Final');

    expect(cuartos).toBeDefined();
    expect(semis).toBeDefined();
    expect(final).toBeDefined();

    // Cuartos: 4 series
    expect(seriesPorRonda[cuartos!.id]).toHaveLength(4);
    // Semis: 2 series
    expect(seriesPorRonda[semis!.id]).toHaveLength(2);
    // Final: 1 serie
    expect(seriesPorRonda[final!.id]).toHaveLength(1);

    // Cada serie de cuartos tiene 2 partidos
    for (const serie of seriesPorRonda[cuartos!.id]) {
      const partidos = partidosPorSerie[serie.id];
      expect(partidos).toHaveLength(2);
      for (const partido of partidos) {
        expect(partido.estado).toBe('pendiente');
        expect(partido.tipoCompeticion).toBe('playoffs');
      }
    }

    // Las semifinales apuntan a la final
    for (const serie of seriesPorRonda[semis!.id]) {
      expect(serie.nextSerieId).toBe(seriesPorRonda[final!.id][0].id);
    }

    // Las series de cuartos apuntan a semis correctas
    const cuartosASemisMap: Record<number, number> = { 0: 0, 3: 0, 1: 1, 2: 1 };
    seriesPorRonda[cuartos!.id].forEach((serie, i) => {
      const semiEsperada = seriesPorRonda[semis!.id][cuartosASemisMap[i]].id;
      expect(serie.nextSerieId).toBe(semiEsperada);
    });
  });

  it('avanza automáticamente a equipos con bye cuando hay solo 7 equipos', async () => {
    const equipos = Array.from({ length: 7 }, (_, i) =>
      crearEquipo((i + 1).toString())
    );

    const { rondas, seriesPorRonda } = generarCuadroPlayoffs(
      temporadaId,
      equipos
    );

    const cuartos = rondas.find((r) => r.nombre === 'Cuartos de Final')!;
    const semis = rondas.find((r) => r.nombre === 'Semifinales')!;

    const seriesCuartos = seriesPorRonda[cuartos.id];
    const seriesSemis = seriesPorRonda[semis.id];

    const seriesConBye = seriesCuartos.filter(
      (s) => s.local.id === 'bye' || s.visitante.id === 'bye'
    );
    expect(seriesConBye.length).toBe(1); // Solo 1 bye al haber 7 equipos

    for (const serie of seriesConBye) {
      expect(serie.estado).toBe('finalizada');
      expect(serie.ganadorId).toBeDefined();

      // Ese equipo debería estar ya asignado a una semifinal
      const apareceEnSemi = seriesSemis.some(
        (semi) =>
          semi.local.id === serie.ganadorId ||
          semi.visitante.id === serie.ganadorId
      );
      expect(apareceEnSemi).toBe(true);
    }
  });
});
