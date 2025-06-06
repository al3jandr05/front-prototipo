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
        borderBottomWidth: 2,
        borderBottomColor: '#ffa100',
        paddingBottom: 15,
    },
    headerLeft: { flex: 1 },
    headerRight: { flex: 1, alignItems: 'flex-end' },
    title: {
        fontSize: 24,
        color: '#ffa100',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        color: '#ffc867',
        marginBottom: 5,
    },
    section: {
        margin: 10,
        padding: 15,
        backgroundColor: '#FFFFFF',
    },
    sectionTitle: {
        fontSize: 18,
        color: '#ffa100',
        marginBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#ffc867',
        paddingBottom: 5,
        fontWeight: 'bold',
    },
    sectionSubtitle: {
        fontSize: 12,
        color: '#666666',
        marginBottom: 10,
        fontStyle: 'italic',
    },
    evaluacionItem: {
        marginBottom: 15,
        breakInside: 'avoid',
    },
    evaluacionMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 3,
    },
    evaluacionContenedor: {
        marginTop: 3,
        paddingLeft: 8,
        borderLeftWidth: 2,
        borderLeftColor: '#ffc867',
    },
    evaluacionContent: {
        fontSize: 12,
        color: '#333333',
        lineHeight: 1.4,
        textAlign: 'justify',
    },
    fecha: {
        fontSize: 11,
        color: '#ffc867',
    },
    reporteNumero: {
        fontSize: 11,
        color: '#ffc867',
        fontWeight: 'bold',
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    label: {
        width: '30%',
        fontSize: 12,
        color: '#ffc867',
        fontWeight: 'bold',
    },
    value: {
        flex: 1,
        fontSize: 12,
        color: '#333333',
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        marginVertical: 8,
    },
});

const TextoReporte = ({ content, maxLength = 800 }) => {
    if (!content) return <Text style={styles.evaluacionContent}>Sin datos registrados</Text>;

    if (content.length <= maxLength) {
        return <Text style={styles.evaluacionContent}>{content}</Text>;
    }

    return (
        <Text style={styles.evaluacionContent}>
            {`${content.substring(0, maxLength)}... [continúa]`}
        </Text>
    );
};

const HistorialClinicoPDF = ({ voluntario, datosReportes = [] }) => {
    return (
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
                    <Text style={styles.sectionSubtitle}>Registro cronológico de evaluaciones y observaciones físicas</Text>

                    {datosReportes.length === 0 ? (
                        <Text style={styles.evaluacionContent}>No hay evaluaciones físicas registradas.</Text>
                    ) : (
                        datosReportes.map((reporte, index) => (
                            <View key={`fisico-${index}`} style={styles.evaluacionItem}>
                                <View style={styles.evaluacionMeta}>
                                    <Text style={styles.reporteNumero}>Reporte N° {reporte.id}</Text>
                                    <Text style={styles.fecha}>Fecha: {reporte.fechaGenerado}</Text>
                                </View>
                                <View style={styles.evaluacionContenedor}>
                                    <TextoReporte content={reporte.resumenFisico} />
                                </View>
                            </View>
                        ))
                    )}
                </View>

                <View style={styles.divider} />

                {/* Historial de Evaluaciones Psicológicas */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Historial de Evaluaciones Psicológicas</Text>
                    <Text style={styles.sectionSubtitle}>Registro cronológico de evaluaciones y observaciones psicológicas</Text>

                    {datosReportes.length === 0 ? (
                        <Text style={styles.evaluacionContent}>No hay evaluaciones psicológicas registradas.</Text>
                    ) : (
                        datosReportes.map((reporte, index) => (
                            <View key={`psico-${index}`} style={styles.evaluacionItem}>
                                <View style={styles.evaluacionMeta}>
                                    <Text style={styles.reporteNumero}>Reporte N° {reporte.id}</Text>
                                    <Text style={styles.fecha}>Fecha: {reporte.fechaGenerado}</Text>
                                </View>
                                <View style={styles.evaluacionContenedor}>
                                    <TextoReporte content={reporte.resumenEmocional} />
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </Page>
        </Document>
    );
};

export default HistorialClinicoPDF;
