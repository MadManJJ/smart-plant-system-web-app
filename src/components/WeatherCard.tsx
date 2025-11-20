

interface SensorData {
    board_id: number;
    temp: number;
    humidity: number;
    soil_moisture: number;
    light_level: number;
    motion_detected: boolean;
    rain_detected: boolean;
    timestamp: number;
}

export const WeatherCard = ({ data }: { data: SensorData }) => {
    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getConditionText = () => {
        if (data.rain_detected) return "Raining";
        if (data.soil_moisture < 20) return "Dry Soil";
        return "Healthy";
    };

    const getIcon = () => {
        if (data.rain_detected) return "🌧️";
        if (data.light_level > 80) return "☀️";
        return "⛅";
    };

    return (
        <div
            style={{
                backgroundColor: "white",
                borderRadius: "20px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                padding: "30px",
                maxWidth: "800px",
                margin: "0 auto",
                fontFamily: "system-ui, sans-serif",
                height: "100%",
                boxSizing: "border-box",
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "15px",
                    marginBottom: "20px",
                    color: "#666",
                    fontSize: "14px",
                    fontWeight: "600",
                    letterSpacing: "0.05em",
                }}
            >
                <span>Last Updated</span>
                <span>{new Date(data.timestamp).toLocaleString()}</span>
            </div>

            {/* Main Content */}
            <div style={{ display: "flex", flexDirection: "column", gap: "40px", flex: 1 }}>
                {/* Top Section: Big Temp & Condition */}
                <div style={{ width: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        <span style={{ fontSize: "64px" }}>{getIcon()}</span>
                        <div>
                            <div
                                style={{
                                    fontSize: "72px",
                                    fontWeight: "bold",
                                    lineHeight: "1",
                                    color: "#333",
                                }}
                            >
                                {data.temp.toFixed(0)}°
                            </div>
                            <div style={{ color: "#888", fontSize: "16px", marginTop: "5px" }}>
                            </div>
                        </div>
                    </div>
                    <div
                        style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            marginTop: "20px",
                            color: "#333",
                        }}
                    >
                        {getConditionText()}
                    </div>
                    <div
                        style={{
                            color: "#666",
                            fontSize: "14px",
                            marginTop: "5px",
                            fontWeight: "500",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                    </div>
                </div>

                {/* Bottom Section: Details List */}
                <div style={{ width: "100%", marginTop: "auto" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <DetailRow label="Humidity" value={`${data.humidity.toFixed(1)} %`} />
                        <div style={{ borderBottom: "1px solid #eee" }} />
                        <DetailRow label="Soil Moisture" value={`${data.soil_moisture}`} />
                        <div style={{ borderBottom: "1px solid #eee" }} />
                        <DetailRow label="Light Level" value={`${data.light_level}`} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailRow = ({
    label,
    value,
    valueColor = "#333",
}: {
    label: string;
    value: string;
    valueColor?: string;
}) => (
    <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "5px 0",
        }}
    >
        <span style={{ color: "#555", fontSize: "16px" }}>{label}</span>
        <span
            style={{
                color: valueColor,
                fontSize: "18px",
                fontWeight: "600",
            }}
        >
            {value}
        </span>
    </div>
);
