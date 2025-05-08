const resultadosEncuesta = [
    {
        voluntarioId: 1,
        encuestas: [
            {
                encuestaId: 101,
                estado: 'realizada',
                fechaRealizado: '2025-05-01',
                fechaEntregado: null,
                resultados: null
            },
            {
                encuestaId: 102,
                estado: 'realizada',
                fechaRealizado: '2025-05-15',
                fechaEntregado: null,
                resultados: null
            },
            {
                encuestaId: 103,
                estado: 'entregada',
                fechaRealizado: '2025-04-15',
                fechaEntregado: '2025-04-18',
                resultados: {
                    fisico: [
                        { subcategoria: "Piernas", resultado: "Bien", observacion: "Sin problemas" },
                        { subcategoria: "Brazos", resultado: "Leve cansancio", observacion: "Necesita estiramiento" },
                    ],
                    psicologico: [
                        { subcategoria: "Ansiedad", resultado: "Bajo", observacion: "Sin preocupaciones mayores" },
                        { subcategoria: "Estrés", resultado: "Moderado", observacion: "Semana intensa" },
                    ],
                    cuerpo: {
                        "Cabeza": "bueno",
                        "Pecho": "regular",
                        "Pierna Izquierda": "malo"
                    }
                }
            }
        ]
    },
    {
        voluntarioId: 2,
        encuestas: [
            {
                encuestaId: 201,
                estado: 'realizada',
                fechaRealizado: '2025-05-02',
                fechaEntregado: null,
                resultados: null
            },
            {
                encuestaId: 202,
                estado: 'realizada',
                fechaRealizado: '2025-05-10',
                fechaEntregado: null,
                resultados: null
            },
            {
                encuestaId: 203,
                estado: 'entregada',
                fechaRealizado: '2025-04-20',
                fechaEntregado: '2025-04-25',
                resultados: {
                    fisico: [
                        { subcategoria: "Espalda", resultado: "Leve dolor", observacion: "Reposo recomendado" },
                        { subcategoria: "Piernas", resultado: "Bien", observacion: "Sin problemas" },
                    ],
                    psicologico: [
                        { subcategoria: "Ánimo", resultado: "Bueno", observacion: "Motivado" },
                        { subcategoria: "Estrés", resultado: "Bajo", observacion: "Controlado" },
                    ],
                    cuerpo: {
                        "Cabeza": "bueno",
                        "Pecho": "bueno",
                        "Pierna Derecha": "regular"
                    }
                }
            }
        ]
    },
    {
        voluntarioId: 3,
        encuestas: [
            {
                encuestaId: 301,
                estado: 'realizada',
                fechaRealizado: '2025-05-04',
                fechaEntregado: null,
                resultados: null
            },
            {
                encuestaId: 302,
                estado: 'realizada',
                fechaRealizado: '2025-05-12',
                fechaEntregado: null,
                resultados: null
            },
            {
                encuestaId: 303,
                estado: 'entregada',
                fechaRealizado: '2025-04-10',
                fechaEntregado: '2025-04-12',
                resultados: {
                    fisico: [
                        { subcategoria: "Cuello", resultado: "Rigidez leve", observacion: "Masaje recomendado" },
                        { subcategoria: "Manos", resultado: "Normal", observacion: "Sin problemas" },
                    ],
                    psicologico: [
                        { subcategoria: "Concentración", resultado: "Alta", observacion: "Muy bien enfocado" },
                        { subcategoria: "Ánimo", resultado: "Bueno", observacion: "-" },
                    ],
                    cuerpo: {
                        "Cabeza": "regular",
                        "Pecho": "bueno",
                        "Pierna Izquierda": "bueno"
                    }
                }
            }
        ]
    },
    {
        voluntarioId: 4,
        encuestas: [
            {
                encuestaId: 401,
                estado: 'realizada',
                fechaRealizado: '2025-05-03',
                fechaEntregado: null,
                resultados: null
            },
            {
                encuestaId: 402,
                estado: 'realizada',
                fechaRealizado: '2025-05-11',
                fechaEntregado: null,
                resultados: null
            },
            {
                encuestaId: 403,
                estado: 'entregada',
                fechaRealizado: '2025-04-18',
                fechaEntregado: '2025-04-20',
                resultados: {
                    fisico: [
                        { subcategoria: "Espalda", resultado: "Dolor moderado", observacion: "Visitar fisioterapeuta" },
                        { subcategoria: "Piernas", resultado: "Cansancio", observacion: "Recomendado reposo" },
                    ],
                    psicologico: [
                        { subcategoria: "Estrés", resultado: "Alto", observacion: "Intervención recomendada" },
                        { subcategoria: "Ánimo", resultado: "Bajo", observacion: "Seguimiento necesario" },
                    ],
                    cuerpo: {
                        "Cabeza": "malo",
                        "Pecho": "regular",
                        "Pierna Derecha": "malo"
                    }
                }
            }
        ]
    },
    {
        voluntarioId: 5,
        encuestas: [
            {
                encuestaId: 501,
                estado: 'realizada',
                fechaRealizado: '2025-05-05',
                fechaEntregado: null,
                resultados: null
            },
            {
                encuestaId: 502,
                estado: 'realizada',
                fechaRealizado: '2025-05-13',
                fechaEntregado: null,
                resultados: null
            },
            {
                encuestaId: 503,
                estado: 'entregada',
                fechaRealizado: '2025-04-22',
                fechaEntregado: '2025-04-24',
                resultados: {
                    fisico: [
                        { subcategoria: "Rodillas", resultado: "Bien", observacion: "Sin problemas" },
                        { subcategoria: "Brazos", resultado: "Leve dolor", observacion: "Ejercicios suaves recomendados" },
                    ],
                    psicologico: [
                        { subcategoria: "Ansiedad", resultado: "Bajo", observacion: "-" },
                        { subcategoria: "Ánimo", resultado: "Bueno", observacion: "-" },
                    ],
                    cuerpo: {
                        "Cabeza": "bueno",
                        "Pecho": "regular",
                        "Pierna Derecha": "bueno"
                    }
                }
            }
        ]
    }
];

export default resultadosEncuesta;
