import { Card } from "./Card";

export const CameraCard = ({ isVideoActive } : { isVideoActive: boolean }) => {
    return (
        <div style={{ height: "100%" }}>
            <Card title="Real time monitoring" value="Healthy" color="#10B981" isVideoActive={isVideoActive} />        
        </div>
    );
};
