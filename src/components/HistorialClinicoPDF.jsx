import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Estilos generales
const styles = StyleSheet.create({
    page: {
        padding: 30,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        borderBottom: 2,
        borderBottomColor: '#1B4332',
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        color: '#1B4332',
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        color: '#2D6A4F',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        color: '#1B4332',
        marginBottom: 10,
        borderBottom: 1,
        borderBottomColor: '#CCC',
        paddingBottom: 4,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    label: {
        width: '30%',
        fontSize: 12,
        fontWeight: 'bold',
        color: '#2D6A4F',
    },
    value: {
        fontSize: 12,
        color: '#333',
        flex: 1,
    },
    evaluacionItem: {
        marginBottom: 25,
    },
    encabezado: {
        backgroundColor: '#F8F9FA',
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        borderRadius: 4,
        borderLeft: 3,
        borderLeftColor: '#1B4332',
    },
    reporteNumero: {
        fontSize: 11,
        color: '#1B4332',
        fontWeight: 'bold',
    },
    fecha: {
        fontSize: 11,
        color: '#2D6A4F',
    },
    resumenBox: {
        marginTop: 8,
        padding: 12,
        backgroundColor: '#FFFFFF',
        borderLeft: 3,
        borderLeftColor: '#2D6A4F',
        marginLeft: 10,
    },
    resumenTexto: {
        fontSize: 12,
        color: '#333',
        textAlign: 'justify',
        lineHeight: 1.5,
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 10,
        bottom: 20,
        right: 20,
        color: '#666',
    },
    metadata: {
        position: 'absolute',
        fontSize: 8,
        bottom: 20,
        left: 20,
        color: '#999',
    },
});

// COMPONENTE: Encabezado con número de reporte y fecha
const EncabezadoReporte = ({ numero, fecha }) => (
    <View style={styles.encabezado}>
        <Text style={styles.reporteNumero}>Reporte N° {numero}</Text>
        <Text style={styles.fecha}>Fecha: {fecha}</Text>
    </View>
);

// COMPONENTE: Contenido del resumen (emocional o físico)
const ContenidoReporte = ({ texto }) => (
    <View style={styles.resumenBox}>
        <Text style={styles.resumenTexto}>
            {texto || 'Sin datos registrados.'}
        </Text>
    </View>
);

// COMPONENTE: Evaluación completa
const Evaluacion = ({ reporte, tipo }) => (
    <View style={styles.evaluacionItem}>
        <EncabezadoReporte numero={reporte.id} fecha={reporte.fechaGenerado} />
        <ContenidoReporte 
            texto={tipo === 'fisico' ? reporte.resumenFisico : reporte.resumenEmocional} 
        />
    </View>
);

// COMPONENTE PRINCIPAL PDF
const HistorialClinicoPDF = ({ voluntario, datosReportes }) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* ENCABEZADO */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Historial Clínico</Text>
                    <Text style={styles.subtitle}>GEVOPI - Gestión de Voluntarios Post-Incendio</Text>
                </View>
                <Text style={styles.fecha}>Emitido: {new Date().toLocaleDateString()}</Text>
            </View>

            {/* DATOS DEL VOLUNTARIO */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Datos del Voluntario</Text>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Nombre:</Text>
                    <Text style={styles.value}>{voluntario?.nombre} {voluntario?.apellido}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>CI:</Text>
                    <Text style={styles.value}>{voluntario?.ci || 'No registrado'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Fecha de nacimiento:</Text>
                    <Text style={styles.value}>{voluntario?.fecha_nacimiento || 'No registrado'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Tipo de sangre:</Text>
                    <Text style={styles.value}>{voluntario?.tipo_sangre || 'No registrado'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Estado:</Text>
                    <Text style={styles.value}>{voluntario?.estado || 'No registrado'}</Text>
                </View>
            </View>

            {/* HISTORIAL FÍSICO */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Historial de Evaluaciones Físicas</Text>
                {datosReportes.length === 0 ? (
                    <Text style={styles.value}>No hay registros disponibles.</Text>
                ) : (
                    datosReportes.map((r, i) => (
                        <Evaluacion 
                            key={`fisico-${i}`} 
                            reporte={r} 
                            tipo="fisico" 
                        />
                    ))
                )}
            </View>

            {/* HISTORIAL PSICOLÓGICO */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Historial de Evaluaciones Psicológicas</Text>
                {datosReportes.length === 0 ? (
                    <Text style={styles.value}>No hay registros disponibles.</Text>
                ) : (
                    datosReportes.map((r, i) => (
                        <Evaluacion 
                            key={`psico-${i}`} 
                            reporte={r} 
                            tipo="psico" 
                        />
                    ))
                )}
            </View>

            {/* PIE DE PÁGINA */}
            <Text
                style={styles.pageNumber}
                render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
            />
            <Text style={styles.metadata}>
                Generado automáticamente el {new Date().toLocaleString()}
            </Text>
        </Page>
    </Document>
);

export default HistorialClinicoPDF;
