import { Card } from "./Card";
import { fetchWater } from "../api/plant"; 

export const CameraCard = ({ isVideoActive } : { isVideoActive: boolean }) => {
    return (
        <div style={{ height: "100%" }}>
            <Card title="Real time monitoring" value="Healthy" color="#10B981" isVideoActive={isVideoActive} buttonOnclick={fetchWater} />       
        </div>
    );
};
