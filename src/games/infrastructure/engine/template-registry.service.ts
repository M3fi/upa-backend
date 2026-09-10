import { Injectable, OnModuleInit } from '@nestjs/common';
import { GameFactory } from '../../domain/engine/GameFactory';
import { SiONoTemplate } from '../../domain/templates/siono.template';
import { RelacionarColumnasTemplate } from '../../domain/templates/relacionar-columnas.template';
import { SopaDeLetrasTemplate } from '../../domain/templates/sopa-de-letras.template';
import { OpcionMultipleTemplate } from '../../domain/templates/opcion-multiple.template';
import { MultiSeleccionTemplate } from '../../domain/templates/multi-seleccion.template';
import { VFJustificacionTemplate } from '../../domain/templates/vf-justificacion.template';
import { OrdenarSecuenciaTemplate } from '../../domain/templates/ordenar-secuencia.template';
import { ClasificarCategoriasTemplate } from '../../domain/templates/clasificar-categorias.template';
import { LineaTiempoTemplate } from '../../domain/templates/linea-tiempo.template';
import { CompletarEspaciosTemplate } from '../../domain/templates/completar-espacios.template';
import { RespuestaCortaTemplate } from '../../domain/templates/respuesta-corta.template';
import { CrucigramaTemplate } from '../../domain/templates/crucigrama.template';
import { EncuentraErrorTemplate } from '../../domain/templates/encuentra-error.template';
import { MemoriaTemplate } from '../../domain/templates/memoria.template';
import { RompecabezasTemplate } from '../../domain/templates/rompecabezas.template';
import { OperacionesMatematicasTemplate } from '../../domain/templates/operaciones-matematicas.template';
import { VerdaderoPatronTemplate } from '../../domain/templates/verdadero-patron.template';
import { AsociacionImagenTemplate } from '../../domain/templates/asociacion-imagen.template';
import { QuizCronometradoTemplate } from '../../domain/templates/quiz-cronometrado.template';
import { SecuenciaTemplate } from '../../domain/templates/secuencia.template';

@Injectable()
export class TemplateRegistryService implements OnModuleInit {
  onModuleInit() {
    GameFactory.register(new SiONoTemplate());
    GameFactory.register(new RelacionarColumnasTemplate());
    GameFactory.register(new SopaDeLetrasTemplate());
    GameFactory.register(new OpcionMultipleTemplate());
    GameFactory.register(new MultiSeleccionTemplate());
    GameFactory.register(new VFJustificacionTemplate());
    GameFactory.register(new OrdenarSecuenciaTemplate());
    GameFactory.register(new ClasificarCategoriasTemplate());
    GameFactory.register(new LineaTiempoTemplate());
    GameFactory.register(new CompletarEspaciosTemplate());
    GameFactory.register(new RespuestaCortaTemplate());
    GameFactory.register(new CrucigramaTemplate());
    GameFactory.register(new EncuentraErrorTemplate());
    GameFactory.register(new MemoriaTemplate());
    GameFactory.register(new RompecabezasTemplate());
    GameFactory.register(new OperacionesMatematicasTemplate());
    GameFactory.register(new VerdaderoPatronTemplate());
    GameFactory.register(new AsociacionImagenTemplate());
    GameFactory.register(new QuizCronometradoTemplate());
    GameFactory.register(new SecuenciaTemplate());
  }
}
