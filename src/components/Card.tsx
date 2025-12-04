
export const Card = ({
    title,
    value,
    color = "#333",
    isVideoActive,
}: {
    title: string;
    value: string;
    color?: string;
    imgURL?: string;
    isVideoActive: boolean;
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
      {isVideoActive ? (
        <h3 style={{
            margin: "0 0 12px 0",
            color: "#6b7280",
            fontSize: "14px",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
        }}>
            {title} 
        </h3>) : (
        <h3 style={{
            margin: "0 0 12px 0",
            color: "#6b7280",
            fontSize: "14px",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
        }}>
            Analyzing...
        </h3>
        )
      }
        
        {/* ESP32 Image Stream */}
          {isVideoActive ? (
              <img 
              src={"http://172.20.10.2/stream"} 
              alt="ESP32 Stream"
              style={{ 
                  width: "100%",        // Forces it to fit the card width
                  height: "auto",       // Maintains aspect ratio
                  borderRadius: "8px",  // Matches your card aesthetic
                  minHeight: "150px",   // Keeps the card open even if image fails
                  backgroundColor: "#f3f4f6", // Grey background to see if it's loading
                  objectFit: "cover"
                  }} 
              />) : (
              <img 
              src={"#"} 
              alt="ESP32 Stream"
              style={{ 
                  width: "100%",        // Forces it to fit the card width
                  height: "auto",       // Maintains aspect ratio
                  borderRadius: "50px",  // Matches your card aesthetic
                  minHeight: "150px",   // Keeps the card open even if image fails
                  objectFit: "cover"
                  }} 
              />
          )}        
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
