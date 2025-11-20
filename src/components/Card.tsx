
export const Card = ({
    title,
    value,
    color = "#333",
}: {
    title: string;
    value: string;
    color?: string;
}) => (
    <div
        style={{
            border: "1px solid rgba(0,0,0,0.05)",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
            backgroundColor: "white",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            cursor: "default",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            boxSizing: "border-box",
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)";
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)";
        }}
    >
        <h3 style={{
            margin: "0 0 12px 0",
            color: "#6b7280",
            fontSize: "14px",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
        }}>
            {title}
        </h3>
        <div style={{
            fontSize: "32px",
            fontWeight: "700",
            color: color,
            letterSpacing: "-0.02em"
        }}>
            {value}
        </div>
    </div>
);
