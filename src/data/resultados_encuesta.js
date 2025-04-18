const resultadosEncuesta = [
    {
        id: 1,
        nombre: "Alejandro Ormachea",
        fecha: "19/02/2025",
        resultados: {
            fisico: [
                {
                    subcategoria: "Cansancio",
                    resultado: "Frecuente",
                    observacion: "Necesita descanso físico."
                },
                {
                    subcategoria: "Irritación ocular",
                    resultado: "A veces",
                    observacion: "Monitorear los ojos después de cada intervención."
                }
            ],
            psicologico: [
                {
                    subcategoria: "Ansiedad",
                    resultado: "Alta",
                    observacion: "Se recomienda consulta psicológica."
                },
                {
                    subcategoria: "Estrés",
                    resultado: "Moderado",
                    observacion: "Seguir monitoreo constante."
                }
            ]
        }
    },
    {
        id: 2,
        nombre: "Carla Fernández",
        fecha: "15/03/2025",
        resultados: {
            fisico: [
                {
                    subcategoria: "Fatiga",
                    resultado: "Raramente",
                    observacion: "En buen estado físico general."
                }
            ],
            psicologico: [
                {
                    subcategoria: "Estrés post-incendio",
                    resultado: "Leve",
                    observacion: "Sin intervención necesaria por ahora."
                }
            ]
        }
    }
];

export default resultadosEncuesta;
