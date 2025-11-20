

export const LoadingScreen = () => {
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100vh",
                backgroundColor: "#f8f9fa", // Match dashboard background
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
            }}
        >
            <h2
                style={{
                    color: "#2d3436", // Dark text for light background
                    fontSize: "2rem",
                    fontWeight: "600",
                    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                    letterSpacing: "-0.02em",
                    // Removed white gradient shimmer as it won't show well on light bg, 
                    // or we can adapt it to a dark shimmer if desired. 
                    // For now, simple dark text with the requested emoji is safer and cleaner.
                    animation: "blink 0.8s infinite ease-in-out",
                }}
            >
                Loading Sensor Data...🌱
            </h2>
        </div>
    );
};
