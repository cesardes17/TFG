// src/utils/__tests__/generarCuadroCopa.test.ts
import { generarCuadroCopa } from '../generarCuadroCopa';
import { Jornada } from '../../../types/Jornada';
import { Partido } from '../../../types/Partido';

const crearEquipos = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    id: `eq${i + 1}`,
    nombre: `Equipo ${i + 1}`,
    escudoUrl: '',
  }));

describe('generarCuadroCopa', () => {
  it('genera correctamente el cuadro con 8 equipos', async () => {
    const equipos = crearEquipos(8);
    const { rondas, partidosPorRonda } = generarCuadroCopa(equipos);

    // Validar número de rondas
    expect(rondas).toHaveLength(3);
    const nombresRondas = rondas.map((r) => r.nombre);
    expect(nombresRondas).toContain('Cuartos de Final');
    expect(nombresRondas).toContain('Semifinales');
    expect(nombresRondas).toContain('Final');

    // Validar número de partidos por ronda
    const cuartos = rondas.find((r) => r.nombre === 'Cuartos de Final')!;
    const semis = rondas.find((r) => r.nombre === 'Semifinales')!;
    const final = rondas.find((r) => r.nombre === 'Final')!;

    expect(partidosPorRonda[cuartos.id]).toHaveLength(4);
    expect(partidosPorRonda[semis.id]).toHaveLength(2);
    expect(partidosPorRonda[final.id]).toHaveLength(1);
  });

  it('añade equipos DESCANSA si hay menos de 8 equipos', async () => {
    const equipos = crearEquipos(6);
    const { rondas, partidosPorRonda } = generarCuadroCopa(equipos);

    const cuartos = rondas.find((r) => r.nombre === 'Cuartos de Final')!;
    const partidos = partidosPorRonda[cuartos.id];

    const partidosConBye = partidos.filter(
      (p) => p.equipoLocal.id === 'bye' || p.equipoVisitante.id === 'bye'
    );

    expect(partidosConBye.length).toBeGreaterThan(0);
    for (const p of partidosConBye) {
      expect(p.estado).toBe('finalizado');
    }
  });

  it('semifinales apuntan a un partido de la final', async () => {
    const equipos = crearEquipos(8);
    const { rondas, partidosPorRonda } = generarCuadroCopa(equipos);

    const semis = rondas.find((r) => r.nombre === 'Semifinales')!;
    const final = rondas.find((r) => r.nombre === 'Final')!;
    const partidosFinal = partidosPorRonda[final.id];
    expect(partidosFinal).toHaveLength(1);
    const finalId = partidosFinal[0].id;

    for (const p of partidosPorRonda[semis.id]) {
      expect(p.siguientePartidoId).toBe(finalId);
    }
  });

  it('cuartos apuntan a la semifinal correcta según el mapa', async () => {
    const equipos = crearEquipos(8);
    const { rondas, partidosPorRonda } = generarCuadroCopa(equipos);

    const cuartos = rondas.find((r) => r.nombre === 'Cuartos de Final')!;
    const semis = rondas.find((r) => r.nombre === 'Semifinales')!;

    const partidosSemis = partidosPorRonda[semis.id];
    const partidosCuartos = partidosPorRonda[cuartos.id];

    // Mapa esperado: cuartos 0 y 3 → semi 0, cuartos 1 y 2 → semi 1
    const expectedMap: Record<number, number> = { 0: 0, 3: 0, 1: 1, 2: 1 };

    Object.entries(expectedMap).forEach(([cuartoIndex, semiIndex]) => {
      const partidoCuarto = partidosCuartos[parseInt(cuartoIndex)];
      const partidoSemi = partidosSemis[semiIndex];
      expect(partidoCuarto.siguientePartidoId).toBe(partidoSemi.id);
    });
  });
});
