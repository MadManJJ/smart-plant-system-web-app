import { Card } from "./Card";
import { fetchWater } from "../api/plant"; 
import type { SensorData } from "../types/SensorData";

export const CameraCard = ({ isVideoActive, data, checkPlantStatus } : { isVideoActive: boolean, data: SensorData, checkPlantStatus: () => void }) => {
    return (
        <div style={{ height: "100%" }}>
            <Card title="Real time monitoring" value="Healthy" color="#10B981" isVideoActive={isVideoActive} buttonOnclick={() => fetchWater(data)} checkPlantStatus={checkPlantStatus} />       
        </div>
    );
};
