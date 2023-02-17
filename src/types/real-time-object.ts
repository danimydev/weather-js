import { Temperature } from "./temperature";

export type RealTimeObject = {
  lastUpdated: string;
  lastUpdatedEpoch: Number;
  temperature: Temperature;
  feelsLike: Temperature;
  condition: {
    text: string;
    iconUrl: string;
    code: Number;
  };
  wind: {
    speed: {
      kph: Number;
      mph: Number;
    };
    gust: {
      kph: Number;
      mph: Number;
    };
    degree: Number;
    direction: string;
  };
  preassure: {
    millibars: Number;
    inches: Number;
  };
  precipitation: {
    millimeters: Number;
    inches: Number;
  };
  humidity: Number;
  cloud: Number;
  uv: Number;
};
