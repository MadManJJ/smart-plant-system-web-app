import { Card } from "./Card";

export const CameraCard = ({ imgURL }: { imgURL?: string }) => {
    return (
        <div style={{ height: "100%" }}>
            <Card title="Real time monitoring" value="Healthy" color="#10B981" imgURL={imgURL || "http://172.20.10.2/stream"} />
        </div>
    );
};
