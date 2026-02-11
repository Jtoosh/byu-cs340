import { Flight } from "./entity/Flight";

export interface Observer {
  update(flight: Flight | null): void;
}

export class StatusObserver implements Observer {
  update(flight: Flight | null): void {
    console.log("Status Observer:");
    console.log(`icao24 : ${flight?.icao24}`);
    console.log(`callsign : ${flight?.callsign}`);
    console.log(`country of origin : ${flight?.origin_country}`);
    console.log(`longitude : ${flight?.longitude}`);
    console.log(`latitude : ${flight?.latitude}`);
    console.log(`velocity : ${flight?.velocity}`);
    console.log(`geo_altitude : ${flight?.geo_altitude}`);
    console.log(`baro_altitude : ${flight?.baro_altitude}`);
  }
}
