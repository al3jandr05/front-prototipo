import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
    },
    header: {
        flexDirection: 'row',
        marginBottom: 20,
        borderBottom: 2,
        borderBottomColor: '#1B4332',
        paddingBottom: 15,
    },
    headerLeft: {
        flex: 1,
    },
    headerRight: {
        flex: 1,
        alignItems: 'flex-end',
    },
    title: {
        fontSize: 24,
        color: '#1B4332',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        color: '#2D6A4F',
        marginBottom: 5,
    },
    section: {
        margin: 10,
        padding: 20,
        backgroundColor: '#FFFFFF',
        height: 'auto',
    },
    sectionTitle: {
        fontSize: 18,
        color: '#1B4332',
        marginBottom: 15,
        borderBottom: 2,
        borderBottomColor: '#2D6A4F',
        paddingBottom: 8,
        fontWeight: 'bold',
    },
    sectionSubtitle: {
        fontSize: 12,
        color: '#666666',
        marginBottom: 15,
        fontStyle: 'italic',
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 8,
        paddingVertical: 4,
    },
    label: {
        width: '30%',
        fontSize: 12,
        color: '#2D6A4F',
        fontWeight: 'bold',
    },
    value: {
        flex: 1,
        fontSize: 12,
        color: '#333333',
    },
    evaluacionItem: {
        marginBottom: 20,
    },
    evaluacionMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    evaluacionContenedor: {
        marginTop: 5,
        paddingLeft: 10,
        borderLeft: 3,
        borderLeftColor: '#2D6A4F',
    },
    evaluacionContent: {
        fontSize: 12,
        color: '#333333',
        lineHeight: 1.4,
        textAlign: 'justify',
        paddingRight: 5,
    },
    fecha: {
        fontSize: 11,
        color: '#2D6A4F',
    },
    reporteNumero: {
        fontSize: 11,
        color: '#2D6A4F',
        fontWeight: 'bold',
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 10,
        bottom: 20,
        right: 20,
        color: '#666666',
    },
    metadata: {
        position: 'absolute',
        fontSize: 8,
        bottom: 20,
        left: 20,
        color: '#999999',
    },
    divider: {
        borderBottom: 1,
        borderBottomColor: '#EEEEEE',
        marginVertical: 10,
    },
});

const HistorialClinicoPDF = ({ voluntario, datosReportes }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Encabezado */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.title}>Historial Clínico</Text>
                    <Text style={styles.subtitle}>GEVOPI - Gestión de Voluntarios Post-Incendio</Text>
                </View>
                <View style={styles.headerRight}>
                    <Text style={styles.fecha}>Fecha de emisión: {new Date().toLocaleDateString()}</Text>
                </View>
            </View>

            {/* Datos del Voluntario */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Datos del Voluntario</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Nombre Completo:</Text>
                    <Text style={styles.value}>{`${voluntario?.nombre || ''} ${voluntario?.apellido || ''}`}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>CI:</Text>
                    <Text style={styles.value}>{voluntario?.ci || 'No registrado'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Fecha de Nacimiento:</Text>
                    <Text style={styles.value}>{voluntario?.fecha_nacimiento || 'No registrado'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Tipo de Sangre:</Text>
                    <Text style={styles.value}>{voluntario?.tipo_sangre || 'No registrado'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Estado:</Text>
                    <Text style={styles.value}>{voluntario?.estado || 'No registrado'}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            {/* Historial de Evaluaciones Físicas */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Historial de Evaluaciones Físicas</Text>
                <Text style={styles.sectionSubtitle}>Registro cronológico de evaluaciones y observaciones físicas del voluntario</Text>
                
                {datosReportes.length === 0 ? (
                    <Text style={styles.value}>No hay evaluaciones físicas registradas.</Text>
                ) : (
                    datosReportes.map((reporte, index) => (
                        <View key={`fisico-${index}`} style={styles.evaluacionItem}>
                            <View style={styles.evaluacionMeta}>
                                <Text style={styles.reporteNumero}>Reporte N° {reporte.id}</Text>
                                <Text style={styles.fecha}>Fecha: {reporte.fechaGenerado}</Text>
                            </View>
                            <View style={styles.evaluacionContenedor}>
                                <Text style={styles.evaluacionContent}>
                                    {reporte.resumenFisico || 'Sin datos registrados'}
                                </Text>
                            </View>
                        </View>
                    ))
                )}
            </View>

            <View style={styles.divider} />

            {/* Historial de Evaluaciones Psicológicas */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Historial de Evaluaciones Psicológicas</Text>
                <Text style={styles.sectionSubtitle}>Registro cronológico de evaluaciones y observaciones psicológicas del voluntario</Text>
                
                {datosReportes.length === 0 ? (
                    <Text style={styles.value}>No hay evaluaciones psicológicas registradas.</Text>
                ) : (
                    datosReportes.map((reporte, index) => (
                        <View key={`emocional-${index}`} style={styles.evaluacionItem}>
                            <View style={styles.evaluacionMeta}>
                                <Text style={styles.reporteNumero}>Reporte N° {reporte.id}</Text>
                                <Text style={styles.fecha}>Fecha: {reporte.fechaGenerado}</Text>
                            </View>
                            <View style={styles.evaluacionContenedor}>
                                <Text style={styles.evaluacionContent}>
                                    {reporte.resumenEmocional || 'Sin datos registrados'}
                                </Text>
                            </View>
                        </View>
                    ))
                )}
            </View>

            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                `Página ${pageNumber} de ${totalPages}`
            )} />

            <Text style={styles.metadata}>
                Documento generado por GEVOPI el {new Date().toLocaleString()}
            </Text>
        </Page>
    </Document>
);

export default HistorialClinicoPDF;
