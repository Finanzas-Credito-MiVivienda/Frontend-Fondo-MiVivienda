export interface CreditoRequest {
    tipoTasaInteres: string,
    tasaInteres: number,
    frecuenciaPago: string,
    fechaInicio: string,
    tipoPeriodoGracia: string,
    periodoGracia: number,
    pcuotaInicial: number,
    numeroAnios: number,
    cok: number,
    idUsuario: number,
    idEntidadFinanciera: number,
    idInmueble: number
}