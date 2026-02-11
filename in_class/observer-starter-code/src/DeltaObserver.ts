import { Flight } from "./entity/Flight";
import { Observer } from "./StatusObserver";

export class DeltaObserver implements Observer {
  lastFlight: Flight | null = null;
  update(flight: Flight | null): void {
    if (this.lastFlight !== null && flight !== null) {
      console.log("Delta observer:");
      console.log(
        `Delta longitude: ${flight.longitude - this.lastFlight.longitude}`,
      );
      console.log(
        `Delta latitude: ${flight.latitude - this.lastFlight.latitude}`,
      );
      console.log(
        `Delta velocity: ${flight.velocity - this.lastFlight.velocity}`,
      );
      console.log(
        `Delta geo_altitude: ${flight.geo_altitude - this.lastFlight.geo_altitude}`,
      );
      console.log(
        `Delta baro_altitude: ${flight.baro_altitude - this.lastFlight.baro_altitude}`,
      );
    }
    this.lastFlight = flight;
  }
}
