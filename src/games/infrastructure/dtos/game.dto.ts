import { IsString, IsArray, IsBoolean, IsInt, Min, ValidateNested, IsNumber, IsObject, IsOptional, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';

/* ─── SiONo (Verdadero / Falso) ─── */
export class SiONoQuestionDto {
  @IsString()
  prompt: string;
  @IsBoolean()
  answer: boolean;
}

export class SiONoContentDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SiONoQuestionDto)
  questions: SiONoQuestionDto[];
}

/* ─── OpcionMultiple ─── */
export class OpcionMultipleQuestionDto {
  @IsString()
  prompt: string;
  @IsArray()
  @IsString({ each: true })
  options: string[];
  @IsInt()
  @Min(0)
  correctIndex: number;
}

export class OpcionMultipleContentDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpcionMultipleQuestionDto)
  questions: OpcionMultipleQuestionDto[];
}

/* ─── MultiSeleccion ─── */
export class MultiSeleccionOptionDto {
  @IsString()
  text: string;
  @IsBoolean()
  correct: boolean;
}

export class MultiSeleccionQuestionDto {
  @IsString()
  prompt: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MultiSeleccionOptionDto)
  options: MultiSeleccionOptionDto[];
}

export class MultiSeleccionContentDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MultiSeleccionQuestionDto)
  questions: MultiSeleccionQuestionDto[];
}

/* ─── RelacionarColumnas ─── */
export class RelacionarColumnasPairDto {
  @IsString()
  left: string;
  @IsString()
  right: string;
}

export class RelacionarColumnasContentDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RelacionarColumnasPairDto)
  pairs: RelacionarColumnasPairDto[];
}

/* ─── OrdenarSecuencia ─── */
export class OrdenarSecuenciaItemDto {
  @IsString()
  id: string;
  @IsString()
  text: string;
  @IsInt()
  correctOrder: number;
}

export class OrdenarSecuenciaContentDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrdenarSecuenciaItemDto)
  items: OrdenarSecuenciaItemDto[];
}

/* ─── SopaDeLetras ─── */
export class SopaDeLetrasContentDto {
  @IsArray()
  @IsString({ each: true })
  words: string[];
  @IsInt()
  @Min(5)
  gridSize: number;
  @IsString()
  topic: string;
}

/* ─── DTO principal de creación ─── */
export const VALID_TEMPLATES = [
  'SiONo',
  'OpcionMultiple',
  'MultiSeleccion',
  'RelacionarColumnas',
  'OrdenarSecuencia',
  'SopaDeLetras',
] as const;

export type ValidTemplate = (typeof VALID_TEMPLATES)[number];

export class CreateGameRequestDto {
  @IsString()
  templateType: string;

  @IsString()
  title: string;

  @IsObject()
  content: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  rules?: Record<string, unknown>;
}

/* ─── Classroom ─── */
export class CreateClassroomRequestDto {
  @IsString()
  name: string;
}

/* ─── Asignación y respuestas ─── */
export class AssignGameRequestDto {
  @IsString()
  classroomId: string;
}

export class SubmitAnswerRequestDto {
  @IsInt()
  @Min(0)
  questionIndex: number;
  @IsDefined()
  answer: any;
  @IsInt()
  @Min(0)
  elapsedMs: number;
}
