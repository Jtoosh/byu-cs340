import { DeltaObserver } from "./DeltaObserver";
import { FlightFeed } from "./FlightFeed";
import { StatusObserver } from "./StatusObserver";

main();

function main() {
  let feed = new FlightFeed();
  feed.add(new StatusObserver())
  feed.add(new DeltaObserver())
  feed.start();
}
